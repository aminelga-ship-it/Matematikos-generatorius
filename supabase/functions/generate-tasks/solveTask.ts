import { isReasoningChatModel } from "./prompt.ts";
import { fixTaskLatex, parseAiJsonContent, type Task } from "./taskLatex.ts";

export const SOLVE_TASK_MODEL = "gpt-5.6-terra";

/** Bendros taisyklės antriniam atsakymo generavimui — ne sprendimas. */
export const ANSWER_ONLY_RULES = `answer — TIK galutinis rezultatas (skaičius, supaprastinta trupmena, intervalas, išraiška po supaprastinimo). Kelios dalys: 1) …; 2) … — tik galutinės reikšmės, be etikečių „Atsakymas“.
DRAUDŽIAMA answer: sprendimo žingsniai, neišsiskaitytos formulės, binominių koeficientų sumos, $P_n(k)=C_n^k p^k q^{n-k}$ be skaičiavimo, kombinatorikos/tikimybių formulės vietoje skaičiaus.
Tikimybės ir Bernulio bandymai — apskaičiuok ir pateik skaičiumi (pvz. $0.34$) arba supaprastinta trupmena (pvz. $\\frac{17}{50}$), ne formulių rinkinį. Jei sąlyga prašia suapvalinti — suapvalink.`;

export async function solveTaskViaOpenAI(params: {
  openaiKey: string;
  grade: number;
  question: string;
}): Promise<{ answer: string } | { error: string }> {
  const question = params.question.trim();
  if (!question) {
    return { error: "Tuščia užduotis." };
  }

  const userMessage = `Rask tik galutinį atsakymą (be sprendimo žingsnių, be formulės vietoje skaičiaus):\n\n${question}`;

  const model = SOLVE_TASK_MODEL;
  const reasoning = isReasoningChatModel(model);
  const tokenLimit = reasoning ? 4000 : 800;

  const openaiBody: Record<string, unknown> = {
    model,
    messages: [
      {
        role: "system",
        content:
          `LT matematikos mokytojas (${params.grade} kl.). Grąžink tik JSON: {"answer":"…"}. ${ANSWER_ONLY_RULES} LaTeX $...$ kur reikia. Be sprendimo, be paaiškinimų.`,
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
    console.error("OpenAI solve error:", model, errText);
    return { error: "Nepavyko susisiekti su AI paslauga." };
  }

  const aiResponse = await response.json();
  const content = aiResponse.choices?.[0]?.message?.content ?? "";

  try {
    const parsed = parseAiJsonContent(content) as { answer?: string };
    const raw = typeof parsed.answer === "string" ? parsed.answer.trim() : "";
    if (!raw) {
      return { error: "AI negrąžino atsakymo." };
    }
    const fixed = fixTaskLatex({ question: "", answer: raw, solution: "" }, params.grade);
    return { answer: fixed.answer };
  } catch {
    console.error("Failed to parse solve response:", content);
    return { error: "Nepavyko apdoroti AI atsakymo." };
  }
}
