import type { DiagramConfig } from "./diagram.ts";
import { fixDiagramQuestionText, normalizeDiagramType } from "./diagram.ts";

export interface Task {
  question: string;
  answer: string;
  solution: string;
  diagram_config?: DiagramConfig;
  function_equation?: string;
  bank_item_id?: string;
  from_approved_bank?: boolean;
  task_difficulty?: "lengvos" | "vidutinės" | "sunkios";
}

const JSON_SINGLE_ESCAPES = new Set(['"', "\\", "/", "b", "f", "n", "r", "t"]);

/**
 * AI often writes LaTeX with a single backslash inside JSON strings (`\log`, `\sqrt`).
 * `\l` / `\s` are invalid JSON escapes, so JSON.parse throws — typical for logaritminės.
 * `\frac` parses but JSON eats `\f` as form-feed. Double the backslash when it starts a LaTeX command.
 */
export function repairJsonLatexEscapes(text: string): string {
  let out = "";
  let inString = false;
  let escaped = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    if (!inString) {
      if (ch === '"') inString = true;
      out += ch;
      continue;
    }
    if (escaped) {
      out += ch;
      escaped = false;
      continue;
    }
    if (ch === '"') {
      inString = false;
      out += ch;
      continue;
    }
    if (ch !== "\\") {
      out += ch;
      continue;
    }
    const n1 = text[i + 1];
    if (n1 === undefined) {
      out += "\\\\";
      continue;
    }
    if (n1 === "u") {
      if (/^[0-9a-fA-F]{4}$/.test(text.slice(i + 2, i + 6))) {
        out += ch;
        escaped = true;
        continue;
      }
      out += "\\\\";
      continue;
    }
    if (JSON_SINGLE_ESCAPES.has(n1)) {
      const n2 = text[i + 2];
      const latexCommand = /[a-z]/.test(n2 ?? "");
      if (latexCommand && n1 !== "\\" && n1 !== '"' && n1 !== "/") {
        out += "\\\\";
        continue;
      }
      out += ch;
      escaped = true;
      continue;
    }
    out += "\\\\";
  }
  return out;
}

export function parseAiJsonContent(content: string): any {
  const cleaned = content.replace(/^```[\w]*\n?/m, "").replace(/```[\s]*$/m, "").trim();
  return JSON.parse(repairJsonLatexEscapes(cleaned));
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
  const withNewlines = text
    .replace(/\$\$([\s\S]*?)\$\$/g, (_m, inner: string) => `$$${inner.replace(/\n+/g, " \\\\ ")}$$`)
    .replace(/(?<!\$)\$((?:[^$]|\$(?!\$))+?)\$(?!\$)/g, (_m, inner: string) =>
      `$${inner.replace(/\n+/g, " \\\\ ")}$`,
    );

  return normalizeInequalitySystems(
    replaceNonCommandNNewlines(
      withNewlines
        .replace(/\u000C([a-zA-Z]+)/g, "\\f$1")
        .replace(/\u0008([a-zA-Z]+)/g, "\\b$1")
        .replace(/\u0009(ext\{)/g, "\\text{")
        .replace(/\u0009(heta\b)/g, "\\theta")
        .replace(/\u0009(imes\b)/g, "\\times")
        .replace(/\u0009(an(?:h)?\b)/g, "\\t$1")
        .replace(/\u0009(o\b)/g, "\\to")
        .replace(/\\\\([a-zA-Z]{2,})/g, "\\$1")
        .replace(/\\\\,/g, "\\,")
        .replace(/\\\\!/g, "\\!")
        .replace(/\\\\;/g, "\\;")
        .replace(/\\\\:/g, "\\:"),
    ),
  );
}

function fixStrayVariableBackslash(s: string): string {
  return s.replace(/(?<!\\)\\([a-zA-Z])(?=[\^0-9(])/g, "$1");
}

const SYSTEM_ROW_OP = /(?:=|>|<|\\le|\\ge|\\leq|\\geq|\\neq)/;

/** `\neq` / `\nu` — LaTeX; `\nx^2` — AI eilutės lūžis, ne komanda. */
function isLatexNCommand(afterN: string): boolean {
  return /^(eq|u(?:[^a-zA-Z]|$)|abla|eg(?:[^a-zA-Z]|$)|otin|leq|geq|mid|i(?:[^a-zA-Z]|$)|e(?:[^a-zA-Z]|$)|sim|approx|cong|parallel|subseteq|supseteq|ull)/.test(
    afterN,
  );
}

function replaceNonCommandNNewlines(s: string): string {
  let out = "";
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "\\" && s[i + 1] === "n" && !isLatexNCommand(s.slice(i + 2))) {
      out += " \\\\ ";
      i++;
      continue;
    }
    out += s[i];
  }
  return out;
}

function toSystemRowBreaks(s: string): string {
  return replaceNonCommandNNewlines(s)
    .replace(/\n+/g, " \\\\ ")
    .replace(/,\s*\\\\/g, " \\\\ ");
}

