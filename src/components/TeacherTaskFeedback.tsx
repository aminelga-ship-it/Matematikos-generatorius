import { useState } from "react";
import { Check, ChevronDown, Loader2, MessageSquare } from "lucide-react";
import { createGeneratedTaskBankDraft, resolveCurriculumIdsForTask, submitTaskFeedback } from "../lib/bankApi";
import type { BankDifficulty, Difficulty, Task, TaskFeedbackType } from "../lib/types";
import { TASK_FEEDBACK_LABELS } from "../lib/types";

const OPTIONS: { value: TaskFeedbackType; label: string }[] = (
  Object.entries(TASK_FEEDBACK_LABELS) as [TaskFeedbackType, string][]
).map(([value, label]) => ({ value, label }));

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
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [linkedId, setLinkedId] = useState(bankItemId ?? "");

  const resolveBankId = async (): Promise<string> => {
    const existing = linkedId || bankItemId;
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

  const send = async (type: TaskFeedbackType) => {
    setSending(true);
    setError(null);
    try {
      const id = await resolveBankId();
      const curriculum =
        subtopicIds.length > 0 || topicIds.length > 0
          ? await resolveCurriculumIdsForTask(taskIndex, subtopicIds, topicIds)
          : undefined;
      const result = await submitTaskFeedback(id, type, comment, curriculum);
      if (type === "suitable") {
        setDone("Patvirtinta banke — tinkama užduotis");
      } else if (type === "unsuitable") {
        setDone("Užduotis pašalinta iš banko");
      } else {
        setDone(OPTIONS.find((o) => o.value === type)?.label ?? "Išsaugota");
      }
      setOpen(false);
      setComment("");
      onResolved?.(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Klaida");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
      >
        <MessageSquare size={12} />
        Mokytojo įvertinimas
        <ChevronDown size={12} className={`transition ${open ? "rotate-180" : ""}`} />
      </button>

      {done && !open && (
        <p className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600">
          <Check size={12} />
          {done}
        </p>
      )}
      {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}

      {open && (
        <div className="mt-2 space-y-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Neprivalomas komentaras…"
            rows={2}
            className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <div className="flex flex-wrap gap-1.5">
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                disabled={sending}
                onClick={() => void send(opt.value)}
                className="px-2 py-1 rounded-lg text-[10px] font-medium bg-indigo-50 text-indigo-800 hover:bg-indigo-100 disabled:opacity-50"
              >
                {sending ? <Loader2 size={10} className="animate-spin inline" /> : opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
