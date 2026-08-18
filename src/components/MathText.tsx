import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathTextProps {
  text: string;
  className?: string;
}

type Segment =
  | { kind: "text"; value: string }
  | { kind: "inline"; latex: string }
  | { kind: "display"; latex: string };

// display before inline so $$ isn't consumed by $ rule
function parseSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  const re =
    /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|(?<!\$)\$((?:[^$]|\$(?!\$))+?)\$(?!\$)|\\\(([\s\S]+?)\\\)/g;
  let last = 0;

  for (const m of text.matchAll(re)) {
    if (m.index! > last) {
      segments.push({ kind: "text", value: text.slice(last, m.index) });
    }
    const isDisplay = m[1] !== undefined || m[2] !== undefined;
    const latex = (m[1] ?? m[2] ?? m[3] ?? m[4] ?? "").trim();
    segments.push({ kind: isDisplay ? "display" : "inline", latex });
    last = m.index! + m[0].length;
  }

  if (last < text.length) {
    segments.push({ kind: "text", value: text.slice(last) });
  }

  return segments;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Išskaido sulaužytą sistemos žymėjimą į lygčių / nelygybių eilutes. */
function fixStrayVariableBackslash(s: string): string {
  // Tik vienas stray `\x^2`, ne LaTeX eilutės lūžis `\\ x^2`.
  return s.replace(/(?<!\\)\\([a-zA-Z])(?=[\^0-9(])/g, "$1");
}

const SYSTEM_ROW_OP = /(?:=|>|<|\\le|\\ge|\\leq|\\geq|\\neq)/;

/** `\neq` / `\nu` — LaTeX; `\nx^2` — AI eilutės lūžis, ne komanda. */
function isLatexNCommand(afterN: string): boolean {
  return /^(eq|u(?:[^a-zA-Z]|$)|abla|eg(?:[^a-zA-Z]|$)|otin|leq|geq|mid|i(?:[^a-zA-Z]|$)|e(?:[^a-zA-Z]|$)|sim|approx|cong|parallel|subseteq|supseteq|ull)/.test(
    afterN,
  );
}

/** `{ 2x+y=7, \nx^2=25 }` — `\n` čia ne LaTeX komanda. */
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

/** AI klaidingai cases aplink vieną lygtį / integralą — sujungti ir apvalkalą pašalinti. */
function repairSpuriousCasesInText(text: string): string {
  return text.replace(/\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g, (_, body: string) => {
    const fixed = casesWrapperIfNeeded(repairCasesBody(body));
    return `$$${fixed}$$`;
  });
}

/** `{ a = 0, \\n b > 0` → display `\\begin{cases}`. */
function normalizeInequalitySystems(text: string): string {
  let s = repairSpuriousCasesInText(text);

  s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_match, inner: string) =>
    wrapNormalizedSystem(inner, normalizeCasesMath(inner), true),
  );

  s = s.replace(/(?<!\$)\$((?:[^$]|\$(?!\$))+?)\$(?!\$)/g, (_match, inner: string) =>
    wrapNormalizedSystem(inner, normalizeCasesMath(inner), false),
  );

  // Sulaužytas sistemos ženklas tik už $…$ ribų
  s = mapOutsideMathDelimiters(s, (plain) =>
    plain.replace(
      /(?:\\left\s*)?\\?\{\s*([^$]+?(?:>|<|=|\\le|\\ge|\\leq|\\geq)[^$]*?,\s*(?:\\n)?\s*\\?\s*[^$]+?(?:>|<|=|\\le|\\ge|\\leq|\\geq)[^$]*?)\.?(?=\s|$|[,.;:!?])/g,
      (match, inner: string) => {
        const norm = normalizeCasesMath(inner);
        return norm !== inner.trim() ? `$$${norm}$$` : match;
      },
    ),
  );

  return s;
}

function repairLatexBeforeKatex(latex: string): string {
  const trimmed = latex.trim();
  if (/\\begin\{cases\}/.test(trimmed)) {
    return trimmed.replace(
      /\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g,
      (_, body: string) => casesWrapperIfNeeded(repairCasesBody(body)),
    );
  }
  const withBreaks = toSystemRowBreaks(trimmed);
  const norm = normalizeCasesMath(withBreaks);
  return /\\begin\{cases\}/.test(norm) ? norm : withBreaks;
}

