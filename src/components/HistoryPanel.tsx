import { useState, useCallback, useEffect } from "react";
import { History, Clock, ChevronRight, ChevronDown, ChevronUp, Printer, Loader2 } from "lucide-react";
import type { MathSession, Task, CuratedPrintItem } from "../lib/types";
import { curatedPrintItemId } from "../lib/types";
import { loadSession } from "../lib/api";
import { mathTextToPlainText } from "../lib/mathPlainText";

interface HistoryPanelProps {
  sessions: MathSession[];
  onSelect: (id: string) => void;
  onOpenPrintCollection: (items: CuratedPrintItem[]) => void;
  printSelection: CuratedPrintItem[];
  onPrintSelectionChange: (items: CuratedPrintItem[]) => void;
  expandedSessionIds: string[];
  onExpandedSessionIdsChange: (ids: string[]) => void;
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

function taskPreview(task: Task): string {
  const plain = mathTextToPlainText(task.question);
  return plain.length > 90 ? `${plain.slice(0, 90)}…` : plain;
}

export function HistoryPanel({
  sessions,
  onSelect,
  onOpenPrintCollection,
  printSelection,
  onPrintSelectionChange,
  expandedSessionIds,
  onExpandedSessionIdsChange,
}: HistoryPanelProps) {
  const expandedIds = new Set(expandedSessionIds);
  const selected = new Map(printSelection.map((item) => [item.id, item]));
  const [tasksCache, setTasksCache] = useState<Record<string, Task[]>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loadingAll, setLoadingAll] = useState(false);

  const loadTasksForSession = useCallback(async (sessionId: string) => {
    if (tasksCache[sessionId]) return;
    setLoadingId(sessionId);
    const full = await loadSession(sessionId);
    setLoadingId(null);
    if (full?.tasks) {
      setTasksCache((prev) => ({ ...prev, [sessionId]: full.tasks }));
    }
  }, [tasksCache]);

  useEffect(() => {
    const withSelection = [...new Set(printSelection.map((item) => item.sessionId))];
    const missing = withSelection.filter((id) => !expandedSessionIds.includes(id));
    if (missing.length === 0) return;
    onExpandedSessionIdsChange([...expandedSessionIds, ...missing]);
    for (const id of missing) {
      void loadTasksForSession(id);
    }
  }, [printSelection, expandedSessionIds, onExpandedSessionIdsChange, loadTasksForSession]);

  const selectionCountInSession = (sessionId: string) =>
    printSelection.filter((item) => item.sessionId === sessionId).length;

  const hasSelectionInSession = (sessionId: string) => selectionCountInSession(sessionId) > 0;

  const toggleExpand = async (session: MathSession) => {
    const id = session.id;
    if (expandedIds.has(id)) {
      if (hasSelectionInSession(id)) return;
      onExpandedSessionIdsChange(expandedSessionIds.filter((sid) => sid !== id));
      return;
    }
    onExpandedSessionIdsChange([...expandedSessionIds, id]);
    await loadTasksForSession(id);
  };

  const toggleTaskSelection = (session: MathSession, taskIndex: number, task: Task) => {
    const id = curatedPrintItemId(session.id, taskIndex);
    const next = selected.has(id)
      ? printSelection.filter((item) => item.id !== id)
      : [
          ...printSelection,
          {
            id,
            sessionId: session.id,
            sessionGrade: session.grade,
            sessionPrompt: session.prompt,
            taskIndex,
            task,
            enabled: true,
          },
        ];
    onPrintSelectionChange(next);
    if (!expandedIds.has(session.id)) {
      onExpandedSessionIdsChange([...expandedSessionIds, session.id]);
    }
    void loadTasksForSession(session.id);
  };

  const openPrintCollection = () => {
    onOpenPrintCollection(printSelection);
  };

  const selectAllTasks = async () => {
    setLoadingAll(true);
    const allItems: CuratedPrintItem[] = [];
    const nextExpanded = new Set(expandedSessionIds);
    const nextCache = { ...tasksCache };

    for (const session of sessions) {
      let tasks = nextCache[session.id];
      if (!tasks) {
        const full = await loadSession(session.id);
        tasks = full?.tasks ?? [];
        if (tasks.length > 0) nextCache[session.id] = tasks;
      }
      nextExpanded.add(session.id);
      tasks.forEach((task, i) => {
        allItems.push({
          id: curatedPrintItemId(session.id, i),
          sessionId: session.id,
          sessionGrade: session.grade,
          sessionPrompt: session.prompt,
          taskIndex: i,
          task,
          enabled: true,
        });
      });
    }

    setTasksCache(nextCache);
    onPrintSelectionChange(allItems);
    onExpandedSessionIdsChange([...nextExpanded]);
    setLoadingAll(false);
  };

