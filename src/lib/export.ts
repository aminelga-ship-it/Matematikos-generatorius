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
          spacing: { after: 300 },
        })
      );
    }
  });

  const doc = new Document({
    sections: [{ children }],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `matematikos-uzduotys-${grade}-klase.docx`);
  });
}
