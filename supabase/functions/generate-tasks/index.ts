import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { insertTasksAsBankDrafts, selectTasksFromBank, type BankDifficulty } from "./bank.ts";
import type { DiagramConfig } from "./diagram.ts";
import { generateTasksViaOpenAI } from "./openaiTasks.ts";
import { PLAN_LIMITS } from "./planLimits.ts";
import { isImageOnlyRequest } from "./prompt.ts";
import { IVAIRUS_MIN_TASKS, isMixedDifficulty, splitIvairusTaskCounts, splitMixedTaskCounts } from "./prompt.ts";
import { assertLoggedInWithinLimits, incrementLoggedInUsage, assertSecondaryWithinLimits, incrementSecondaryUsage, type ProfileUsage } from "./profileUsage.ts";
import { buildSavarankiskasTopicPrompt } from "./savarankiskas.ts";
import { solveTaskViaOpenAI } from "./solveTask.ts";
import { reviewTaskViaOpenAI } from "./reviewTask.ts";
import { fixTaskLatex, type Task } from "./taskLatex.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface TaskRequest {
  action?: "solve" | "review";
  grade: number;
  taskCount: number;
  prompt: string;
  difficulty: string;
  imageBase64?: string;
  withDiagram?: boolean;
  withGraph?: boolean;
  /** Generavimo režimas: pagal temą (bankas+AI) ar pagal tekstą */
  generationMode?: "topic" | "text";
  /** Pagal temą — potemių ID sąrašas */
  subtopicIds?: string[];
  /** Pagal temą — temų be potemių ID sąrašas */
  topicIds?: string[];
  /** action=solve — užduoties tekstas */
  question?: string;
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

function shouldOmitAiAnswers(grade: number, hasImage: boolean): boolean {
  if (hasImage) return true;
  return grade >= 7;
}

function stripAiGeneratedContent(task: Task, omitAnswers: boolean): Task {
  if (!omitAnswers) return task;
  return { ...task, answer: "", solution: "" };
}

