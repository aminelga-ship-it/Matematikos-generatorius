import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import { saveAs } from "file-saver";
import type { Task } from "./types";

// Strip LaTeX/MathTeX markers for plain text export.
// Converts $...$ inline math to plain text, removes \frac, \sqrt etc.
function stripLatex(text: string): string {
  return text
    .replace(/\$\$/g, "")
    .replace(/\$([^$]+)\$/g, (_m, inner: string) => inner)
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)")
    .replace(/\\sqrt\{([^}]+)\}/g, "√($1)")
    .replace(/\\cdot/g, "·")
    .replace(/\\times/g, "×")
    .replace(/\\leq/g, "≤")
    .replace(/\\geq/g, "≥")
    .replace(/\\neq/g, "≠")
    .replace(/\\pi/g, "π")
    .replace(/\\infty/g, "∞")
    .replace(/\\cup/g, "∪")
    .replace(/\\cap/g, "∩")
    .replace(/\\sin/g, "sin")
    .replace(/\\cos/g, "cos")
    .replace(/\\tan/g, "tan")
    .replace(/\\log/g, "log")
    .replace(/\\ln/g, "ln")
    .replace(/\\left/g, "")
    .replace(/\\right/g, "")
    .replace(/\\,/g, " ")
    .replace(/\\;/g, " ")
    .replace(/\\!/g, "")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\{/g, "{")
    .replace(/\\\}/g, "}")
    .replace(/\\(\w+)/g, "$1")
    .replace(/\^([^{}]+)/g, "^$1")
    .replace(/\^{([^}]+)}/g, "^$1")
    .replace(/_([^{}]+)/g, "_$1")
    .replace(/_{([^}]+)}/g, "_$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function exportToWord(tasks: Task[], grade: number): void {
  const children: Paragraph[] = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `Matematikos užduotys — ${grade} klasė`,
          bold: true,
          size: 32,
        }),
      ],
    }),
    new Paragraph({ text: "" }),
  ];

  tasks.forEach((task, i) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${i + 1}. `, bold: true, size: 24 }),
          new TextRun({ text: stripLatex(task.question), size: 24 }),
        ],
        spacing: { after: 200 },
      })
    );

    if (task.diagram_config) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `[Geometrijos brėžinys: ${task.diagram_config.type}]`,
              italics: true,
              color: "888888",
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        })
      );
    }

    if (task.function_equation) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `[Funkcijos grafikas: ${task.function_equation}]`,
              italics: true,
              color: "888888",
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        })
      );
    }

    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Atsakymas: ", bold: true, size: 22 }),
          new TextRun({ text: stripLatex(task.answer), size: 22 }),
        ],
        spacing: { after: 100 },
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Sprendimas: ", bold: true, size: 22 }),
          new TextRun({ text: stripLatex(task.solution), size: 22 }),
        ],
        spacing: { after: 300 },
      })
    );
  });

  const doc = new Document({
    sections: [{ children }],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `matematikos-uzduotys-${grade}-klase.docx`);
  });
}

export function exportToPDF(tasks: Task[], grade: number): void {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const escapeHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const stripMath = (text: string) => escapeHtml(stripLatex(text));

  const html = `
<!DOCTYPE html>
<html lang="lt">
<head>
<meta charset="UTF-8">
<title>Matematikos užduotys — ${grade} klasė</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"
  onload="renderMathInElement(document.body, {delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}]});"></script>
<style>
  body { font-family: Georgia, 'Times New Roman', serif; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1a1a1a; }
  h1 { text-align: center; font-size: 20pt; margin-bottom: 30px; }
  .task { margin-bottom: 24px; page-break-inside: avoid; border-bottom: 1px solid #ddd; padding-bottom: 12px; }
  .task-num { font-weight: bold; font-size: 12pt; }
  .answer { margin-top: 8px; font-style: italic; color: #555; }
  .solution { margin-top: 4px; font-size: 11pt; color: #333; }
  .meta { font-size: 10pt; color: #888; font-style: italic; }
  @media print { body { margin: 20px; } }
</style>
</head>
<body>
  <h1>Matematikos užduotys — ${grade} klasė</h1>
  ${tasks
    .map(
      (t, i) => `
    <div class="task">
      <div class="task-num">${i + 1}. ${stripMath(t.question)}</div>
      ${t.diagram_config ? `<div class="meta">[Geometrijos brėžinys: ${t.diagram_config.type}]</div>` : ""}
      ${t.function_equation ? `<div class="meta">[Funkcijos grafikas: ${escapeHtml(t.function_equation)}]</div>` : ""}
      <div class="answer">Atsakymas: ${stripMath(t.answer)}</div>
      <div class="solution">Sprendimas: ${stripMath(t.solution)}</div>
    </div>
  `
    )
    .join("")}
  <script>
    window.onload = () => setTimeout(() => window.print(), 800);
  </script>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
}
