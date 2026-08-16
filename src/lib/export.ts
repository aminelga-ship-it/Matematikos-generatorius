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
import { mathTextToPlainText } from "./mathPlainText";

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
          new TextRun({ text: mathTextToPlainText(task.question), size: 24 }),
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
