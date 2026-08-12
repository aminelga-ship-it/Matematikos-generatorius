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

const UNIT_SUPERSCRIPT_RE =
  /\b(cm|mm|dm|m|km|g|kg|mg|ml|l|s|min|h)\^(\d+)\b/gi;

/** cm^3, m^2 ir pan. → $\\text{cm}^{3}$ (ne žalias caret tekste). */
export function normalizeUnitSuperscripts(text: string): string {
  const re = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g;
  const parts = text.split(re);
  return parts
    .map((part) => {
      if (part.startsWith("$")) return part;
      return part
        .replace(
          /(\d+(?:[.,]\d+)?)\s*(cm|mm|dm|m|km|g|kg|mg|ml|l|s|min|h)\^(\d+)\b/gi,
          (_, n: string, unit: string, exp: string) =>
            `$${n}\\ \\text{${unit}}^{${exp}}$`,
        )
        .replace(UNIT_SUPERSCRIPT_RE, (_, unit: string, exp: string) => `$\\text{${unit}}^{${exp}}$`)
        .replace(/[ \t]{2,}/g, " ");
    })
    .join("");
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

function withoutMathBlocks(question: string): string {
  return question
    .replace(/\$\$[\s\S]*?\$\$/g, "")
    .replace(/\$[^$]+\$/g, "")
    .trim();
}

/** Grynas „apskaičiuokite / stulpeliu“ — stulpelį paliekame. */
function isExplicitElementaryCalculationTask(question: string): boolean {
  const text = withoutMathBlocks(question);
  if (/stulpel/iu.test(text)) return true;
  if (
    /^(apskaičiuokite|sudėkite|atimkite|padauginkite|padalinkite|suskaičiuokite|įvertinkite)\b/iu.test(
      text,
    )
  ) {
    return true;
  }
  if (/^(raskite|apskaičiuokite)\s+(sumą|skirtumą|sandaugą|dalmenį|liekaną)/iu.test(text)) {
    return true;
  }
  if (text.length < 90 && !/\b(obuol|kriauš|nupirk|parduotuv|sveria|kartu\s+paėm|gavo|liko)\b/iu.test(text)) {
    if (/^\d+\s*[+\-×·*:\/]\s*\d+/u.test(text)) return true;
  }
  return false;
}

/** Ilgas / gyvenimiškas tekstinis — question be paruošto skaičiavimo. */
function looksLikeElementaryStoryWordProblem(question: string): boolean {
  if (isExplicitElementaryCalculationTask(question)) return false;
  const text = withoutMathBlocks(question);
  if (!/[a-ząčęėįšųūž]{4,}/iu.test(text)) return false;
  if (/\b(kg\b|g\b|cm\b|eur|litų|obuol|kriauš|sveria|nupirk|parduotuv|buvo|gavo|dėjo|paėmė|liko)\b/iu.test(text)) {
    return true;
  }
  if (/^kiek\s/iu.test(text) && text.length > 35) return true;
  return text.length > 55 && /\b(ir|kartu|iš\s+viso|daugiau|mažiau)\b/iu.test(text);
}

/** 1–4 kl. tik istoriniams tekstiniams — question be stulpelio/kampo. */
function stripCalculationFromElementaryWordQuestion(question: string, grade?: number): string {
  if (grade == null || grade > 4) return question;
  if (!looksLikeElementaryStoryWordProblem(question)) return question;
  return question
    .replace(/\$\$[\s\S]*?\$\$/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Neteisingas dalybos „stulpelis“ (array su :) → eilutė $a : b =$. */
function fixMisformattedDivisionColumn(question: string, grade?: number): string {
  if (grade == null || grade > 4) return question;
  return question.replace(/\$\$([\s\S]*?)\$\$/g, (match, inner: string) => {
    if (!/\\begin\{array\}/i.test(inner)) return match;
    const hasAddSub = /\\\+|(?<!\\)-\s*\d|^\s*\d+\s*\+\s*/m.test(inner);
    const hasDivision = /:\s*\\?;?\s*\d|:\\|÷/.test(inner);
    if (!hasDivision || hasAddSub) return match;
    const nums = inner.match(/\d+/g);
    if (!nums || nums.length < 2) return match;
    const dividend = nums[0];
    const divisor = nums[nums.length - 1];
    return `$${dividend} : ${divisor} =$`;
  });
}

export function fixTaskLatex(task: Task, grade?: number): Task {
  const diagram_config = task.diagram_config;
  const questionRaw = diagram_config
    ? fixDiagramQuestionText(task.question, diagram_config)
    : task.question;
  const questionFixed = normalizeUnitSuperscripts(
    fixMisformattedDivisionColumn(
      stripCalculationFromElementaryWordQuestion(fixLatex(questionRaw), grade),
      grade,
    ),
  );
  const fixed: Task = {
    question: questionFixed,
    answer: normalizeUnitSuperscripts(
      fixLatex(
        grade != null && grade >= 1 && grade <= 4
          ? normalizeElementaryAnswer(task.answer)
          : task.answer,
      ),
    ),
    solution: normalizeUnitSuperscripts(fixLatex(task.solution)),
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
  if (task.bank_item_id) {
    fixed.bank_item_id = task.bank_item_id;
  }
  return fixed;
}
