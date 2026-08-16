import type { Task } from "./types";
import { mathTextToPlainText } from "./mathPlainText";

export type TaskSubPart = { label: string | null; content: string };

/** Užduoties tekstas kopijavimui — tik sąlyga, be atsakymų ir sprendimų. */
export function formatTaskForClipboard(
  index: number,
  subParts: TaskSubPart[],
): string {
  const lines: string[] = [`${index + 1}.`];

  for (const part of subParts) {
    const plain = mathTextToPlainText(part.content);
    if (!plain) continue;
    lines.push(part.label ? `${part.label} ${plain}` : plain);
  }

  return lines.join("\n");
}
