import {
  buildImageUserContent,
  buildSystemPrompt,
  buildUserMessage,
  isImageOnlyRequest,
  isReasoningChatModel,
  selectModel,
  selectTemperature,
  type SystemPromptProfile,
} from "./prompt.ts";
import { diagramConfigHasRequiredData } from "./diagram.ts";
import { fixTaskLatex, type Task } from "./taskLatex.ts";

export async function generateTasksViaOpenAI(params: {
  openaiKey: string;
  grade: number;
  difficulty: string;
  taskCount: number;
  prompt: string;
  imageBase64?: string;
  withDiagram: boolean;
  withGraph: boolean;
  includeSolutions: boolean;
  promptProfile?: SystemPromptProfile;
  topicSubtopicGuided?: boolean;
  omitAnswers?: boolean;
}): Promise<{ tasks: Task[]; model: string } | { error: string }> {
  const {
    openaiKey,
    grade,
    difficulty,
    taskCount,
    prompt,
    imageBase64,
    withDiagram,
    withGraph,
    includeSolutions,
    promptProfile: promptProfileIn,
    topicSubtopicGuided = false,
    omitAnswers = false,
  } = params;

  const imageOnly = isImageOnlyRequest(prompt ?? "", !!imageBase64);
  const promptProfile: SystemPromptProfile = promptProfileIn ??
    (imageOnly ? "image-only" : "text");

  const userContent = imageBase64
    ? buildImageUserContent(taskCount, prompt, imageBase64)
    : buildUserMessage(taskCount, prompt);

  const effectiveIncludeSolutions = promptProfile === "image-only" ? false : includeSolutions;

  const model = selectModel(grade, difficulty, withDiagram, withGraph);
  console.log("generate-tasks AI model:", model, { grade, difficulty, withDiagram, withGraph });
  const reasoning = isReasoningChatModel(model);
  let tokenLimit = effectiveIncludeSolutions
    ? 8000
    : Math.min(6000, 600 + taskCount * 320);
  if (reasoning) {
    tokenLimit = Math.max(tokenLimit * 2, 12_000);
  }

  const openaiBody: Record<string, unknown> = {
    model,
    messages: [
      {
        role: "system",
        content: buildSystemPrompt(
          grade,
          difficulty,
          taskCount,
          withDiagram,
          withGraph,
          effectiveIncludeSolutions,
          promptProfile,
          topicSubtopicGuided,
          omitAnswers,
        ),
      },
      { role: "user", content: userContent },
    ],
    ...(reasoning
      ? { max_completion_tokens: tokenLimit }
      : {
        max_tokens: tokenLimit,
        temperature: selectTemperature(grade, difficulty),
      }),
  };

  if (!imageBase64) {
    openaiBody.response_format = { type: "json_object" };
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openaiKey}`,
    },
    body: JSON.stringify(openaiBody),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("OpenAI error:", model, errText);
    return { error: "Nepavyko susisiekti su AI paslauga." };
  }

  const aiResponse = await response.json();
  const content = aiResponse.choices?.[0]?.message?.content ?? "";

  try {
    const cleaned = content.replace(/^```[\w]*\n?/m, "").replace(/```[\s]*$/m, "").trim();
    const parsed = JSON.parse(cleaned);
    let tasks: Task[] = [];
    if (Array.isArray(parsed)) {
      tasks = parsed;
    } else if (Array.isArray(parsed.tasks)) {
      tasks = parsed.tasks;
    } else {
      throw new Error("No tasks array in response");
    }
    tasks = tasks.map((t) => fixTaskLatex(t, grade));
    if (withDiagram) {
      const invalid = tasks.find(
        (t) => !diagramConfigHasRequiredData(t.question, t.diagram_config),
      );
      if (invalid) {
        console.error("Diagram validation failed:", invalid.question, invalid.diagram_config);
        return {
          error:
            "AI brėžinyje nepažymėjo pakankamai duomenų (kraštinės, kampai). Bandykite generuoti dar kartą.",
        };
      }
    }
    if (!effectiveIncludeSolutions) {
      tasks = tasks.map((t) => ({ ...t, solution: "" }));
    }
    if (omitAnswers) {
      tasks = tasks.map((t) => ({ ...t, answer: "", solution: "" }));
    }
    if (withGraph && grade >= 9) {
      tasks = tasks.filter(
        (t) => typeof t.function_equation === "string" && t.function_equation.trim().length > 0,
      );
    }
    if (tasks.length === 0) {
      return { error: "AI negrąžino užduočių." };
    }
    return { tasks, model };
  } catch {
    console.error("Failed to parse AI response:", content);
    return { error: "Nepavyko apdoroti AI atsakymo. Bandykite dar kartą." };
  }
}
