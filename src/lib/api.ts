import { supabase } from "./supabase";
import type { Task, MathSession, Difficulty, GenerationMode } from "./types";
import { PRO_LIMIT_EXHAUSTED_MESSAGE } from "./types";
import { getSiteOrigin } from "./siteUrl";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const GENERATE_TASKS_URL = `${SUPABASE_URL}/functions/v1/generate-tasks`;
const CHECKOUT_SESSION_URL = `${SUPABASE_URL}/functions/v1/create-checkout-session`;

export type CheckoutPlan = "PRO mėnesinis" | "UNLIMITED mėnesinis" | "Limitų papildymas";

export class ProLimitExhaustedError extends Error {
  constructor(message = PRO_LIMIT_EXHAUSTED_MESSAGE) {
    super(message);
    this.name = "ProLimitExhaustedError";
  }
}

async function getAccessToken(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error("Norėdami tęsti, prisijunkite.");
  }
  return session.access_token;
}

export async function createCheckoutSession(plan: CheckoutPlan): Promise<string> {
  const accessToken = await getAccessToken();

  const response = await fetch(CHECKOUT_SESSION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      plan,
      returnOrigin: getSiteOrigin() || undefined,
    }),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error ?? `Klaida: ${response.status}`);
  }

  if (!data.url || typeof data.url !== "string") {
    throw new Error("Nepavyko gauti Stripe mokėjimo nuorodos.");
  }

  return data.url;
}

export interface GenerateTasksMeta {
  fromBank: boolean;
  bankCount: number;
  aiCount: number;
  deferredAnswers?: boolean;
}

export interface GenerateTasksResult {
  tasks: Task[];
  meta?: GenerateTasksMeta;
}

export async function generateTasks(
  grade: number,
  taskCount: number,
  prompt: string,
  difficulty: Difficulty,
  imageBase64?: string,
  withDiagram?: boolean,
  withGraph?: boolean,
  withSolution?: boolean,
  subtopicIds?: string[],
  topicIds?: string[],
  generationMode: GenerationMode = "text",
): Promise<GenerateTasksResult> {
  const token = await getAccessToken();

  const response = await fetch(GENERATE_TASKS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      grade,
      taskCount,
      prompt,
      difficulty,
      generationMode,
      imageBase64,
      withDiagram,
      withGraph,
      withSolution: withSolution ?? false,
      ...(subtopicIds?.length ? { subtopicIds } : {}),
      ...(topicIds?.length ? { topicIds } : {}),
    }),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    if (data.code === "pro_limit") {
      throw new ProLimitExhaustedError(
        typeof data.error === "string" ? data.error : PRO_LIMIT_EXHAUSTED_MESSAGE,
      );
    }
    throw new Error(data.error ?? `Klaida: ${response.status}`);
  }

  if (!Array.isArray(data.tasks)) {
    throw new Error("Netinkamas atsakymas iš serverio.");
  }

  const meta =
    typeof data.bankCount === "number" || typeof data.aiCount === "number"
      ? {
          fromBank: data.fromBank === true,
          bankCount: Number(data.bankCount) || 0,
          aiCount: Number(data.aiCount) || 0,
          deferredAnswers: data.deferredAnswers === true,
        }
      : undefined;

  return { tasks: data.tasks as Task[], meta };
}

export async function solveTaskAnswer(grade: number, question: string): Promise<string> {
  const token = await getAccessToken();

  const response = await fetch(GENERATE_TASKS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      action: "solve",
      grade,
      taskCount: 1,
      prompt: "",
      difficulty: "vidutinės",
      question,
    }),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    if (data.code === "pro_limit") {
      throw new ProLimitExhaustedError(
        typeof data.error === "string" ? data.error : PRO_LIMIT_EXHAUSTED_MESSAGE,
      );
    }
    throw new Error(data.error ?? `Klaida: ${response.status}`);
  }

  if (typeof data.answer !== "string" || !data.answer.trim()) {
    throw new Error("Nepavyko gauti atsakymo.");
  }

  return data.answer;
}

export interface TaskReviewResult {
  question: string;
  answer: string;
  changed: boolean;
  recommendations: string;
}

export async function reviewTaskQuestion(
  grade: number,
  difficulty: Difficulty,
  question: string,
  topicIds?: string[],
  subtopicIds?: string[],
): Promise<TaskReviewResult> {
  const token = await getAccessToken();

  const response = await fetch(GENERATE_TASKS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      action: "review",
      grade,
      taskCount: 1,
      prompt: "",
      difficulty,
      question,
      topicIds,
      subtopicIds,
    }),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error ?? `Klaida: ${response.status}`);
  }

  if (typeof data.question !== "string" || !data.question.trim()) {
    throw new Error("Nepavyko gauti patikrintos užduoties.");
  }

  return {
    question: data.question.trim(),
    answer: typeof data.answer === "string" ? data.answer.trim() : "",
    changed: data.changed === true,
    recommendations:
      typeof data.recommendations === "string" ? data.recommendations.trim() : "",
  };
}

export async function saveSession(
  grade: number,
  taskCount: number,
  prompt: string,
  difficulty: Difficulty,
  tasks: Task[],
  imageData?: string,
  topicIds?: string[],
  subtopicIds?: string[],
): Promise<MathSession | null> {
  const { data, error } = await supabase
    .from("math_sessions")
    .insert({
      grade,
      task_count: taskCount,
      prompt,
      difficulty,
      tasks,
      image_data: imageData ?? null,
      topic_ids: topicIds?.length ? topicIds : [],
      subtopic_ids: subtopicIds?.length ? subtopicIds : [],
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error("Failed to save session:", error);
    return null;
  }

  return data as MathSession;
}

export async function getRecentSessions(limit = 10): Promise<MathSession[]> {
  const { data, error } = await supabase
    .from("math_sessions")
    .select("id, grade, task_count, prompt, difficulty, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to load sessions:", error);
    return [];
  }

  return (data ?? []) as MathSession[];
}

export async function loadSession(id: string): Promise<MathSession | null> {
  const { data, error } = await supabase
    .from("math_sessions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load session:", error);
    return null;
  }

  return data as MathSession;
}
