import { useState } from "react";
import { CheckCircle, Pencil, Check, X, Sparkles, Loader2, ClipboardCheck, Copy } from "lucide-react";
import { MathText } from "./MathText";
import { GeometryVisualizer } from "./GeometryVisualizer";
import { GeoGebraGraph } from './GeoGebraGraph';
import type { Task, Difficulty } from "../lib/types";
import { fixDiagramQuestionText } from "../lib/fixDiagramQuestion";
import { formatTaskForClipboard } from "../lib/formatTaskCopy";
import { getTaskSecondaryActions } from "../lib/taskSecondaryActions";
import { TeacherTaskFeedback } from "./TeacherTaskFeedback";

interface TaskCardProps {
  task: Task;
  index: number;
  showAnswers: boolean;
  imageOnly?: boolean;
  generatingSecondary?: "answer" | null;
  reviewingTask?: boolean;
  onGenerateAnswer?: (index: number, question: string) => void;
  onReviewTask?: (index: number, question: string) => void;
  canEdit?: boolean;
  onEdit?: (index: number, updated: Task) => void;
  showTeacherFeedback?: boolean;
  grade?: number;
  sessionDifficulty?: Difficulty;
  topicIds?: string[];
  subtopicIds?: string[];
  onBankFeedback?: (index: number, result: "approved" | "draft" | "deleted") => void;
  onBankItemLinked?: (index: number, bankItemId: string) => void;
  hideNumberBadge?: boolean;
  displayNumber?: number;
}

// Split task question into sub-parts a), b), c) or A), B), C)… each on its own line.
// Does not split on digits like "3)" inside formulas (e.g. (y − 3)).
function splitSubParts(text: string): { label: string | null; content: string }[] {
  const normalized = text
    .replace(/\\\(\s*\n+\s*/g, "\\(")
    .replace(/\s*\n+\s*\\\)/g, "\\)")
    .replace(/\n[ \t]*\\\)[ \t]*(?=\n|$)/g, "\\)");

  const mathRanges: [number, number][] = [];
  for (const m of normalized.matchAll(/\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\\\([\s\S]+?\\\)/g)) {
    mathRanges.push([m.index!, m.index! + m[0].length]);
  }
  const inMath = (pos: number) => mathRanges.some(([s, e]) => pos >= s && pos < e);

  const splitPoints: number[] = [];

  for (const m of normalized.matchAll(/\n\s*(?=(?:[a-z]\)|\d{1,2}\)))/g)) {
    const pos = m.index!;
    if (!inMath(pos + 1)) splitPoints.push(pos);
  }

  for (const m of normalized.matchAll(/(?<=\s)(?=[A-D]\)\s)/g)) {
    const pos = m.index!;
    if (!inMath(pos)) splitPoints.push(pos);
  }

  for (const m of normalized.matchAll(/(?<=[?.!])\s*(?=[A-D](?:\)|\s))/g)) {
    const pos = m.index!;
    if (!inMath(pos)) splitPoints.push(pos);
  }

  const unique = [...new Set(splitPoints)].sort((a, b) => a - b);

  if (unique.length === 0) {
    const trimmed = normalized.trim();
    const labelMatch = trimmed.match(/^([a-z]\)|[A-D]\)|\d{1,2}\))\s*/);
    if (labelMatch) {
      return [{ label: labelMatch[1], content: trimmed.slice(labelMatch[0].length).trim() }];
    }
    return trimmed ? [{ label: null, content: trimmed }] : [];
  }

  const chunks: string[] = [];
  let prev = 0;
  for (const pos of unique) {
    const chunk = normalized.slice(prev, pos).trim();
    if (chunk) chunks.push(chunk);
    prev = pos;
  }
  const last = normalized.slice(prev).trim();
  if (last) chunks.push(last);

  return chunks
    .map((chunk) => {
      const labelMatch = chunk.match(/^([a-z]\)|[A-D]\)|\d{1,2}\))\s*/);
      if (labelMatch) {
        return { label: labelMatch[1], content: chunk.slice(labelMatch[0].length).trim() };
      }
      const mcLetter = chunk.match(/^([A-D])\s+(?=\S)/);
      if (mcLetter) {
        return { label: `${mcLetter[1]})`, content: chunk.slice(mcLetter[0].length).trim() };
      }
      return { label: null, content: chunk };
    })
    .filter((p) => p.content.length > 0);
}


const CARD_ACCENT_COLORS = [
  "border-l-blue-500",
  "border-l-violet-500",
  "border-l-cyan-500",
  "border-l-teal-500",
  "border-l-indigo-500",
];

