import type { DiagramConfig } from "./diagram.ts";
import { fixDiagramQuestionText, normalizeDiagramType } from "./diagram.ts";

export interface Task {
  question: string;
  answer: string;
  solution: string;
  diagram_config?: DiagramConfig;
  function_equation?: string;
  bank_item_id?: string;
}

function fixLatex(text: string): string {
  return text
    .replace(/\u000C([a-zA-Z]+)/g, "\\f$1")
    .replace(/\u0008([a-zA-Z]+)/g, "\\b$1")
    .replace(/\u0009(ext\{)/g, "\\text{")
    .replace(/\u0009(heta\b)/g, "\\theta")
    .replace(/\u0009(imes\b)/g, "\\times")
    .replace(/\u0009(an(?:h)?\b)/g, "\\t$1")
    .replace(/\u0009(o\b)/g, "\\to")
    // Double-escaped LaTeX commands (\\frac), not line breaks (\\ before space/newline)
    .replace(/\\\\([a-zA-Z]+)/g, "\\$1")
    .replace(/\\\\,/g, "\\,")
    .replace(/\\\\!/g, "\\!")
    .replace(/\\\\;/g, "\\;")
    .replace(/\\\\:/g, "\\:");
}

/** 1–4 kl.: answer — tik skaičius; be kampo/stulpelio/\\frac answer lauke. */
export function normalizeElementaryAnswer(answer: string): string {
  let a = answer.trim();
  a = a.replace(/^atsakymas\s*:\s*/i, "");
  a = a.replace(/^\$([a-zA-Z])\s*=\s*([^$]+)\$$/, "$2").trim();
  const frac = a.match(/^\$?\\frac\{(\d+)\}\{(\d+)\}\$?$/);
  if (frac) {
    const num = Number(frac[1]);
    const den = Number(frac[2]);
    if (den !== 0 && num % den === 0) return String(num / den);
  }
  const plain = a.match(/^\$(\d+(?:[.,]\d+)?)\$$/);
  if (plain) return plain[1];
  return a;
}

export function fixTaskLatex(task: Task, grade?: number): Task {
  const diagram_config = task.diagram_config;
  const fixed: Task = {
    question: fixLatex(
      diagram_config ? fixDiagramQuestionText(task.question, diagram_config) : task.question,
    ),
    answer: fixLatex(
      grade != null && grade >= 1 && grade <= 4
        ? normalizeElementaryAnswer(task.answer)
        : task.answer,
    ),
    solution: fixLatex(task.solution),
    diagram_config,
    function_equation: task.function_equation,
  };
  if (fixed.diagram_config?.type) {
    const normalized = normalizeDiagramType(String(fixed.diagram_config.type));
    if (!normalized) {
      console.log(`Unknown diagram type: ${fixed.diagram_config.type}`);
    }
    fixed.diagram_config = { ...fixed.diagram_config, type: normalized ?? fixed.diagram_config.type };
  }
  return fixed;
}
