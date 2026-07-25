export type Difficulty = "lengvos" | "vidutinės" | "sunkios";

export interface DiagramConfig {
  type:
    | "triangle"
    | "right_triangle"
    | "rectangle"
    | "square"
    | "circle"
    | "parallelogram"
    | "trapezoid"
    | "parallel_lines";
  parameters: Record<string, number>;
  labels: Record<string, string>;
}

export interface Task {
  question: string;
  answer: string;
  solution: string;
  diagram_config?: DiagramConfig;
  function_equation?: string;
}

export interface MathSession {
  id: string;
  grade: number;
  task_count: number;
  prompt: string;
  difficulty: Difficulty;
  image_data: string | null;
  tasks: Task[];
  created_at: string;
}
