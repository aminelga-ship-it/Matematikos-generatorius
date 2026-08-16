import { isReasoningChatModel } from "./prompt.ts";
import { fixTaskLatex } from "./taskLatex.ts";

export const SOLVE_TASK_MODEL = "gpt-5.4";

export async function solveTaskFullViaOpenAI(params: {
  openaiKey: string;
  grade: number;
  question: string;
}): Promise<{ answer: string; solution: string } | { error: string }> {
  const question = params.question.trim();
  if (!question) {
    return { error: "Tuščia užduotis." };
  }

  const userMessage =
    `Esi matematikos profesorius. Išspręsk šį uždavinį.\n\n${question}\n\nAtsiųsk glaustą sprendimą (esminiai žingsniai) ir tikslų galutinį atsakymą.`;

  const model = SOLVE_TASK_MODEL;
  const reasoning = isReasoningChatModel(model);
  const tokenLimit = reasoning ? 6000 : 2000;

  const openaiBody: Record<string, unknown> = {
    model,
    messages: [
      {
        role: "system",
        content:
          `LT matematikos mokytojas (${params.grade} kl.). Grąžink tik JSON: {"answer":"…","solution":"…"}. answer — glaustas teisingas atsakymas; LaTeX $...$ kur reikia. solution — glausti esminiai sprendimo žingsniai (kelios eilutės, be ilgų paaiškinimų); LaTeX kur reikia. Be papildomų komentarų.`,
      },
      { role: "user", content: userMessage },
    ],
    response_format: { type: "json_object" },
    ...(reasoning
      ? { max_completion_tokens: tokenLimit }
      : { max_tokens: tokenLimit, temperature: 0.3 }),
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
    console.error("OpenAI solve-full error:", model, errText);
    return { error: "Nepavyko susisiekti su AI paslauga." };
  }

  const aiResponse = await response.json();
  const content = aiResponse.choices?.[0]?.message?.content ?? "";

  try {
    const cleaned = content.replace(/^```[\w]*\n?/m, "").replace(/```[\s]*$/m, "").trim();
    const parsed = JSON.parse(cleaned) as { answer?: string; solution?: string };
    const rawAnswer = typeof parsed.answer === "string" ? parsed.answer.trim() : "";
    const rawSolution = typeof parsed.solution === "string" ? parsed.solution.trim() : "";
    if (!rawAnswer) {
      return { error: "AI negrąžino atsakymo." };
    }
    const fixed = fixTaskLatex(
      { question: "", answer: rawAnswer, solution: rawSolution },
      params.grade,
    );
    return { answer: fixed.answer, solution: fixed.solution };
  } catch {
    console.error("Failed to parse solve-full response:", content);
    return { error: "Nepavyko apdoroti AI atsakymo." };
  }
}