function renderKatex(latex: string, displayMode: boolean): string {
  const fixed = repairLatexBeforeKatex(latex);
  const useDisplay =
    displayMode || /\\begin\{(cases|matrix|pmatrix|bmatrix|vmatrix|aligned|array)/.test(fixed);
  try {
    return katex.renderToString(fixed, {
      displayMode: useDisplay,
      throwOnError: false,
      strict: false,
      trust: false,
      output: "html",
    });
  } catch {
    return escapeHtml(latex);
  }
}

function normalizeDoubleBackslashes(text: string): string {
  // Tik dvigubai escape'intos komandos (\\frac), ne eilučių lūžiai cases aplinkoje (\\ x^2).
  return text
    .replace(/\\\\([a-zA-Z]{2,})/g, "\\$1")
    .replace(/\\\\,/g, "\\,")
    .replace(/\\\\!/g, "\\!")
    .replace(/\\\\;/g, "\\;")
    .replace(/\\\\:/g, "\\:");
}

/** Tekstas ne $...$ — papildomas matematikos apvalkalas (seed / rankinis bankas). */
const UNIT_SUPERSCRIPT_RE =
  /\b(cm|mm|dm|m|km|g|kg|mg|ml|l|s|min|h)\^(\d+)\b/gi;

function normalizeUnitSuperscripts(text: string): string {
  return mapOutsideMathDelimiters(text, (plain) =>
    plain
      .replace(
        /(\d+(?:[.,]\d+)?)\s*(cm|mm|dm|m|km|g|kg|mg|ml|l|s|min|h)\^(\d+)\b/gi,
        (_, n: string, unit: string, exp: string) =>
          `$${n}\\ \\text{${unit}}^{${exp}}$`,
      )
      .replace(UNIT_SUPERSCRIPT_RE, (_, unit: string, exp: string) => `$\\text{${unit}}^{${exp}}$`)
      .replace(/[ \t]{2,}/g, " "),
  );
}

function enrichPlainTextMath(plain: string): string {
  let s = plain;
  s = s.replace(/(\d+(?:\{,\}\d+)?)\s*\^\s*(?:\\\\)+circ\b/g, (_, n: string) => `$${n}^\\circ$`);
  s = s.replace(/(\d+(?:\{,\}\d+)?)\s*\^\s*\\circ\b/g, (_, n: string) => `$${n}^\\circ$`);
  s = s.replace(/(\d+(?:\{,\}\d+)?)\s*°/g, (_, n: string) => `$${n}^\\circ$`);
  s = s.replace(
    /(\d+(?:\{,\}\d+)?)?\\sqrt\{([^}]+)\}/g,
    (match) => (match.startsWith("$") ? match : `$${match}$`),
  );
  s = s.replace(/\\frac\{[^}]+\}\{[^}]+\}/g, (m) => (m.startsWith("$") ? m : `$${m}$`));
  return s;
}

function mapOutsideMathDelimiters(text: string, fn: (plain: string) => string): string {
  const re = /(\$\$[\s\S]+?\$\$|\$(?:[^$]|\$(?!\$))+?\$)/g;
  const parts = text.split(re);
  return parts.map((part) => (part.startsWith("$") ? part : fn(part))).join("");
}

function cleanPlainText(value: string): string {
  return value.replace(/[ \t]{2,}/g, " ");
}

/** AI kartais naudoja \\(...\\) be uždarymo ar \\begin{cases} — verčiame į $ / $$. */
/** Pašalina eilučių lūžius \(...\) viduje ir atskiras `\)` eilutes. */
function collapseBrokenLatexLines(text: string): string {
  return text
    .replace(/\\\(\s*\n+\s*/g, "\\(")
    .replace(/\s*\n+\s*\\\)/g, "\\)")
    .replace(/\n[ \t]*\\\)[ \t]*(?=\n|$)/g, "\\)")
    .replace(/\$([\s\S]*?)\$/g, (_match, inner: string) => {
      const fixed = inner.replace(/\n+/g, " \\\\ ");
      return `$${fixed}$`;
    })
    .replace(/\$\$([\s\S]*?)\$\$/g, (_match, inner: string) => {
      const fixed = inner.replace(/\n+/g, " \\\\ ");
      return `$$${fixed}$$`;
    });
}

