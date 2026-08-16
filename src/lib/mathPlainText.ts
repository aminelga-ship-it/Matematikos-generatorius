/**
 * LaTeX / MathText → skaitomas „vadovėlinis“ tekstas (kopijavimui, eksportui).
 */

const SUPER_DIGITS = "⁰¹²³⁴⁵⁶⁷⁸⁹";

function toSuperscript(exp: string): string {
  const t = exp.trim();
  if (/^\d+$/.test(t)) {
    return t.replace(/[0-9]/g, (d) => SUPER_DIGITS[Number(d)]);
  }
  if (t.length === 1) return `^${t}`;
  return `^(${t})`;
}

function extractBraced(s: string, start: number): { content: string; end: number } | null {
  if (s[start] !== "{") return null;
  let depth = 0;
  for (let i = start; i < s.length; i++) {
    if (s[i] === "{") depth++;
    else if (s[i] === "}") {
      depth--;
      if (depth === 0) return { content: s.slice(start + 1, i), end: i + 1 };
    }
  }
  return null;
}

const LATEX_SYMBOLS: Record<string, string> = {
  "\\cdot": "·",
  "\\times": "×",
  "\\leq": "≤",
  "\\le": "≤",
  "\\geq": "≥",
  "\\ge": "≥",
  "\\neq": "≠",
  "\\pm": "±",
  "\\mp": "∓",
  "\\infty": "∞",
  "\\pi": "π",
  "\\alpha": "α",
  "\\beta": "β",
  "\\gamma": "γ",
  "\\delta": "δ",
  "\\theta": "θ",
  "\\lambda": "λ",
  "\\mu": "μ",
  "\\sigma": "σ",
  "\\phi": "φ",
  "\\omega": "ω",
  "\\cup": "∪",
  "\\cap": "∩",
  "\\subset": "⊂",
  "\\supset": "⊃",
  "\\in": "∈",
  "\\notin": "∉",
  "\\emptyset": "∅",
  "\\approx": "≈",
  "\\equiv": "≡",
  "\\rightarrow": "→",
  "\\to": "→",
  "\\Rightarrow": "⇒",
  "\\Leftrightarrow": "⇔",
  "\\circ": "°",
  "\\degree": "°",
  "\\%": "%",
  "\\_": "_",
};

function replaceFrac(s: string): string {
  const tag = "\\frac";
  let result = "";
  let i = 0;
  while (i < s.length) {
    const pos = s.indexOf(tag, i);
    if (pos === -1) {
      result += s.slice(i);
      break;
    }
    result += s.slice(i, pos);
    let j = pos + tag.length;
    const a1 = extractBraced(s, j);
    if (!a1) {
      result += tag;
      i = pos + tag.length;
      continue;
    }
    j = a1.end;
    const a2 = extractBraced(s, j);
    if (!a2) {
      result += tag + "{" + a1.content + "}";
      i = pos + tag.length;
      continue;
    }
    const num = latexFragmentToPlain(a1.content);
    const den = latexFragmentToPlain(a2.content);
    const needsParen = /[+\-]/.test(num) || /[+\-]/.test(den);
    result += needsParen ? `(${num})/(${den})` : `${num}/${den}`;
    i = a2.end;
  }
  return result;
}

function replaceSqrt(s: string): string {
  let result = "";
  let i = 0;
  while (i < s.length) {
    const pos = s.indexOf("\\sqrt", i);
    if (pos === -1) {
      result += s.slice(i);
      break;
    }
    result += s.slice(i, pos);
    let j = pos + 5;
    let root = "";
    if (s[j] === "[") {
      const close = s.indexOf("]", j);
      if (close !== -1) {
        root = s.slice(j + 1, close);
        j = close + 1;
      }
    }
    const arg = extractBraced(s, j);
    if (!arg) {
      result += "\\sqrt";
      i = pos + 5;
      continue;
    }
    const inner = latexFragmentToPlain(arg.content);
    if (root) {
      const r = latexFragmentToPlain(root);
      result += `(${inner})^(1/${r})`;
    } else {
      result += inner.length <= 2 ? `√${inner}` : `√(${inner})`;
    }
    i = arg.end;
  }
  return result;
}

function replaceText(s: string): string {
  return s.replace(/\\text\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, (_, inner: string) =>
    latexFragmentToPlain(inner),
  );
}

