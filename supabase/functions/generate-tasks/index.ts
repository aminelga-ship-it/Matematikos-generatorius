import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { insertTasksAsBankDrafts, selectTasksFromBank, type BankDifficulty } from "./bank.ts";
import type { DiagramConfig } from "./diagram.ts";
import { generateTasksViaOpenAI } from "./openaiTasks.ts";
import { PLAN_LIMITS } from "./planLimits.ts";
import { isImageOnlyRequest } from "./prompt.ts";
import { IVAIRUS_MIN_TASKS, isMixedDifficulty, splitIvairusTaskCounts, splitMixedTaskCounts } from "./prompt.ts";
import { assertLoggedInWithinLimits, incrementLoggedInUsage, type ProfileUsage } from "./profileUsage.ts";
import { buildSavarankiskasTopicPrompt } from "./savarankiskas.ts";
import { fixTaskLatex, type Task } from "./taskLatex.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface TaskRequest {
  grade: number;
  taskCount: number;
  prompt: string;
  difficulty: string;
  imageBase64?: string;
  withDiagram?: boolean;
  withGraph?: boolean;
  /** Default false — taupo tokenus, kai sprendimų nereikia */
  withSolution?: boolean;
  /** Generavimo režimas: pagal temą (bankas+AI) ar pagal tekstą */
  generationMode?: "topic" | "text";
  /** Pagal temą — potemių ID sąrašas */
  subtopicIds?: string[];
  /** Pagal temą — temų be potemių ID sąrašas */
  topicIds?: string[];
}

function bankDifficultyFromRequest(difficulty: string): BankDifficulty {
  if (difficulty === "lengvos" || difficulty === "sunkios") return difficulty;
  if (difficulty === "ivairus" || difficulty === "savarankiskas") return "vidutinės";
  return "vidutinės";
}

