import { isReasoningChatModel } from "./prompt.ts";
import { fixTaskLatex, parseAiJsonContent } from "./taskLatex.ts";
import { ANSWER_ONLY_RULES } from "./solveTask.ts";

export const REVIEW_TASK_MODEL = "gpt-5.6-terra";

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
    "Patikrink užduotį kaip matematikos vadovėlio redaktorius, kad ji atitiktų pagrindinius Lietuvos BMP reikalavimus. Sąlyga turi būti logiška, nėra nereikalingų skaičių, atsakymas normalus skaičius tai klasei temai ir lygiui",
    "(arba yra prašymas suapvalinti), gramatika ir skyryba bei LaTeX tvarkingi. Jei reikia — pataisyk question.",
    "Apskaičiuok teisingą galutinį atsakymą (skaičiumi arba supaprastinta forma, ne formulės rinkiniu); jei sąlyga pakeista arba buvęs atsakymas neteisingas — pataisyk answer.",
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
          `Matematikos užduoties tikrintojas (${params.grade} kl.). Grąžink tik JSON: {"question":"…","answer":"…","changed":true|false,"recommendations":"…"}. question — patikrinta/pataisyta sąlyga (LaTeX $...$). ${ANSWER_ONLY_RULES} changed — true tik jei pakeitei sąlygą. recommendations — TIK vienas iš dviejų: „Sąlyga tinkama“ ARBA „Pataisyta sąlyga“. Nerašyk sprendimo ar ilgų komentarų.`,
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
    const parsed = parseAiJsonContent(content) as {
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
