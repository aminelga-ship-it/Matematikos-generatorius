import React from "react";
import { History, Clock, ChevronRight } from "lucide-react";
import type { MathSession } from "../lib/types";

interface HistoryPanelProps {
  sessions: MathSession[];
  onSelect: (id: string) => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ką tik";
  if (mins < 60) return `prieš ${mins} min.`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `prieš ${hrs} val.`;
  const days = Math.floor(hrs / 24);
  return `prieš ${days} d.`;
}

export function HistoryPanel({ sessions, onSelect }: HistoryPanelProps) {
  if (sessions.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2">
        <History size={16} className="text-slate-400" />
        <span className="text-sm font-semibold text-slate-600">Ankstesni generavimai</span>
      </div>
      <div className="divide-y divide-slate-50">
        {sessions.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left group"
          >
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
              {s.grade}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700 truncate font-medium">{s.prompt}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Clock size={11} className="text-slate-300" />
                <span className="text-xs text-slate-400">{timeAgo(s.created_at)}</span>
                <span className="text-xs text-slate-300">·</span>
                <span className="text-xs text-slate-400">{s.task_count} užduotys</span>
              </div>
            </div>
            <ChevronRight size={15} className="text-slate-300 group-hover:text-slate-400 flex-shrink-0 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
