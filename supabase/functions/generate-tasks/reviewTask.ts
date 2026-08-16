import { isReasoningChatModel } from "./prompt.ts";
import { fixTaskLatex } from "./taskLatex.ts";

export const REVIEW_TASK_MODEL = "gpt-5.4";

export type TaskReviewResult = {
  question: string;
  answer: string;
  changed: boolean;
  recommendations: string;
};

export async function reviewTaskViaOpenAI(params: {
  openaiKey: string;
  grade: number;
  difficulty: string;
  question: string;
  supabaseAdmin?: unknown;
  topicIds?: string[];
  subtopicIds?: string[];
}): Promise<TaskReviewResult | { error: string }> {
  const question = params.question.trim();
  if (!question) {
    return { error: "Tuščia užduotis." };
  }

  const userMessage = [
    "Sąlyga:",
    question,
    "",
    "Patikrink ar sąlyga logiška, atsakymas normalus skaičius pagal temą ir klasę (arba yra prašymas suapvalinti), kalba, LaTeX tvarkingi. Jei reikia — pataisyk question.",
    "Apskaičiuok teisingą atsakymą; jei sąlyga pakeista arba buvęs atsakymas neteisingas — pataisyk answer.",
    "recommendations: jei sąlyga nepakeista — tiksliai „Sąlyga tinkama“; jei pakeista — tiksliai „Pataisyta sąlyga“.",
  ].join("\n");

  const model = REVIEW_TASK_MODEL;
  const reasoning = isReasoningChatModel(model);
  const tokenLimit = reasoning ? 4000 : 1200;

  const openaiBody: Record<string, unknown> = {
    model,
    messages: [
      {
        role: "system",
        content:
          `Matematikos užduoties tikrintojas (${params.grade} kl.). Grąžink tik JSON: {"question":"…","answer":"…","changed":true|false,"recommendations":"…"}. question — patikrinta/pataisyta sąlyga (LaTeX $...$). answer — teisingas galutinis atsakymas (su $...$), be sprendimo žingsnių. changed — true tik jei pakeitei sąlygą. recommendations — TIK vienas iš dviejų: „Sąlyga tinkama“ ARBA „Pataisyta sąlyga“. Nerašyk sprendimo ar ilgų komentarų.`,
      },
      { role: "user", content: userMessage },
    ],
    response_format: { type: "json_object" },
    ...(reasoning
      ? { max_completion_tokens: tokenLimit }
      : { max_tokens: tokenLimit, temperature: 0.2 }),
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.openaiKey}`,
    },
    body: JSON.stringify(openaiBody),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("OpenAI review error:", model, errText);
    return { error: "Nepavyko susisiekti su AI paslauga." };
  }

  const aiResponse = await response.json();
  const content = aiResponse.choices?.[0]?.message?.content ?? "";

  try {
    const cleaned = content.replace(/^```[\w]*\n?/m, "").replace(/```[\s]*$/m, "").trim();
    const parsed = JSON.parse(cleaned) as {
      question?: string;
      answer?: string;
      changed?: boolean;
      recommendations?: string;
    };

    const rawQuestion = typeof parsed.question === "string" ? parsed.question.trim() : "";
    const rawAnswer = typeof parsed.answer === "string" ? parsed.answer.trim() : "";

    if (!rawQuestion) {
      return { error: "AI negrąžino užduoties teksto." };
    }

    const fixed = fixTaskLatex(
      { question: rawQuestion, answer: rawAnswer, solution: "" },
      params.grade,
    );
    const changed =
      parsed.changed === true ||
      (parsed.changed !== false && fixed.question.trim() !== question.trim());

    const answer = fixed.answer.trim();
    const recommendations = changed
      ? "Pataisyta sąlyga"
      : "Sąlyga tinkama";

    return {
      question: fixed.question,
      answer,
      changed,
      recommendations,
    };
  } catch {
    console.error("Failed to parse review response:", content);
    return { error: "Nepavyko apdoroti AI atsakymo." };
  }
}
