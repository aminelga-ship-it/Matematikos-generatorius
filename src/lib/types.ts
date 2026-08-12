/** Tekstiniame rėžime; `savarankiskas` — senų sesijų (pagal temą) sudėtingumas */
export type Difficulty =
  | "lengvos"
  | "vidutinės"
  | "sunkios"
  | "ivairus"
  | "savarankiskas";

export type GenerationMode = "topic" | "text";

export type UserRole = "teacher" | "student" | "admin";

export type TaskBankStatus = "draft" | "approved" | "rejected";

export type TaskBankSource = "ai_generated" | "manual" | "user_corrected";

export type BankDifficulty = "lengvos" | "vidutinės" | "sunkios";

export const PRO_LIMIT_EXHAUSTED_MESSAGE =
  "Atsiprašome, jūsų limitas išnaudotas. Papildykite limitus.";

export type TaskFeedbackType =
  | "excellent"
  | "suitable"
  | "fix_text"
  | "fix_solution"
  | "wrong_difficulty"
  | "unsuitable";

export const TASK_FEEDBACK_LABELS: Record<TaskFeedbackType, string> = {
  excellent: "Puiki",
  suitable: "Tinkama",
  fix_text: "Redaguotina užduotis",
  fix_solution: "Netinkamas atsakymas/sprendimas",
  wrong_difficulty: "Netinkamas sunkumas/klasė/tema",
  unsuitable: "Netinkama",
};

export const TASK_BANK_STATUS_LABELS: Record<TaskBankStatus, string> = {
  draft: "Redaguotina",
  approved: "Patvirtinta",
  rejected: "Atmesta",
};

export interface CurriculumTopic {
  id: string;
  grade: number;
  slug: string;
  title: string;
  sort_order: number;
}

export interface CurriculumSubtopic {
  id: string;
  topic_id: string;
  slug: string;
  title: string;
  sort_order: number;
}

export interface TaskBankItem {
  id: string;
  grade: number;
  topic_id: string | null;
  subtopic_id: string | null;
  difficulty: BankDifficulty;
  question: string;
  answer: string;
  solution: string;
  diagram_config?: DiagramConfig | null;
  function_equation?: string | null;
  status: TaskBankStatus;
  source: TaskBankSource;
  generation_prompt?: string | null;
  usage_count: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskBankFeedbackRow {
  id: string;
  task_bank_item_id: string;
  user_id: string;
  feedback_type: TaskFeedbackType;
  comment: string | null;
  created_at: string;
}

export interface TaskBankItemWithMeta extends TaskBankItem {
  topic_title?: string | null;
  subtopic_title?: string | null;
  feedback?: TaskBankFeedbackRow[];
}

/** Minimalus užduočių skaičius generavimui pagal temą */
export const TOPIC_MODE_MIN_TASKS = 5;
/** Įvairaus sudėtingumo (tekstas ir tema) */
export const IVAIRUS_MIN_TASKS = TOPIC_MODE_MIN_TASKS;
/** @deprecated naudokite IVAIRUS_MIN_TASKS */
export const SAVARANKISKAS_MIN_TASKS = TOPIC_MODE_MIN_TASKS;

export type DiagramType =
  | "SQUARE" | "RECTANGLE" | "RHOMBUS" | "PARALLELOGRAM" | "TRAPEZOID"
  | "RIGHT_TRIANGLE" | "TRIANGLE" | "CIRCLE"
  | "SIMILAR_TRIANGLES" | "CONGRUENT_TRIANGLES"
  | "CUBE" | "CUBOID" | "SQUARE_PYRAMID" | "TRIANGULAR_PYRAMID"
  | "CONE" | "CYLINDER";

export interface DiagramConfig {
  type: DiagramType;
  parameters?: Record<string, number>;
  labels: Record<string, string>;
}

export interface Task {
  question: string;
  answer: string;
  solution: string;
  diagram_config?: DiagramConfig;
  function_equation?: string;
  bank_item_id?: string;
}

/** Ar bent vienoje užduotyje yra sugeneruotas sprendimas */
export function tasksIncludeSolutions(tasks: Task[]): boolean {
  return tasks.some((t) => (t.solution ?? "").trim().length > 0);
}

export interface MathSession {
  id: string;
  grade: number;
  task_count: number;
  prompt: string;
  difficulty: Difficulty;
  image_data: string | null;
  tasks: Task[];
  topic_ids?: string[];
  subtopic_ids?: string[];
  created_at: string;
}

/** Rotacija potemių/temų pagal užduoties indeksą (kaip banke). */
export function curriculumSlotForTask(
  index: number,
  subtopicIds: string[],
  topicIds: string[],
): { subtopic_id: string | null; topic_id: string | null } {
  if (subtopicIds.length > 0) {
    return { subtopic_id: subtopicIds[index % subtopicIds.length], topic_id: null };
  }
  if (topicIds.length > 0) {
    return { subtopic_id: null, topic_id: topicIds[index % topicIds.length] };
  }
  return { subtopic_id: null, topic_id: null };
}
