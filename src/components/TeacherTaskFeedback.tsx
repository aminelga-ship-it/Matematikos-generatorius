import { useEffect, useState } from "react";
import { AlertTriangle, Check, Loader2, Send, Star, X } from "lucide-react";
import { createGeneratedTaskBankDraft, resolveCurriculumIdsForTask, submitTaskFeedback } from "../lib/bankApi";
import type { BankDifficulty, Difficulty, Task, TaskFeedbackType } from "../lib/types";
import { TASK_FEEDBACK_LABELS } from "../lib/types";

const FEEDBACK_OPTIONS: {
  value: TaskFeedbackType;
  label: string;
  icon: "star" | "check" | "warn" | "x";
}[] = [
  { value: "excellent", label: TASK_FEEDBACK_LABELS.excellent, icon: "star" },
  { value: "suitable", label: TASK_FEEDBACK_LABELS.suitable, icon: "check" },
  { value: "fix_text", label: TASK_FEEDBACK_LABELS.fix_text, icon: "warn" },
  { value: "fix_solution", label: TASK_FEEDBACK_LABELS.fix_solution, icon: "warn" },
  { value: "wrong_difficulty", label: TASK_FEEDBACK_LABELS.wrong_difficulty, icon: "warn" },
  { value: "unsuitable", label: TASK_FEEDBACK_LABELS.unsuitable, icon: "x" },
];

function FeedbackIcon({ kind }: { kind: (typeof FEEDBACK_OPTIONS)[number]["icon"] }) {
  if (kind === "star") {
    return <Star size={14} className="text-amber-400 fill-amber-400 flex-shrink-0" />;
  }
  if (kind === "check") {
    return (
      <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-emerald-500 flex-shrink-0">
        <Check size={11} className="text-white" strokeWidth={3} />
      </span>
    );
  }
  if (kind === "warn") {
    return <AlertTriangle size={14} className="text-amber-500 fill-amber-100 flex-shrink-0" />;
  }
  return <X size={14} className="text-red-500 flex-shrink-0" strokeWidth={2.5} />;
}

function toBankDifficulty(d?: Difficulty): BankDifficulty {
  if (d === "lengvos" || d === "sunkios") return d;
  return "vidutinės";
}

interface TeacherTaskFeedbackProps {
  bankItemId?: string;
  grade: number;
  task: Task;
  taskIndex: number;
  sessionDifficulty?: Difficulty;
  topicIds?: string[];
  subtopicIds?: string[];
  onBankItemLinked?: (bankItemId: string) => void;
  onResolved?: (result: "approved" | "draft" | "deleted") => void;
}

export function TeacherTaskFeedback({
  bankItemId,
  grade,
  task,
  taskIndex,
  sessionDifficulty,
  topicIds = [],
  subtopicIds = [],
  onBankItemLinked,
  onResolved,
}: TeacherTaskFeedbackProps) {
  const [selected, setSelected] = useState<TaskFeedbackType | null>(null);
  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [linkedId, setLinkedId] = useState(bankItemId ?? task.bank_item_id ?? "");

  useEffect(() => {
    const id = bankItemId ?? task.bank_item_id;
    if (id) setLinkedId(id);
  }, [bankItemId, task.bank_item_id]);

  const resolveBankId = async (): Promise<string> => {
    const existing = linkedId || bankItemId || task.bank_item_id;
    if (existing) return existing;
    const curriculum = await resolveCurriculumIdsForTask(taskIndex, subtopicIds, topicIds);
    const id = await createGeneratedTaskBankDraft({
      grade,
      difficulty: toBankDifficulty(sessionDifficulty),
      task,
      topic_id: curriculum.topic_id,
      subtopic_id: curriculum.subtopic_id,
    });
    setLinkedId(id);
    onBankItemLinked?.(id);
    return id;
  };

  const send = async () => {
    if (!selected) return;
    setSending(true);
    setError(null);
    try {
      const id = await resolveBankId();
      const curriculum =
        subtopicIds.length > 0 || topicIds.length > 0
          ? await resolveCurriculumIdsForTask(taskIndex, subtopicIds, topicIds)
          : undefined;
      const result = await submitTaskFeedback(id, selected, comment, curriculum);
      setDone("Ačiū už įvertinimą");
      setSelected(null);
      setComment("");
      setShowComment(false);
      onResolved?.(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Klaida");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <span className="text-[11px] font-semibold text-slate-600 shrink-0">Įvertinimas:</span>
        {FEEDBACK_OPTIONS.map((opt) => {
          const active = selected === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={sending}
              onClick={() => setSelected(opt.value)}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-medium transition max-w-[11rem] sm:max-w-none ${
                active
                  ? "border-indigo-400 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-200"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <FeedbackIcon kind={opt.icon} />
              <span className="truncate">{opt.label}</span>
            </button>
          );
        })}
        <button
          type="button"
          disabled={sending || !selected}
          onClick={() => void send()}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-slate-200 disabled:text-slate-400 transition shrink-0"
        >
          {sending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
          Siųsti
        </button>
        <button
          type="button"
          disabled={sending}
          onClick={() => setShowComment((v) => !v)}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-medium transition shrink-0 ${
            showComment
              ? "border-indigo-300 bg-indigo-50 text-indigo-800"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          Komentuoti
        </button>
      </div>

      {showComment && (
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Neprivalomas komentaras…"
          rows={1}
          className="w-full text-[11px] px-2 py-1.5 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      )}

      {done && (
        <p className="flex items-center gap-1 text-[11px] text-emerald-600">
          <Check size={12} />
          {done}
        </p>
      )}
      {error && <p className="text-[11px] text-red-600">{error}</p>}
    </div>
  );
}