function normalizeLatexDelimiters(text: string): string {
  let s = collapseBrokenLatexLines(text);

  s = s.replace(/\\\[([\s\S]*?)\\\]/g, (_, inner: string) => `$$${inner.trim()}$$`);

  const toDelimited = (inner: string): string => {
    const t = inner.trim();
    if (/\\begin\{(cases|matrix|pmatrix|bmatrix|vmatrix|aligned|array)/.test(t)) {
      return `$$${t}$$`;
    }
    return `$${t}$`;
  };

  s = s.replace(/\\\(([\s\S]*?)\\\)/g, (_, inner: string) => toDelimited(inner));

  if (/\\\(/.test(s)) {
    s = s.replace(/\\\(([\s\S]*)$/g, (_, inner: string) => toDelimited(inner));
  }

  return s;
}

// Repair broken LaTeX escapes that arise from JSON parsing single-backslash commands.
// JSON spec treats \f, \b, \t, \n, \r as valid escape sequences (form feed, backspace,
// tab, newline, carriage return). When the AI writes \frac with a single backslash in
// a JSON string value, JSON.parse silently converts \f → U+000C (form feed) and drops
// the backslash, leaving "<FF>rac{3}{4}" instead of "\frac{3}{4}".
// This function recovers all such cases before rendering.
function repairBrokenEscapes(text: string): string {
  return text
    // JSON ate \f (form feed 0x0C), consuming the backslash AND the 'f'.
    // U+000C + "rac{3}{4}" must become "\frac{3}{4}", not "\rac{3}{4}".
    .replace(/\u000C([a-zA-Z]+)/g, "\\f$1")
    // JSON ate \b (backspace 0x08), consuming backslash AND 'b'.
    .replace(/\u0008([a-zA-Z]+)/g, "\\b$1")
    // Tab (0x09) from JSON \t: only fix before known LaTeX 't'-commands to avoid
    // mangling words that follow a real tab character in solution step text.
    .replace(/\u0009(ext\{)/g, "\\text{")
    .replace(/\u0009(heta\b)/g, "\\theta")
    .replace(/\u0009(imes\b)/g, "\\times")
    .replace(/\u0009(an(?:h)?\b)/g, "\\t$1")
    .replace(/\u0009(o\b)/g, "\\to")
    // Last-resort: bare command names with no preceding backslash at all.
    // These can't appear in normal Lithuanian prose, so false positives are impossible.
    .replace(/(?<![\\a-zA-Z])frac(?=\{)/g, "\\frac")
    .replace(/(?<![\\a-zA-Z])sqrt(?=\{|\s)/g, "\\sqrt")
    .replace(/(?<![\\a-zA-Z])text(?=\{)/g, "\\text")
    .replace(/(?<![\\a-zA-Z])cdot(?!\w)/g, "\\cdot")
    .replace(/(?<![\\a-zA-Z])times(?!\w)/g, "\\times")
    .replace(/(?<![\\a-zA-Z])leq(?!\w)/g, "\\leq")
    .replace(/(?<![\\a-zA-Z])geq(?!\w)/g, "\\geq")
    .replace(/(?<![\\a-zA-Z])neq(?!\w)/g, "\\neq");
}

function wrapPercentLiterals(text: string): string {
  return text
    .replace(/(\d+(?:[.,]\d+)?)\s*\/\s*(?=%)/g, "$1")
    .replace(/(\d+(?:[.,]\d+)?)\s*%/g, (_, n: string) => `$${n}\\%$`);
}

// Convert bare n/m fractions in plain text to $\frac{n}{m}$ before rendering.
function fixSlashFractions(text: string): string {
  return text.replace(/\b(\d{1,4})\/(\d{1,4})\b/g, (_, n, d) => `$\\frac{${n}}{${d}}$`);
}

// Only targets unambiguous patterns: x^2, 2^n, \frac{}{}, \sqrt{}, etc.
const BARE_MATH_RE = /(?:[A-Za-z\d]+\^(?:\{[^}]*\}|\d+|[A-Za-z])|\\[a-zA-Z]+(?:\{[^}]*\})*)/g;

function renderPlainSegment(text: string): React.ReactNode {
  const cleaned = cleanPlainText(text);
  const parts: React.ReactNode[] = [];
  let last = 0;
  let keyIdx = 0;

  for (const m of cleaned.matchAll(BARE_MATH_RE)) {
    if (m.index! > last) {
      parts.push(cleaned.slice(last, m.index));
    }
    const html = renderKatex(m[0], false);
    parts.push(
      <span
        key={keyIdx++}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
    last = m.index! + m[0].length;
  }

  if (last < cleaned.length) parts.push(cleaned.slice(last));
  return parts.length > 0 ? <>{parts}</> : cleaned;
}

export const MathText: React.FC<MathTextProps> = ({ text, className }) => {
  const nodes = useMemo(() => {
    if (!text) return null;
    const preprocessed = normalizeInequalitySystems(
      normalizeLatexDelimiters(
        repairBrokenEscapes(
          normalizeDoubleBackslashes(
            normalizeUnitSuperscripts(
              mapOutsideMathDelimiters(
                replaceNonCommandNNewlines(wrapPercentLiterals(fixSlashFractions(text))),
                enrichPlainTextMath,
              ),
            ),
          ),
        ),
      ),
    );
    return parseSegments(preprocessed).map((seg, i) => {
      if (seg.kind === "display") {
        return (
          <span
            key={i}
            className="block my-3 text-center overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: renderKatex(seg.latex, true) }}
          />
        );
      }
      if (seg.kind === "inline") {
        return (
          <span
            key={i}
            dangerouslySetInnerHTML={{ __html: renderKatex(seg.latex, false) }}
          />
        );
      }
      return <React.Fragment key={i}>{renderPlainSegment(seg.value)}</React.Fragment>;
    });
  }, [text]);

  return <span className={className}>{nodes}</span>;
};