  const deselectAllTasks = () => {
    onPrintSelectionChange([]);
    onExpandedSessionIdsChange([]);
  };

  if (sessions.length === 0) return null;

  const selectionCount = printSelection.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <History size={16} className="text-slate-400 flex-shrink-0" />
          <span className="text-sm font-semibold text-slate-600">Ankstesni generavimai</span>
        </div>
        {selectionCount > 0 && (
          <button
            type="button"
            onClick={openPrintCollection}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition flex-shrink-0"
          >
            <Printer size={13} />
            Spausdinimo sąrašas ({selectionCount})
          </button>
        )}
      </div>

      <div className="px-5 py-2 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-xs text-slate-400">
          Išskleiskite sesiją ir pažymėkite užduotis spausdinimui. Saugomos redaguotos versijos.
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => void selectAllTasks()}
            disabled={loadingAll}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            {loadingAll ? "Kraunama…" : "Pažymėti visus"}
          </button>
          <span className="text-slate-300 text-xs">·</span>
          <button
            type="button"
            onClick={deselectAllTasks}
            disabled={loadingAll || selectionCount === 0}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 disabled:opacity-50"
          >
            Nežymėti nieko
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-50">
        {sessions.map((s) => {
          const expanded = expandedIds.has(s.id);
          const tasks = tasksCache[s.id];
          const loading = loadingId === s.id;
          const sessionSelectedCount = selectionCountInSession(s.id);
          const pinnedOpen = hasSelectionInSession(s.id);

          return (
            <div key={s.id}>
              <div className="flex items-center gap-2 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <button
                  type="button"
                  onClick={() => void toggleExpand(s)}
                  disabled={pinnedOpen && expanded}
                  className={`p-1 rounded-lg flex-shrink-0 ${
                    pinnedOpen && expanded
                      ? "text-blue-400 cursor-default"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  }`}
                  aria-expanded={expanded}
                  title={
                    pinnedOpen && expanded
                      ? "Pasirinktos užduotys — sąrašas atidarytas"
                      : "Rodyti užduotis"
                  }
                >
                  {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {s.grade}
                </span>

                <button
                  type="button"
                  onClick={() => onSelect(s.id)}
                  className="flex-1 min-w-0 text-left"
                >
                  <p className="text-sm text-slate-700 truncate font-medium">{s.prompt}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock size={11} className="text-slate-300" />
                    <span className="text-xs text-slate-400">{timeAgo(s.created_at)}</span>
                    <span className="text-xs text-slate-300">·</span>
                    <span className="text-xs text-slate-400">{s.task_count} užduotys</span>
                    {sessionSelectedCount > 0 && (
                      <>
                        <span className="text-xs text-slate-300">·</span>
                        <span className="text-xs font-semibold text-blue-600">
                          {sessionSelectedCount} pasirinkta
                        </span>
                      </>
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onSelect(s.id)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-100 flex-shrink-0"
                  title="Atidaryti visą sesiją"
                >
                  <ChevronRight size={15} />
                </button>
              </div>

              {expanded && (
                <div className="px-5 pb-3 bg-slate-50/80 border-t border-slate-100">
                  {loading && (
                    <div className="flex items-center gap-2 py-3 text-xs text-slate-400">
                      <Loader2 size={14} className="animate-spin" />
                      Kraunamos užduotys…
                    </div>
                  )}
                  {!loading && tasks && tasks.length > 0 && (
                    <ul className="space-y-1 pt-2">
                      {tasks.map((task, i) => {
                        const id = curatedPrintItemId(s.id, i);
                        const checked = selected.has(id);
                        return (
                          <li key={id}>
                            <label
                              className={`flex items-start gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${
                                checked ? "bg-blue-50 border border-blue-100" : "hover:bg-white border border-transparent"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleTaskSelection(s, i, task)}
                                className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-300"
                              />
                              <span className="text-xs text-slate-600 leading-relaxed min-w-0">
                                <span className="font-semibold text-slate-500 mr-1">{i + 1}.</span>
                                {taskPreview(task)}
                              </span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {!loading && tasks && tasks.length === 0 && (
                    <p className="text-xs text-slate-400 py-2">Užduočių nerasta.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
