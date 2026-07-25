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
  const re = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\$([^$\n]+?)\$|\\\(([\s\S]+?)\\\)/g;
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

function renderKatex(latex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      strict: false,
      trust: false,
      output: "html",
    });
  } catch {
    return escapeHtml(latex);
  }
}

function cleanPlainText(value: string): string {
  return value.replace(/[ \t]{2,}/g, " ");
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

// Convert bare n/m fractions in plain text to $\frac{n}{m}$ before rendering.
// Matches patterns like 3/4, 12/5, 100/7 — integers only, to avoid false
// positives on dates (2024/01) or division expressions already in LaTeX.
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
    const preprocessed = repairBrokenEscapes(fixSlashFractions(text));
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