function stripSystemWrapper(s: string): string {
  return s
    .replace(/\\left\s*\\?\{/g, "")
    .replace(/\\right\s*\.?/g, "")
    .replace(/^(?:\\left\s*)?\\?\{\s*/, "")
    // Ne `\end{cases}` — tik atskiras uždarantis `}`.
    .replace(/(?<![a-zA-Z])\}\s*$/, "")
    .trim();
}

function cleanInequalityPart(part: string): string {
  return fixStrayVariableBackslash(
    part
      .replace(/^(?:\\left\s*)?\\?\{\s*/, "")
      .replace(/\\right\s*\.?\s*$/, "")
      .replace(/^\{\s*/, "")
      .replace(/^\\\s+/, "")
      .replace(/,\s*$/, "")
      .replace(/\.\s*$/, "")
      .trim(),
  );
}

function splitSystemInequalities(inner: string): string[] {
  let s = stripSystemWrapper(inner);
  s = s.replace(/\.\s*$/, "");
  s = toSystemRowBreaks(s);
  const parts = /\\\\/.test(s)
    ? s.split(/\s*\\\\\s*/)
    : s.split(/\s*,\s*(?:\\\\|\\\s+)?/);
  return parts
    .map((p) => cleanInequalityPart(p))
    .filter((p) => p.length > 0 && SYSTEM_ROW_OP.test(p));
}

function unwrapSpuriousCases(b: string): string {
  if (!/\\\\/.test(b) || /&/.test(b)) return b;
  const parts = b.split(/\s*\\\\\s*/).map((p) => p.trim()).filter(Boolean);
  if (parts.length !== 2) return b;

  const [first, second] = parts;
  if (/\\int/.test(first) && /^d[a-zA-Z]/i.test(second)) {
    return `${first} ${second}`;
  }
  if (!SYSTEM_ROW_OP.test(first) && SYSTEM_ROW_OP.test(second)) {
    if (/\\int/.test(first) || /\\right[)\]]\s*$/i.test(first)) {
      return `${first} ${second}`;
    }
  }
  return b;
}

function casesWrapperIfNeeded(repaired: string): string {
  if (!/\\\\/.test(repaired) && !/&/.test(repaired)) return repaired;
  return `\\begin{cases} ${repaired} \\end{cases}`;
}

/** AI klaidingai cases aplink vieną lygtį / integralą — sujungti ir apvalkalą pašalinti. */
function repairSpuriousCasesInText(text: string): string {
  return text.replace(/\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g, (_, body: string) => {
    const fixed = casesWrapperIfNeeded(repairCasesBody(body));
    return `$$${fixed}$$`;
  });
}

function repairCasesBody(body: string): string {
  let b = unwrapSpuriousCases(toSystemRowBreaks(body.trim()));
  b = fixStrayVariableBackslash(b);
  b = b.replace(/\.\s*$/, "").trim();
  if (!/\\\\/.test(b)) {
    const parts = splitSystemInequalities(b);
    if (parts.length >= 2) return parts.join(" \\\\ ");
  }
  return b;
}

function normalizeCasesMath(inner: string): string {
  const trimmed = inner.trim();
  if (/\\begin\{cases\}/.test(trimmed)) {
    return trimmed.replace(
      /\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g,
      (_, body: string) => casesWrapperIfNeeded(repairCasesBody(body)),
    );
  }
  const parts = splitSystemInequalities(trimmed);
  if (parts.length >= 2) {
    return `\\begin{cases} ${parts.join(" \\\\ ")} \\end{cases}`;
  }
  return trimmed;
}

function wrapNormalizedSystem(inner: string, norm: string, display: boolean): string {
  if (norm === inner.trim()) return display ? `$$${inner}$$` : `$${inner}$`;
  if (/\\begin\{cases\}/.test(norm)) return `$$${norm}$$`;
  return display ? `$$${norm}$$` : `$${norm}$`;
}

function normalizeInequalitySystems(text: string): string {
  let s = repairSpuriousCasesInText(text);

  s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_match, inner: string) =>
    wrapNormalizedSystem(inner, normalizeCasesMath(inner), true),
  );

  s = s.replace(/(?<!\$)\$((?:[^$]|\$(?!\$))+?)\$(?!\$)/g, (_match, inner: string) =>
    wrapNormalizedSystem(inner, normalizeCasesMath(inner), false),
  );

  const re = /(\$\$[\s\S]+?\$\$|\$(?:[^$]|\$(?!\$))+?\$)/g;
  const parts = s.split(re);
  s = parts
    .map((part) => {
      if (part.startsWith("$")) return part;
      return part.replace(
        /(?:\\left\s*)?\\?\{\s*([^$]+?(?:>|<|=|\\le|\\ge|\\leq|\\geq)[^$]*?,\s*(?:\\n)?\s*\\?\s*[^$]+?(?:>|<|=|\\le|\\ge|\\leq|\\geq)[^$]*?)\.?(?=\s|$|[,.;:!?])/g,
        (match, inner: string) => {
          const norm = normalizeCasesMath(inner);
          return norm !== inner.trim() ? `$$${norm}$$` : match;
        },
      );
    })
    .join("");

  return s;
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
  if (task.from_approved_bank) {
    fixed.from_approved_bank = task.from_approved_bank;
  }
  if (task.task_difficulty) {
    fixed.task_difficulty = task.task_difficulty;
  }
  return fixed;
}
