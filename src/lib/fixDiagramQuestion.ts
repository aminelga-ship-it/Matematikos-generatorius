import type { DiagramConfig } from './types';

export function fixDiagramQuestionText(question: string, config?: DiagramConfig): string {
  if (!config?.labels) return question;
  const hasX = Object.values(config.labels).some(
    (v) => String(v ?? '').trim().toUpperCase() === 'X',
  );
  if (!hasX) return question;

  let q = question;
  q = q.replace(/\b(left|right)_?[abc]\b/gi, '$X$');
  q = q.replace(/\b(right|left)\s+a\b/gi, '$X$');
  q = q.replace(/\braskite[^.?]*\bright_a\b/gi, 'Raskite kraštinės $X$ ilgį');
  q = q.replace(/\braskite[^.?]*\bleft_a\b/gi, 'Raskite kraštinės $X$ ilgį');
  if (!/\$X\$|\bX\b/i.test(q)) {
    q = `${q.replace(/\.\s*$/, '')}. Raskite kraštinės $X$ ilgį.`.replace(/\.\./g, '.');
  }
  return q.replace(/\s{2,}/g, ' ').trim();
}