export function TaskCard({ task, index, showAnswers, imageOnly, generatingSecondary, reviewingTask, onGenerateAnswer, onReviewTask, canEdit, onEdit, showTeacherFeedback, grade, sessionDifficulty, topicIds, subtopicIds, onBankFeedback, onBankItemLinked, hideNumberBadge, displayNumber }: TaskCardProps) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [draftQuestion, setDraftQuestion] = useState(task.question);
  const [draftFunctionEquation, setDraftFunctionEquation] = useState(task.function_equation ?? "");
  const [draftDiagramRemoved, setDraftDiagramRemoved] = useState(false);

  const hasAnswerText = (task.answer ?? "").trim().length > 0;
  const hasReviewNotes = (task.ai_review_notes ?? "").trim().length > 0;
  const secondaryActions = grade
    ? getTaskSecondaryActions(task, grade, { imageOnly })
    : { showReview: false, showGenerateAnswer: false };

  const showAnswerBlock = !editing && hasAnswerText && showAnswers;
  const showReviewButton = !editing && secondaryActions.showReview && onReviewTask;
  const showGenerateButton =
    !editing && secondaryActions.showGenerateAnswer && onGenerateAnswer;
  const aiBusy = reviewingTask || generatingSecondary != null;

  const hasGraph = Boolean(task.function_equation && task.function_equation.trim() !== "");
  const hasDiagram = Boolean(task.diagram_config && !draftDiagramRemoved);

  const accentColor = CARD_ACCENT_COLORS[index % CARD_ACCENT_COLORS.length];
  const displayQuestion = fixDiagramQuestionText(task.question, task.diagram_config);
  const subParts = splitSubParts(editing ? draftQuestion : displayQuestion);

  const startEdit = () => {
    setDraftQuestion(task.question);
    setDraftFunctionEquation(task.function_equation ?? "");
    setDraftDiagramRemoved(false);
    setEditing(true);
  };

  const saveEdit = () => {
    const trimmedEq = draftFunctionEquation.trim();
    onEdit?.(index, {
      ...task,
      question: draftQuestion,
      function_equation: trimmedEq.length > 0 ? trimmedEq : undefined,
      diagram_config: draftDiagramRemoved ? undefined : task.diagram_config,
    });
    setEditing(false);
  };

  const cancelEdit = () => {
    setDraftQuestion(task.question);
    setDraftFunctionEquation(task.function_equation ?? "");
    setDraftDiagramRemoved(false);
    setEditing(false);
  };

  const removeGraph = () => {
    setDraftFunctionEquation("");
  };

  const removeDiagram = () => {
    setDraftDiagramRemoved(true);
  };

  const handleCopyTask = async () => {
    const copyIndex = displayNumber != null ? displayNumber - 1 : index;
    const text = formatTaskForClipboard(copyIndex, subParts);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 border-l-4 ${accentColor} shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden`}
    >
      {/* Question */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-start gap-4">
          {/* Number badge */}
          {!hideNumberBadge && (
          <div className="flex-shrink-0 flex flex-col items-center gap-0.5 pt-0.5">
            <span className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-sm flex items-center justify-center shadow-sm">
              {displayNumber ?? index + 1}
            </span>
            <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest mt-0.5">
              Nr.
            </span>
          </div>
          )}

          {/* Question content */}
          <div className="flex-1 min-w-0 pt-0.5 space-y-1.5">
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Užduoties tekstas
                  </label>
                  <div className="space-y-1.5">
                    {splitSubParts(draftQuestion).map((part, i) => (
                      <div key={i} className={part.label ? "flex items-baseline gap-2.5" : ""}>
                        {part.label && (
                          <span className="flex-shrink-0 font-bold text-blue-600 text-[14px] min-w-[1.6rem]">
                            {part.label}
                          </span>
                        )}
                        <span className="text-slate-800 text-[15px] leading-[1.75]">
                          <MathText text={part.content || " "} />
                        </span>
                      </div>
                    ))}
                  </div>
                  <details className="mt-2 group" open>
                    <summary className="text-[11px] font-medium text-slate-400 cursor-pointer hover:text-slate-600 select-none">
                      LaTeX šaltinis (koreguojama užduotis)
                    </summary>
                    <textarea
                      value={draftQuestion}
                      onChange={(e) => setDraftQuestion(e.target.value)}
                      rows={5}
                      className="mt-2 w-full px-3 py-2 text-sm font-mono text-slate-700 border border-slate-200 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </details>
                </div>
                {(hasGraph || draftFunctionEquation.trim() !== "") && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      GeoGebra lygtis
                    </label>
                    <input
                      type="text"
                      value={draftFunctionEquation}
                      onChange={(e) => setDraftFunctionEquation(e.target.value)}
                      placeholder="pvz. y=sqrt(ln(2*x-3))"
                      className="w-full px-3 py-2 text-sm font-mono text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <button
                      type="button"
                      onClick={removeGraph}
                      className="mt-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                    >
                      Pašalinti grafiką
                    </button>
                  </div>
                )}
                {task.diagram_config && !draftDiagramRemoved && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Brėžinys
                    </p>
                    <p className="text-xs text-slate-600 mb-2">Užduotyje yra geometrijos brėžinys.</p>
                    <button
                      type="button"
                      onClick={removeDiagram}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                    >
                      Ištrinti brėžinį
                    </button>
                  </div>
                )}
                {draftDiagramRemoved && task.diagram_config && (
                  <p className="text-xs text-amber-700">Brėžinys bus pašalintas išsaugojus.</p>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={saveEdit}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition"
                  >
                    <Check size={14} />
                    Išsaugoti
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                  >
                    <X size={14} />
                    Atšaukti
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-1.5">
                    {subParts.map((part, i) => (
                      <div key={i} className={part.label ? "flex items-baseline gap-2.5" : ""}>
                        {part.label && (
                          <span className="flex-shrink-0 font-bold text-blue-600 text-[14px] min-w-[1.6rem]">
                            {part.label}
                          </span>
                        )}
                        <span className="text-slate-800 text-[15px] leading-[1.75]">
                          <MathText text={part.content} />
                        </span>
                      </div>
                    ))}
                  </div>

                  {canEdit && (
                    <div className="flex flex-shrink-0 flex-col items-end gap-1 no-print">
                      <button
                        onClick={startEdit}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                        title="Redaguoti užduotį"
                      >
                        <Pencil size={12} />
                        Redaguoti
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleCopyTask()}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                        title="Kopijuoti užduotį"
                      >
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        {copied ? "Nukopijuota" : "Kopijuoti"}
                      </button>
                    </div>
                  )}
                  {!canEdit && (
                    <button
                      type="button"
                      onClick={() => void handleCopyTask()}
                      className="no-print flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                      title="Kopijuoti užduotį"
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? "Nukopijuota" : "Kopijuoti"}
                    </button>
                  )}
                </div>

                {showTeacherFeedback && grade != null && (
                  <div className="no-print">
                    <TeacherTaskFeedback
                    bankItemId={task.bank_item_id}
                    grade={grade}
                    task={task}
                    taskIndex={index}
                    sessionDifficulty={sessionDifficulty}
                    topicIds={topicIds}
                    subtopicIds={subtopicIds}
                    onBankItemLinked={(id) => onBankItemLinked?.(index, id)}
                    onResolved={(result) => onBankFeedback?.(index, result)}
                  />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {!editing && (hasDiagram || hasGraph) && (
          <div className="mt-4 w-full min-w-0 space-y-3">
            {hasDiagram && task.diagram_config && (
              <GeometryVisualizer config={task.diagram_config} />
            )}
            {hasGraph && (
              <GeoGebraGraph equation={task.function_equation} />
            )}
          </div>
        )}
      </div>

      {(showReviewButton || showGenerateButton) && (
        <div className="mx-6 mb-4 space-y-3 no-print">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
            {showReviewButton && (
              <div className="flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => onReviewTask?.(index, task.question.trim() || displayQuestion)}
                  disabled={aiBusy}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100 transition disabled:opacity-60 w-full sm:w-auto"
                >
                  {reviewingTask ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <ClipboardCheck size={15} />
                  )}
                  {reviewingTask ? "Tikrinama…" : "Patikrinti užduotį"}
                </button>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  AI patikrina užduotį ir jei reikia ją pataiso.
                </p>
              </div>
            )}
            {showGenerateButton && (
              <div className="flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => onGenerateAnswer?.(index, task.question.trim() || displayQuestion)}
                  disabled={aiBusy}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-violet-200 bg-violet-50 text-violet-800 hover:bg-violet-100 transition disabled:opacity-60 w-full sm:w-auto"
                >
                  {generatingSecondary === "answer" ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Sparkles size={15} />
                  )}
                  {generatingSecondary === "answer" ? "Generuojama…" : "Generuoti atsakymą"}
                </button>
              </div>
            )}
          </div>

          {hasReviewNotes && (
            <div className="no-print px-4 py-3 bg-sky-50 rounded-xl border border-sky-100" data-ai-review-notes>
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest block leading-none mb-1.5">
                AI rekomendacijos
              </span>
              <p className="text-sm text-sky-900 leading-relaxed">
                <MathText text={task.ai_review_notes ?? ""} />
              </p>
            </div>
          )}
        </div>
      )}

      {showAnswerBlock && (
        <div className="task-answer-section mx-6 mb-4 flex items-center gap-3 px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100">
          <CheckCircle size={15} className="text-emerald-500 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block leading-none mb-1">
              Atsakymas
            </span>
            <span className="text-sm font-semibold text-emerald-800">
              <MathText text={task.answer} />
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
