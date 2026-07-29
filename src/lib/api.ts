import { supabase } from "./supabase";
import type { Task, MathSession, Difficulty } from "./types";

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-tasks`;

export async function generateTasks(
  grade: number,
  taskCount: number,
  prompt: string,
  difficulty: Difficulty,
  imageBase64?: string,
  withDiagram?: boolean,
  withGraph?: boolean
): Promise<Task[]> {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ grade, taskCount, prompt, difficulty, imageBase64, withDiagram, withGraph }),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error ?? `Klaida: ${response.status}`);
  }

  if (!Array.isArray(data.tasks)) {
    throw new Error("Netinkamas atsakymas iš serverio.");
  }

  return data.tasks as Task[];
}

export async function saveSession(
  grade: number,
  taskCount: number,
  prompt: string,
  difficulty: Difficulty,
  tasks: Task[],
  imageData?: string
): Promise<MathSession | null> {
  const { data, error } = await supabase
    .from("math_sessions")
    .insert({ grade, task_count: taskCount, prompt, difficulty, tasks, image_data: imageData ?? null })
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
