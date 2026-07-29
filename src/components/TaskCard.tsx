import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle, BookOpen, Pencil, Check, X } from "lucide-react";
import { MathText } from "./MathText";
import { GeometryVisualizer } from "./GeometryVisualizer";
import { GeoGebraGraph } from './GeoGebraGraph';
import type { Task } from "../lib/types";

interface TaskCardProps {
  task: Task;
  index: number;
  showAnswers: boolean;
  showSolutions: boolean;
  canEdit?: boolean;
  onEdit?: (index: number, updated: Task) => void;
}

// Split task question into sub-parts a), b), c)… each on its own line.
// Only splits on sub-part markers that appear OUTSIDE of $...$ math blocks.
function splitSubParts(text: string): { label: string | null; content: string }[] {
  const mathRanges: [number, number][] = [];
  for (const m of text.matchAll(/\$\$[\s\S]+?\$\$|\$[^$\n]+?\$/g)) {
    mathRanges.push([m.index!, m.index! + m[0].length]);
  }
  const inMath = (pos: number) => mathRanges.some(([s, e]) => pos >= s && pos < e);

  const splitRe = /(?:[\n]|(?<=\s))(?=[a-žA-Ž]\)|\d+\))/g;
  const splitPoints: number[] = [];
  for (const m of text.matchAll(splitRe)) {
    if (!inMath(m.index!)) splitPoints.push(m.index!);
  }

  if (splitPoints.length === 0) {
    const trimmed = text.trim();
    const labelMatch = trimmed.match(/^([a-žA-Ž]\)|[0-9]+\))\s*/);
    if (labelMatch) {
      return [{ label: labelMatch[1], content: trimmed.slice(labelMatch[0].length) }];
    }
    return trimmed ? [{ label: null, content: trimmed }] : [];
  }

  const chunks: string[] = [];
  let prev = 0;
  for (const pos of splitPoints) {
    const chunk = text.slice(prev, pos).trim();
    if (chunk) chunks.push(chunk);
    prev = pos;
  }
  const last = text.slice(prev).trim();
  if (last) chunks.push(last);

  return chunks
    .map((chunk) => {
      const labelMatch = chunk.match(/^([a-žA-Ž]\)|[0-9]+\))\s*/);
      if (labelMatch) {
        return { label: labelMatch[1], content: chunk.slice(labelMatch[0].length).trim() };
      }
      return { label: null, content: chunk };
    })
    .filter((p) => p.content.length > 0);
}

function parseSolutionLines(text: string): string[] {
  return text.split(/\n/).map((l) => l.trim()).filter(Boolean);
}

const CARD_ACCENT_COLORS = [
  "border-l-blue-500",
  "border-l-violet-500",
  "border-l-cyan-500",
  "border-l-teal-500",
  "border-l-indigo-500",
];

export function TaskCard({ task, index, showAnswers, showSolutions, canEdit, onEdit }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Task>(task);

  const accentColor = CARD_ACCENT_COLORS[index % CARD_ACCENT_COLORS.length];
  const subParts = splitSubParts(editing ? draft.question : task.question);
  const solutionLines = parseSolutionLines(editing ? draft.solution : task.solution);

  const startEdit = () => {
    setDraft(task);
    setEditing(true);
  };

  const saveEdit = () => {
    onEdit?.(index, draft);
    setEditing(false);
  };

  const cancelEdit = () => {
    setDraft(task);
    setEditing(false);
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 border-l-4 ${accentColor} shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden`}
    >
      {/* Question */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-start gap-4">
          {/* Number badge */}
          <div className="flex-shrink-0 flex flex-col items-center gap-0.5 pt-0.5">
            <span className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-sm flex items-center justify-center shadow-sm">
              {index + 1}
            </span>
            <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest mt-0.5">
              Nr.
            </span>
          </div>

          {/* Question content */}
          <div className="flex-1 pt-0.5 space-y-1.5">
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Klausimas
                  </label>
                  <textarea
                    value={draft.question}
                    onChange={(e) => setDraft({ ...draft, question: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 text-sm text-slate-700 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Atsakymas
                  </label>
                  <input
                    type="text"
                    value={draft.answer}
                    onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
                    className="w-full px-3 py-2 text-sm text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Sprendimas
                  </label>
                  <textarea
                    value={draft.solution}
                    onChange={(e) => setDraft({ ...draft, solution: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 text-sm text-slate-700 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
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
                    <button
                      onClick={startEdit}
                      className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                      title="Redaguoti užduotį"
                    >
                      <Pencil size={12} />
                      Redaguoti
                    </button>
                  )}
                </div>

                {/* Geometry diagram */}
                {task.diagram_config && (
                  <GeometryVisualizer config={task.diagram_config} />
                )}
                {/* Interaktyvus GeoGebra grafikas */}
                {Boolean(task.function_equation && task.function_equation.trim() !== '') && (
                  <GeoGebraGraph equation={task.function_equation} />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Answer */}
      {showAnswers && !editing && (
        <div className="mx-6 mb-4 flex items-center gap-3 px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100">
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

      {/* Solution accordion */}
      {showSolutions && !editing && (
        <div className="border-t border-slate-100">
          <button
            onClick={() => setExpanded((p) => !p)}
            className={`w-full flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              expanded
                ? "text-blue-700 bg-blue-50"
                : "text-slate-400 hover:text-blue-600 hover:bg-slate-50"
            }`}
          >
            <BookOpen size={14} />
            <span>{expanded ? "Slėpti sprendimą" : "Rodyti sprendimą"}</span>
            <span className="ml-auto">
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </span>
          </button>

          {expanded && (
            <div className="px-6 py-5 bg-blue-50 border-t border-blue-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                  Sprendimas
                </span>
                <div className="flex-1 h-px bg-blue-200" />
              </div>

              <ol className="space-y-2.5">
                {solutionLines.map((line, i) => {
                  const stepMatch = line.match(/^(\d+[.)]\s*|Žingsnis\s*\d+[.:]\s*)/i);
                  const content = stepMatch ? line.slice(stepMatch[0].length) : line;
                  const isEquation = !stepMatch && /=/.test(line) && line.length < 100;

                  return (
                    <li key={i} className="flex items-baseline gap-3">
                      {stepMatch ? (
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-200 text-blue-800 text-[11px] font-bold flex items-center justify-center leading-none mt-0.5">
                          {i + 1}
                        </span>
                      ) : (
                        <span
                          className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-[7px] ${
                            isEquation ? "bg-blue-500" : "bg-blue-300"
                          }`}
                        />
                      )}
                      <span
                        className={`text-sm leading-relaxed text-blue-900 ${
                          isEquation ? "font-medium" : ""
                        }`}
                      >
                        <MathText text={content || line} />
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
