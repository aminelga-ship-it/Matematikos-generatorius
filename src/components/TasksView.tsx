
import {
  Eye, EyeOff, BookOpen, BookX, Printer, ArrowLeft, GraduationCap,
  FileType2, Lock,
} from "lucide-react";
import { TaskCard } from "./TaskCard";
import type { Task, Difficulty } from "../lib/types";
import { tasksIncludeSolutions } from "../lib/types";
import { exportToWord } from "../lib/export";

interface TasksViewProps {
  tasks: Task[];
  grade: number;
  taskCount: number;
  showAnswers: boolean;
  showSolutions: boolean;
  canEdit: boolean;
  canExport: boolean;
  canPrint: boolean;
  onToggleAnswers: () => void;
  onToggleSolutions: () => void;
  onReset: () => void;
  onEditTask: (index: number, updated: Task) => void;
  onLockedAction: (featureName: string) => void;
  showTeacherFeedback?: boolean;
  sessionDifficulty?: Difficulty;
  topicIds?: string[];
  subtopicIds?: string[];
  sourceHint?: string;
  onBankFeedback?: (index: number, result: "approved" | "draft" | "deleted") => void;
  onBankItemLinked?: (index: number, bankItemId: string) => void;
}

export function TasksView({
  tasks,
  grade,
  showAnswers,
  showSolutions,
  canEdit,
  canExport,
  canPrint,
  onToggleAnswers,
  onToggleSolutions,
  onReset,
  onEditTask,
  onLockedAction,
  showTeacherFeedback,
  sessionDifficulty,
  topicIds,
  subtopicIds,
  sourceHint,
  onBankFeedback,
  onBankItemLinked,
}: TasksViewProps) {
  const hasSolutions = tasksIncludeSolutions(tasks);

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center shadow-sm">
            <GraduationCap size={17} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-base leading-none">
              Matematikos užduotys
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {tasks.length} užduot{tasks.length === 1 ? "is" : "ys"} · {grade} klasė
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onToggleAnswers}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 ${
              showAnswers
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
            }`}
          >
            {showAnswers ? <Eye size={13} /> : <EyeOff size={13} />}
            {showAnswers ? "Slėpti atsakymus" : "Atsakymai"}
          </button>

          {hasSolutions && (
            <button
              onClick={onToggleSolutions}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                showSolutions
                  ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {showSolutions ? <BookOpen size={13} /> : <BookX size={13} />}
              {showSolutions ? "Slėpti sprendimus" : "Sprendimai"}
            </button>
          )}

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <button
            onClick={() => canExport ? exportToWord(tasks, grade) : onLockedAction("Word (.docx) eksportas")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 ${
              canExport
                ? "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                : "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100"
            }`}
          >
            {canExport ? <FileType2 size={13} /> : <Lock size={12} />}
            Word
          </button>

          <button
            onClick={() => canPrint ? window.print() : onLockedAction("Spausdinimas")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 ${
              canPrint
                ? "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                : "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100"
            }`}
          >
            {canPrint ? <Printer size={13} /> : <Lock size={12} />}
            Spausdinti
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 transition-all duration-150"
          >
            <ArrowLeft size={13} />
            Grįžti
          </button>
        </div>
      </div>

      {sourceHint && (
        <p className="text-sm text-violet-700 bg-violet-50 border border-violet-100 rounded-xl px-4 py-2.5">
          {sourceHint}
        </p>
      )}

      {/* Task list */}
      <div className="space-y-3">
        {tasks.map((task, i) => (
          <TaskCard
            key={i}
            task={task}
            index={i}
            showAnswers={showAnswers}
            showSolutions={hasSolutions && showSolutions}
            canEdit={canEdit}
            onEdit={onEditTask}
            showTeacherFeedback={showTeacherFeedback}
            grade={grade}
            sessionDifficulty={sessionDifficulty}
            topicIds={topicIds}
            subtopicIds={subtopicIds}
            onBankFeedback={onBankFeedback}
            onBankItemLinked={onBankItemLinked}
          />
        ))}
      </div>
    </div>
  );
}