function shuffleTasks<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}


Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  const supabaseUserClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader ?? "" } },
  });

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  const {
    data: { user },
  } = await supabaseUserClient.auth.getUser();

  let userProfile = null;
  if (user) {
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    userProfile = profile;
  }

  try {
    const {
      grade,
      taskCount,
      prompt,
      difficulty,
      imageBase64,
      withDiagram,
      withGraph,
      withSolution,
      generationMode,
      subtopicIds,
      topicIds,
    }: TaskRequest = await req.json();

    if (!user || !userProfile) {
      return new Response(
        JSON.stringify({ error: "Norėdami generuoti užduotis, prisijunkite." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const userPlan = userProfile.plan ?? "free";
    const isAdmin = userProfile.role === "admin";
    const hasProAccess = isAdmin || userPlan === "pro" || userPlan === "unlimited";
    const skipUsageCount = isAdmin || userPlan === "unlimited";

    let loggedInPeriod: {
      requestsToday: number;
      requestsMonth: number;
      tasksMonth: number;
      usageDay: string;
      usageMonth: string;
    } | null = null;

    const check = assertLoggedInWithinLimits(userProfile as ProfileUsage, taskCount);
    if (!check.ok) {
      return new Response(
        JSON.stringify({
          error: check.error,
          ...(check.code ? { code: check.code } : {}),
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    loggedInPeriod = check.period;

    if (!grade || grade < 1 || grade > 12) {
      return new Response(
        JSON.stringify({ error: "Netinkama klasė. Pasirinkite nuo 1 iki 12." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!taskCount || taskCount < 1 || taskCount > 15) {
      return new Response(
        JSON.stringify({ error: "Netinkamas užduočių skaičius. Pasirinkite nuo 1 iki 15." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const effectiveDifficulty = difficulty ?? "vidutinės";
    const isTopicMode = generationMode === "topic";
    const topicBankMode: BankDifficulty | "mix" =
      isTopicMode && isMixedDifficulty(effectiveDifficulty)
        ? "mix"
        : isTopicMode &&
            (effectiveDifficulty === "lengvos" ||
              effectiveDifficulty === "vidutinės" ||
              effectiveDifficulty === "sunkios")
          ? effectiveDifficulty
          : "mix";

    const includeSolutionsAll =
      withSolution === true &&
      !isTopicMode &&
      grade >= 7 &&
      effectiveDifficulty === "sunkios";
    const includeSolutionsHardInMix =
      withSolution === true &&
      !isTopicMode &&
      grade >= 7 &&
      effectiveDifficulty === "ivairus";
    const includeSolutions = includeSolutionsAll || includeSolutionsHardInMix;

    const perGenerationMax = hasProAccess
      ? PLAN_LIMITS.pro.maxTasksPerGeneration
      : PLAN_LIMITS.free.maxTasksPerGeneration;
    if (taskCount > perGenerationMax) {
      return new Response(
        JSON.stringify({
          error: hasProAccess
            ? "Vienu metu galite generuoti ne daugiau nei 15 užduočių."
            : "Nemokamame plane vienu metu galima generuoti 1 užduotį. Atnaujinkite į PRO arba Unlimited.",
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (isMixedDifficulty(effectiveDifficulty) && taskCount < IVAIRUS_MIN_TASKS) {
      return new Response(
        JSON.stringify({
          error: `Įvairaus sudėtingumo reikia bent ${IVAIRUS_MIN_TASKS} užduočių (maks. 15).`,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const subtopicIdList = Array.isArray(subtopicIds)
      ? subtopicIds.filter((id): id is string => typeof id === "string" && id.length > 0)
      : [];
    const topicIdList = Array.isArray(topicIds)
      ? topicIds.filter((id): id is string => typeof id === "string" && id.length > 0)
      : [];

    const hasPrompt = prompt && prompt.trim().length >= 3;
    const hasImage = !!imageBase64;

    if (isTopicMode) {
      if (subtopicIdList.length === 0 && topicIdList.length === 0) {
        return new Response(
          JSON.stringify({ error: "Pasirinkite bent vieną temą arba potemę." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    } else if (!hasPrompt && !hasImage) {
      return new Response(
        JSON.stringify({ error: "Prašome aprašyti norimą užduotį arba įkelti nuotrauką." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const effectiveWithDiagram = !!(withDiagram && grade >= 1 && grade <= 6);
    const effectiveWithGraph = !!(withGraph && grade >= 9);

    if (isTopicMode) {
      const { tasks: bankTasks, error: bankError } = await selectTasksFromBank(
        supabaseAdmin,
        grade,
        { subtopicIds: subtopicIdList, topicIds: topicIdList },
        taskCount,
        topicBankMode,
        user?.id ?? null,
      );

      if (bankError) {
        return new Response(
          JSON.stringify({ error: bankError }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const needAi = taskCount - bankTasks.length;
      let aiTasks: Task[] = [];

      if (needAi > 0) {
        const openaiKey = Deno.env.get("OPENAI_API_KEY");
        if (!openaiKey) {
          return new Response(
            JSON.stringify({ error: "OpenAI API raktas nesukonfigūruotas." }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }

        const aiDifficulty =
          effectiveDifficulty === "savarankiskas" ? "savarankiskas" : effectiveDifficulty;

        const { prompt: topicPrompt, subtopicGuided } = await buildSavarankiskasTopicPrompt(
          supabaseAdmin,
          topicIdList,
          subtopicIdList,
          grade,
          aiDifficulty,
          needAi,
        );

        const aiResult = await generateTasksViaOpenAI({
          openaiKey,
          grade,
          difficulty: aiDifficulty,
          taskCount: needAi,
          prompt: topicPrompt,
          withDiagram: effectiveWithDiagram,
          withGraph: effectiveWithGraph,
          includeSolutions: false,
          promptProfile: "topic",
          topicSubtopicGuided: subtopicGuided,
        });

        if ("error" in aiResult) {
          return new Response(
            JSON.stringify({ error: aiResult.error }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }

        let generated = aiResult.tasks.slice(0, needAi);
        if (generated.length < needAi) {
          return new Response(
            JSON.stringify({
              error: `AI sugeneravo per mažai užduočių (${generated.length}/${needAi}). Bandykite dar kartą.`,
            }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }

        const mixedCounts = splitMixedTaskCounts(effectiveDifficulty, needAi);
        const difficultyForIndex = isMixedDifficulty(effectiveDifficulty)
          ? (i: number): BankDifficulty => {
              if (i < mixedCounts.lengvos) return "lengvos";
              if (i < mixedCounts.lengvos + mixedCounts.vidutinės) return "vidutinės";
              return "sunkios";
            }
          : undefined;

        const tasksWithBank = await insertTasksAsBankDrafts(supabaseAdmin, {
          grade,
          difficulty: bankDifficultyFromRequest(effectiveDifficulty),
          generationPrompt: topicPrompt,
          createdBy: user?.id ?? null,
          curriculum: { subtopicIds: subtopicIdList, topicIds: topicIdList },
          ...(difficultyForIndex ? { difficultyForIndex } : {}),
          tasks: generated,
        });
        aiTasks = tasksWithBank.map((t) => ({
          question: t.question,
          answer: t.answer,
          solution: t.solution,
          diagram_config: t.diagram_config as DiagramConfig | undefined,
          function_equation: t.function_equation,
          bank_item_id: t.bank_item_id || undefined,
        }));
      }

      const bankMapped: Task[] = bankTasks.map((t) => ({
        question: t.question,
        answer: t.answer,
        solution: t.solution,
        diagram_config: t.diagram_config as DiagramConfig | undefined,
        function_equation: t.function_equation,
        bank_item_id: t.bank_item_id,
      }));

      let tasks = shuffleTasks([...bankMapped, ...aiTasks]).map((t) => fixTaskLatex(t, grade));

      if (loggedInPeriod && !skipUsageCount) {
        await incrementLoggedInUsage(
          supabaseAdmin,
          userProfile as ProfileUsage,
          taskCount,
          loggedInPeriod,
        );
      }

      return new Response(
        JSON.stringify({
          tasks,
          fromBank: needAi === 0,
          bankCount: bankTasks.length,
          aiCount: aiTasks.length,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API raktas nesukonfigūruotas." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiDifficulty =
      effectiveDifficulty === "ivairus" ? "ivairus" : effectiveDifficulty;

    const aiResult = await generateTasksViaOpenAI({
      openaiKey,
      grade,
      difficulty: aiDifficulty,
      taskCount,
      prompt,
      imageBase64,
      withDiagram: effectiveWithDiagram,
      withGraph: effectiveWithGraph,
      includeSolutions: includeSolutions,
      promptProfile: isImageOnlyRequest(prompt ?? "", !!imageBase64) ? "image-only" : "text",
    });

    if ("error" in aiResult) {
      return new Response(
        JSON.stringify({ error: aiResult.error }),
        { status: aiResult.error.includes("AI paslauga") ? 502 : 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let tasks = aiResult.tasks;
    if (tasks.length > taskCount) {
      tasks = tasks.slice(0, taskCount);
    }
    if (tasks.length < taskCount) {
      return new Response(
        JSON.stringify({
          error: `AI sugeneravo per mažai užduočių (${tasks.length}/${taskCount}). Bandykite dar kartą.`,
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const tasksWithBank = await insertTasksAsBankDrafts(supabaseAdmin, {
      grade,
      difficulty: bankDifficultyFromRequest(effectiveDifficulty),
      generationPrompt: prompt?.trim() ?? "",
      createdBy: user?.id ?? null,
      ...(effectiveDifficulty === "ivairus"
        ? {
            difficultyForIndex: (i: number) => {
              const c = splitIvairusTaskCounts(tasks.length);
              if (i < c.lengvos) return "lengvos" as BankDifficulty;
              if (i < c.lengvos + c.vidutinės) return "vidutinės" as BankDifficulty;
              return "sunkios" as BankDifficulty;
            },
          }
        : {}),
      tasks,
    });
    tasks = tasksWithBank.map((t) => ({
      question: t.question,
      answer: t.answer,
      solution: t.solution,
      diagram_config: t.diagram_config as DiagramConfig | undefined,
      function_equation: t.function_equation,
      bank_item_id: t.bank_item_id || undefined,
    }));

    if (loggedInPeriod && !skipUsageCount) {
      await incrementLoggedInUsage(
        supabaseAdmin,
        userProfile as ProfileUsage,
        taskCount,
        loggedInPeriod,
      );
    }
    return new Response(
      JSON.stringify({
        tasks,
        fromBank: false,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Įvyko klaida. Bandykite dar kartą." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