function replaceCases(s: string): string {
  return s.replace(/\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g, (_, body: string) => {
    const rows = body
      .split(/\\\\/)
      .map((r: string) => latexFragmentToPlain(r.trim()))
      .filter(Boolean);
    return rows.join("\n");
  });
}

function replaceEnvironments(s: string): string {
  return s
    .replace(/\\begin\{matrix\}([\s\S]*?)\\end\{matrix\}/g, (_, body: string) =>
      body
        .split(/\\\\/)
        .map((r: string) => r.replace(/&/g, " ").trim())
        .filter(Boolean)
        .join("  "),
    )
    .replace(/\\begin\{(?:pmatrix|bmatrix|vmatrix)\}([\s\S]*?)\\end\{\w+\}/g, (_, body: string) => {
      const rows = body
        .split(/\\\\/)
        .map((r: string) => r.replace(/&/g, " ").trim())
        .filter(Boolean);
      return rows.map((r) => `[${r}]`).join("\n");
    });
}

function latexFragmentToPlain(latex: string): string {
  let s = latex.trim();
  if (!s) return "";

  for (let iter = 0; iter < 24; iter++) {
    const prev = s;
    s = replaceCases(s);
    s = replaceEnvironments(s);
    s = replaceFrac(s);
    s = replaceSqrt(s);
    s = replaceText(s);
    s = s.replace(/\^\{([^}]+)\}/g, (_, e: string) => toSuperscript(e));
    s = s.replace(/\^([0-9a-zA-Z])/g, (_, e: string) => toSuperscript(e));
    s = s.replace(/_\{([^}]+)\}/g, "_($1)");
    s = s.replace(/_([0-9a-zA-Z])/g, "_$1");
    for (const [k, v] of Object.entries(LATEX_SYMBOLS)) {
      s = s.split(k).join(v);
    }
    s = s.replace(/\\left/g, "").replace(/\\right/g, "");
    s = s.replace(/\\[,\;!\:\s]/g, " ");
    s = s.replace(/\\([a-zA-Z]+)/g, "$1");
    s = s.replace(/[{}]/g, "");
    if (s === prev) break;
  }

  return s.replace(/[ \t]{2,}/g, " ").trim();
}

function repairBrokenEscapes(text: string): string {
  return text
    .replace(/\u000C([a-zA-Z]+)/g, "\\f$1")
    .replace(/\u0008([a-zA-Z]+)/g, "\\b$1")
    .replace(/\u0009(ext\{)/g, "\\text{")
    .replace(/(?<![\\a-zA-Z])frac(?=\{)/g, "\\frac")
    .replace(/(?<![\\a-zA-Z])sqrt(?=\{|\s)/g, "\\sqrt");
}

function normalizeDelimiters(text: string): string {
  return text
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, inner: string) => `$$${inner.trim()}$$`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, inner: string) => `$${inner.trim()}$`);
}

function convertMathBlock(inner: string, display: boolean): string {
  const plain = latexFragmentToPlain(inner);
  if (!display) return plain;
  if (plain.includes("\n")) return `\n${plain}\n`;
  return plain;
}

function convertDelimitedMath(text: string): string {
  const re = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|(?<!\$)\$([^$\n]+?)\$(?!\$)|\\\(([\s\S]+?)\\\)/g;
  let result = "";
  let last = 0;

  for (const m of text.matchAll(re)) {
    if (m.index! > last) {
      result += text.slice(last, m.index);
    }
    const isDisplay = m[1] !== undefined || m[2] !== undefined;
    const inner = (m[1] ?? m[2] ?? m[3] ?? m[4] ?? "").trim();
    result += convertMathBlock(inner, isDisplay);
    last = m.index! + m[0].length;
  }

  if (last < text.length) {
    result += text.slice(last);
  }

  return result;
}

/** Pilnas tekstas be $, $$, \\frac ir pan. — kaip vadovėlyje. */
export function mathTextToPlainText(text: string): string {
  if (!text) return "";
  const pre = normalizeDelimiters(repairBrokenEscapes(text.replace(/\\\\([a-zA-Z]{2,})/g, "\\$1")));
  let s = convertDelimitedMath(pre);
  // Likę neapvalkale LaTeX fragmentai
  s = latexFragmentToPlain(s);
  return s
    .replace(/\$\$/g, "")
    .replace(/\$/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