function mapTaskForClient(task: Task): Task {
  return {
    question: task.question,
    answer: task.answer,
    solution: task.solution,
    diagram_config: task.diagram_config,
    function_equation: task.function_equation,
    bank_item_id: task.bank_item_id || undefined,
    from_approved_bank: task.from_approved_bank,
    task_difficulty: task.task_difficulty,
  };
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
    const body: TaskRequest = await req.json();
    const {
      action,
      grade,
      taskCount,
      prompt,
      difficulty,
      imageBase64,
      withDiagram,
      withGraph,
      generationMode,
      subtopicIds,
      topicIds,
      question: solveQuestion,
    } = body;

    if (!user || !userProfile) {
      return new Response(
        JSON.stringify({ error: "Norėdami generuoti užduotis, prisijunkite." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const userPlan = userProfile.plan ?? "free";
    const isAdmin = userProfile.role === "admin";
    const skipUsageCount = isAdmin || userPlan === "unlimited";

    if (action === "review") {
      if (!grade || grade < 1 || grade > 12) {
        return new Response(
          JSON.stringify({ error: "Netinkama klasė." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const q = typeof solveQuestion === "string" ? solveQuestion.trim() : "";
      if (!q) {
        return new Response(
          JSON.stringify({ error: "Nenurodytas uždavinys." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const openaiKey = Deno.env.get("OPENAI_API_KEY");
      if (!openaiKey) {
        return new Response(
          JSON.stringify({ error: "OpenAI API raktas nesukonfigūruotas." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const reviewCheck = assertSecondaryWithinLimits(userProfile as ProfileUsage);
      if (!reviewCheck.ok) {
        return new Response(
          JSON.stringify({
            error: reviewCheck.error,
            ...(reviewCheck.code ? { code: reviewCheck.code } : {}),
          }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const reviewResult = await reviewTaskViaOpenAI({
        openaiKey,
        grade,
        difficulty: difficulty ?? "vidutinės",
        question: q,
        supabaseAdmin,
        topicIds: Array.isArray(topicIds) ? topicIds : [],
        subtopicIds: Array.isArray(subtopicIds) ? subtopicIds : [],
      });
      if ("error" in reviewResult) {
        return new Response(
          JSON.stringify({ error: reviewResult.error }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      if (!skipUsageCount) {
        await incrementSecondaryUsage(
          supabaseAdmin,
          userProfile as ProfileUsage,
          reviewCheck.period,
        );
      }

      return new Response(
        JSON.stringify({
          question: reviewResult.question,
          answer: reviewResult.answer,
          changed: reviewResult.changed,
          recommendations: reviewResult.recommendations,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (action === "solve") {
      if (!grade || grade < 1 || grade > 12) {
        return new Response(
          JSON.stringify({ error: "Netinkama klasė." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const q = typeof solveQuestion === "string" ? solveQuestion.trim() : "";
      if (!q) {
        return new Response(
          JSON.stringify({ error: "Nenurodytas uždavinys." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const solveCheck = assertSecondaryWithinLimits(userProfile as ProfileUsage);
      if (!solveCheck.ok) {
        return new Response(
          JSON.stringify({
            error: solveCheck.error,
            ...(solveCheck.code ? { code: solveCheck.code } : {}),
          }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const openaiKey = Deno.env.get("OPENAI_API_KEY");
      if (!openaiKey) {
        return new Response(
          JSON.stringify({ error: "OpenAI API raktas nesukonfigūruotas." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const solveResult = await solveTaskViaOpenAI({ openaiKey, grade, question: q });
      if ("error" in solveResult) {
        return new Response(
          JSON.stringify({ error: solveResult.error }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      if (!skipUsageCount) {
        await incrementSecondaryUsage(
          supabaseAdmin,
          userProfile as ProfileUsage,
          solveCheck.period,
        );
      }

      return new Response(
        JSON.stringify({ answer: solveResult.answer }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const hasProAccess = isAdmin || userPlan === "pro" || userPlan === "unlimited";

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
    const omitAiAnswers = shouldOmitAiAnswers(grade, !!imageBase64);

    if (isTopicMode) {
      const aiDifficulty =
        effectiveDifficulty === "savarankiskas" ? "savarankiskas" : effectiveDifficulty;

      const {
        prompt: topicPrompt,
        subtopicGuided,
        deferredAnswers,
      } = await buildSavarankiskasTopicPrompt(
        supabaseAdmin,
        topicIdList,
        subtopicIdList,
        grade,
        aiDifficulty,
        taskCount,
      );

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
      let aiModel: string | undefined;

      if (needAi > 0) {
        const openaiKey = Deno.env.get("OPENAI_API_KEY");
        if (!openaiKey) {
          return new Response(
            JSON.stringify({ error: "OpenAI API raktas nesukonfigūruotas." }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }

        const aiResult = await generateTasksViaOpenAI({
          openaiKey,
          grade,
          difficulty: aiDifficulty,
          taskCount: needAi,
          prompt: topicPrompt,
          withDiagram: effectiveWithDiagram,
          withGraph: effectiveWithGraph,
          promptProfile: "topic",
          topicSubtopicGuided: subtopicGuided,
          omitAnswers: omitAiAnswers,
        });

        if ("error" in aiResult) {
          return new Response(
            JSON.stringify({ error: aiResult.error }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }

        let generated = aiResult.tasks.slice(0, needAi);
        aiModel = aiResult.model;
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
        const defaultAiDifficulty = bankDifficultyFromRequest(effectiveDifficulty);
        aiTasks = tasksWithBank.map((t, i) =>
          stripAiGeneratedContent(
            {
              question: t.question,
              answer: t.answer,
              solution: t.solution,
              diagram_config: t.diagram_config as DiagramConfig | undefined,
              function_equation: t.function_equation,
              bank_item_id: t.bank_item_id || undefined,
              task_difficulty: difficultyForIndex?.(i) ?? defaultAiDifficulty,
            },
            omitAiAnswers,
          ),
        );
      }

      const bankMapped: Task[] = bankTasks.map((t) => ({
        question: t.question,
        answer: t.answer,
        solution: t.solution,
        diagram_config: t.diagram_config as DiagramConfig | undefined,
        function_equation: t.function_equation,
        bank_item_id: t.bank_item_id,
        from_approved_bank: true,
        task_difficulty: t.task_difficulty,
      }));

      let tasks = shuffleTasks([...bankMapped, ...aiTasks]).map((t) =>
        mapTaskForClient(fixTaskLatex(t, grade)),
      );

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
          aiModel,
          deferredAnswers,
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

    const isImageOnly = isImageOnlyRequest(prompt ?? "", !!imageBase64);
    const aiResult = await generateTasksViaOpenAI({
      openaiKey,
      grade,
      difficulty: aiDifficulty,
      taskCount,
      prompt,
      imageBase64,
      withDiagram: effectiveWithDiagram,
      withGraph: effectiveWithGraph,
      promptProfile: isImageOnly ? "image-only" : "text",
      omitAnswers: omitAiAnswers,
    });

    if ("error" in aiResult) {
      return new Response(
        JSON.stringify({ error: aiResult.error }),
        { status: aiResult.error.includes("AI paslauga") ? 502 : 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const aiModel = aiResult.model;

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

    const textDifficultyForIndex =
      effectiveDifficulty === "ivairus"
        ? (i: number) => {
            const c = splitIvairusTaskCounts(tasks.length);
            if (i < c.lengvos) return "lengvos" as BankDifficulty;
            if (i < c.lengvos + c.vidutinės) return "vidutinės" as BankDifficulty;
            return "sunkios" as BankDifficulty;
          }
        : undefined;

    const tasksWithBank = await insertTasksAsBankDrafts(supabaseAdmin, {
      grade,
      difficulty: bankDifficultyFromRequest(effectiveDifficulty),
      generationPrompt: prompt?.trim() ?? "",
      createdBy: user?.id ?? null,
      ...(textDifficultyForIndex
        ? { difficultyForIndex: textDifficultyForIndex }
        : {}),
      tasks,
    });
    const defaultTextDifficulty = bankDifficultyFromRequest(effectiveDifficulty);
    tasks = tasksWithBank.map((t, i) =>
      stripAiGeneratedContent(
        {
          question: t.question,
          answer: t.answer,
          solution: t.solution,
          diagram_config: t.diagram_config as DiagramConfig | undefined,
          function_equation: t.function_equation,
          bank_item_id: t.bank_item_id || undefined,
          task_difficulty: textDifficultyForIndex?.(i) ?? defaultTextDifficulty,
        },
        omitAiAnswers,
      ),
    );

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
        tasks: tasks.map((t) => mapTaskForClient(fixTaskLatex(t, grade))),
        fromBank: false,
        aiCount: tasks.length,
        aiModel,
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
