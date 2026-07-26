export type Difficulty = "lengvos" | "vidutinės" | "sunkios";

export type DiagramType =
  | "SQUARE" | "RECTANGLE" | "RHOMBUS" | "PARALLELOGRAM" | "TRAPEZOID"
  | "RIGHT_TRIANGLE" | "TRIANGLE" | "CIRCLE"
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
