import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Copy, Loader2, Shield, Trash2, X } from "lucide-react";
import {
  clearBankItemsByStatus,
  fetchAdminBankItems,
  fetchBankStatusCounts,
  fetchCurriculumSubtopics,
  fetchCurriculumTopics,
  cloneBankItem,
  saveAndReviewBankItem,
  saveBankItemContent,
} from "../lib/bankApi";
import type {
  BankDifficulty,
  CurriculumSubtopic,
  CurriculumTopic,
  TaskBankItem,
  TaskBankItemWithMeta,
  TaskBankStatus,
} from "../lib/types";
import {
  TASK_BANK_STATUS_LABELS,
  TASK_FEEDBACK_LABELS,
} from "../lib/types";
import { MathText } from "./MathText";

interface AdminBankPageProps {
  onBack: () => void;
}

const STATUS_FILTERS: { value: TaskBankStatus; label: string }[] = [
  { value: "draft", label: "Redaguotinos" },
  { value: "approved", label: "Patvirtintos" },
  { value: "rejected", label: "Atmestos" },
];

const ADMIN_LIST_LIMIT: Record<TaskBankStatus, number | null> = {
  draft: null,
  approved: 10,
  rejected: 5,
};

const GRADE_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

function formatFeedbackDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("lt-LT", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function sortedFeedback(item: TaskBankItemWithMeta): TaskBankItemWithMeta["feedback"] {
  return [...(item.feedback ?? [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

function feedbackLabel(type: string): string {
  return (TASK_FEEDBACK_LABELS as Record<string, string>)[type] ?? type;
}

function AdminFeedbackBlock({
  feedback,
  compact = false,
}: {
  feedback: TaskBankItemWithMeta["feedback"];
  compact?: boolean;
}) {
  const list = [...(feedback ?? [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  if (list.length === 0) {
    return compact ? null : (
      <p className="text-xs text-slate-500 italic">Mokytojo įvertinimų nėra.</p>
    );
  }
  if (compact) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {list.map((fb) => (
          <span
            key={fb.id}
            className="inline-flex items-center max-w-full text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200"
            title={fb.comment ?? undefined}
          >
            {feedbackLabel(fb.feedback_type)}
          </span>
        ))}
      </div>
    );
  }
  return (
    <ul className="space-y-2">
      {list.map((fb) => (
        <li
          key={fb.id}
          className="text-xs text-slate-700 bg-white rounded-lg border border-indigo-200 px-3 py-2"
        >
          <span className="font-semibold text-indigo-900">{feedbackLabel(fb.feedback_type)}</span>
          <span className="text-slate-400 ml-2">{formatFeedbackDate(fb.created_at)}</span>
          {fb.comment && (
            <p className="mt-1 text-slate-600 whitespace-pre-wrap">{fb.comment}</p>
          )}
        </li>
      ))}
    </ul>
  );
}

type CurriculumCache = {
  topics: CurriculumTopic[];
  subtopics: CurriculumSubtopic[];
};

function resolveTopicLine(
  d: TaskBankItem,
  meta: TaskBankItemWithMeta,
  cache: CurriculumCache | undefined,
): string | null {
  let topicTitle: string | null = meta.topic_title ?? null;
  let subtopicTitle: string | null = meta.subtopic_title ?? null;

  if (cache) {
    const topicId =
      d.topic_id ??
      (d.subtopic_id ? cache.subtopics.find((s) => s.id === d.subtopic_id)?.topic_id : null);
    if (topicId) {
      topicTitle = cache.topics.find((t) => t.id === topicId)?.title ?? topicTitle;
    }
    if (d.topic_id && !subtopicTitle) {
      topicTitle = cache.topics.find((t) => t.id === d.topic_id)?.title ?? topicTitle;
    }
    if (d.subtopic_id) {
      subtopicTitle = cache.subtopics.find((s) => s.id === d.subtopic_id)?.title ?? subtopicTitle;
    }
  }

  if (!topicTitle && !subtopicTitle) return null;
  return [topicTitle, subtopicTitle].filter(Boolean).join(" → ");
}

function effectiveTopicId(d: TaskBankItem, cache: CurriculumCache | undefined): string {
  if (d.topic_id) return d.topic_id;
  if (d.subtopic_id && cache) {
    return cache.subtopics.find((s) => s.id === d.subtopic_id)?.topic_id ?? "";
  }
  return "";
}

export function AdminBankPage({ onBack }: AdminBankPageProps) {
  const [statusFilter, setStatusFilter] = useState<TaskBankStatus>("draft");
  const [items, setItems] = useState<TaskBankItemWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Partial<TaskBankItem>>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [curriculumByGrade, setCurriculumByGrade] = useState<Record<number, CurriculumCache>>({});
  const [curriculumLoadingGrade, setCurriculumLoadingGrade] = useState<number | null>(null);
  const [statusCounts, setStatusCounts] = useState<Record<TaskBankStatus, number> | null>(null);
  const [clearing, setClearing] = useState(false);
  const curriculumByGradeRef = useRef(curriculumByGrade);
  curriculumByGradeRef.current = curriculumByGrade;

  const ensureCurriculum = useCallback(async (grade: number) => {
    if (curriculumByGradeRef.current[grade]) return;
    setCurriculumLoadingGrade(grade);
    try {
      const topics = await fetchCurriculumTopics(grade);
      const subtopics = topics.length
        ? await fetchCurriculumSubtopics(topics.map((t) => t.id))
        : [];
      setCurriculumByGrade((prev) => {
        if (prev[grade]) return prev;
        return { ...prev, [grade]: { topics, subtopics } };
      });
    } catch (e) {
      console.error("Curriculum load:", e);
    } finally {
      setCurriculumLoadingGrade((g) => (g === grade ? null : g));
    }
  }, []);

  const load = useCallback(async (statusOverride?: TaskBankStatus) => {
    const status = statusOverride ?? statusFilter;
    setLoading(true);
    setError(null);
    try {
      const limit = ADMIN_LIST_LIMIT[status];
      const data = await fetchAdminBankItems({
        status,
        limit: limit ?? 5000,
      });
      setItems(data);
      const counts = await fetchBankStatusCounts();
      setStatusCounts(counts);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nepavyko įkelti.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const getDraft = (item: TaskBankItem): TaskBankItem => ({
    ...item,
    ...drafts[item.id],
  });

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const grades = [...new Set(items.map((i) => getDraft(i).grade))];
    for (const g of grades) {
      void ensureCurriculum(g);
    }
  }, [items, ensureCurriculum, drafts]);

  useEffect(() => {
    if (expandedId) {
      const item = items.find((i) => i.id === expandedId);
      if (item) void ensureCurriculum(getDraft(item).grade);
    }
  }, [expandedId, items, ensureCurriculum, drafts]);

  const patchDraft = (id: string, patch: Partial<TaskBankItem>) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  };

  const contentFromDraft = (item: TaskBankItemWithMeta) => {
    const d = getDraft(item);
    const grade = d.grade;
    const cache = curriculumByGrade[grade];
    let topic_id = d.topic_id ?? null;
    const subtopic_id = d.subtopic_id ?? null;
    if (subtopic_id && cache && !topic_id) {
      topic_id = cache.subtopics.find((s) => s.id === subtopic_id)?.topic_id ?? null;
    }
    return {
      grade,
      question: d.question ?? "",
      answer: d.answer ?? "",
      solution: d.solution ?? "",
      difficulty: d.difficulty as BankDifficulty,
      topic_id,
      subtopic_id,
    };
  };

  const saveDraftItem = async (item: TaskBankItemWithMeta) => {
    setBusyId(item.id);
    setError(null);
    setSuccess(null);
    try {
      const content = contentFromDraft(item);
      await saveBankItemContent(item.id, content);
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
      await load(statusFilter);
      setSuccess("Pakeitimai išsaugoti banke (statusas nepakeistas).");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nepavyko išsaugoti.");
    } finally {
      setBusyId(null);
    }
  };

  const approveItem = async (item: TaskBankItemWithMeta) => {
    setBusyId(item.id);
    setError(null);
    setSuccess(null);
    try {
      await saveAndReviewBankItem(item.id, contentFromDraft(item), "approved");
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
      setExpandedId(null);
      await load(statusFilter);
      setSuccess("Užduotis patvirtinta. Ją rasite filtre „Patvirtintos“.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nepavyko patvirtinti.");
    } finally {
      setBusyId(null);
    }
  };

  const rejectItem = async (item: TaskBankItemWithMeta) => {
    setBusyId(item.id);
    setError(null);
    setSuccess(null);
    try {
      await saveAndReviewBankItem(item.id, contentFromDraft(item), "rejected");
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
      setExpandedId(null);
      await load(statusFilter);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nepavyko atmesti.");
    } finally {
      setBusyId(null);
    }
  };

  const clearCurrentStatus = async () => {
    const label = STATUS_FILTERS.find((f) => f.value === statusFilter)?.label ?? statusFilter;
    const count = statusCounts?.[statusFilter] ?? items.length;
    if (count === 0) return;
    const ok = window.confirm(
      `Ištrinti visas ${count} „${label}" užduotis iš banko? Veiksmas negrįžtamas.`,
    );
    if (!ok) return;

    setClearing(true);
    setError(null);
    setSuccess(null);
    try {
      const deleted = await clearBankItemsByStatus(statusFilter);
      setExpandedId(null);
      setDrafts({});
      await load(statusFilter);
      setSuccess(`Ištrinta ${deleted} užduotis (-ių) („${label}").`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nepavyko išvalyti.");
    } finally {
      setClearing(false);
    }
  };

  const cloneItem = async (item: TaskBankItemWithMeta) => {
    setBusyId(item.id);
    setError(null);
    setSuccess(null);
    try {
      const snapshot = contentFromDraft(item);
      const newId = await cloneBankItem({
        ...item,
        ...getDraft(item),
        grade: snapshot.grade,
        question: snapshot.question,
        answer: snapshot.answer,
        solution: snapshot.solution,
        difficulty: snapshot.difficulty,
        topic_id: snapshot.topic_id,
        subtopic_id: snapshot.subtopic_id,
      });
      setStatusFilter("draft");
      const data = await fetchAdminBankItems({ status: "draft" });
      setItems(data);
      setExpandedId(newId);
      setSuccess("Klonas sukurtas kaip atskiras juodraštis — pradinė užduotis nekeičiama.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nepavyko klonuoti.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Generatorius
          </button>
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-800">Užduočių bankas (admin)</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => {
                setStatusFilter(f.value);
                void load(f.value);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                statusFilter === f.value
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {f.label}
              {statusCounts ? ` (${statusCounts[f.value]})` : ""}
            </button>
          ))}
          <button
            type="button"
            disabled={clearing || loading || (statusCounts?.[statusFilter] ?? items.length) === 0}
            onClick={() => void clearCurrentStatus()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-40 disabled:pointer-events-none transition"
          >
            {clearing ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Clear
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-500 -mt-2">
        Redaguokite vieną užduotį ir spauskite „Patvirtinti“. „Klonuoti“ sukuria visiškai atskirą kopiją (juodraštį) — pradinė lieka nepaliesta.
        Mokytojo „Tinkama užduotis“ patvirtina automatiškai.
        {statusFilter === "approved" && (
          <> Rodomos 10 naujausios patvirtintos; senesnės lieka banke.</>
        )}
        {statusFilter === "rejected" && (
          <> Rodomos 5 naujausios atmestos; senesnės lieka banke.</>
        )}
        {statusFilter === "draft" && <> Rodomos visos redaguotinos.</>}
      </p>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>
      )}

      {success && (
        <div className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16 text-slate-500">
          <Loader2 className="animate-spin" size={28} />
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-slate-500 py-12">
          Užduočių pagal filtrą „{STATUS_FILTERS.find((f) => f.value === statusFilter)?.label}“ nėra.
          {statusCounts && statusFilter === "draft" && statusCounts.approved > 0
            ? ` Yra ${statusCounts.approved} patvirtintų — perjunkite „Patvirtintos“.`
            : ""}
          {statusCounts && statusFilter !== "draft"
            ? ` Banke (šis statusas): ${statusCounts[statusFilter] ?? 0}.`
            : statusCounts
              ? ` Banke redaguotinų: ${statusCounts.draft}.`
              : ""}
          {statusCounts &&
          statusCounts.draft + statusCounts.approved + statusCounts.rejected === 0
            ? " Jei tikėjote matyti Aibių užduotis — paleiskite migracijas: npm run db:push"
            : ""}
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const d = getDraft(item);
            const expanded = expandedId === item.id;
            const busy = busyId === item.id;
            const hasSolution = (d.solution ?? "").trim().length > 0;
            const cache = curriculumByGrade[d.grade];
            const topicLine = resolveTopicLine(d, item, cache);
            const selectedTopicId = effectiveTopicId(d, cache);
            const subtopicsForTopic = cache?.subtopics.filter((s) => s.topic_id === selectedTopicId) ?? [];
            const feedbackList = sortedFeedback(item);

            return (
              <li
                key={item.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : item.id)}
                  className="w-full text-left px-5 py-4 hover:bg-slate-50/80 space-y-2"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      {d.grade} kl. · {item.difficulty}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {TASK_BANK_STATUS_LABELS[item.status]}
                    </span>
                    <span className="text-xs text-slate-400">Naudota: {item.usage_count}×</span>
                    {topicLine && (
                      <span className="text-xs font-medium text-violet-700 bg-violet-50 px-2 py-0.5 rounded">
                        {topicLine}
                      </span>
                    )}
                    {feedbackList.length > 0 && (
                      <span className="w-full sm:w-auto flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase shrink-0">
                          Įvertinimas:
                        </span>
                        <AdminFeedbackBlock feedback={item.feedback} compact />
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 pr-2">
                    <p className="text-sm text-slate-800 leading-snug">
                      <span className="text-[10px] font-bold text-slate-400 uppercase mr-2">Užduotis</span>
                      <MathText text={d.question} />
                    </p>
                    <p className="text-sm text-emerald-800 leading-snug">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase mr-2">Atsakymas</span>
                      <MathText text={d.answer || "—"} />
                    </p>
                    {hasSolution && (
                      <p className="text-sm text-blue-900 leading-snug line-clamp-2">
                        <span className="text-[10px] font-bold text-blue-500 uppercase mr-2">Sprendimas</span>
                        <MathText text={d.solution} />
                      </p>
                    )}
                  </div>
                </button>

                {expanded && (
                  <div className="px-5 pb-5 space-y-3 border-t border-slate-100 pt-4">
                    <div className="rounded-xl border border-violet-100 bg-violet-50/40 px-3 py-3 space-y-3">
                      <p className="text-[10px] font-bold text-violet-700 uppercase tracking-wide">
                        Klasė, tema ir potemė
                      </p>
                      <div className="rounded-lg border border-indigo-200 bg-indigo-50/80 px-3 py-2.5 space-y-2">
                        <p className="text-[10px] font-bold text-indigo-800 uppercase tracking-wide">
                          Mokytojo įvertinimas
                        </p>
                        <AdminFeedbackBlock feedback={item.feedback} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Klasė</label>
                        <select
                          value={d.grade}
                          onChange={(e) => {
                            const grade = Number(e.target.value);
                            patchDraft(item.id, {
                              grade,
                              topic_id: null,
                              subtopic_id: null,
                            });
                            void ensureCurriculum(grade);
                          }}
                          className="w-full max-w-[8rem] text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white"
                        >
                          {GRADE_OPTIONS.map((g) => (
                            <option key={g} value={g}>
                              {g} klasė
                            </option>
                          ))}
                        </select>
                      </div>
                      {curriculumLoadingGrade === d.grade && !cache && (
                        <p className="text-xs text-slate-500 flex items-center gap-2">
                          <Loader2 size={14} className="animate-spin" />
                          Kraunama curriculum…
                        </p>
                      )}
                      {cache && cache.topics.length === 0 && (
                        <p className="text-xs text-amber-700">
                          Šiai klasei curriculum tuščias — pridėkite temas Supabase lentelėje{" "}
                          <code className="text-[10px]">curriculum_topics</code>.
                        </p>
                      )}
                      {cache && cache.topics.length > 0 && (
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tema</label>
                            <select
                              value={selectedTopicId}
                              onChange={(e) => {
                                const topicId = e.target.value || null;
                                patchDraft(item.id, {
                                  topic_id: topicId,
                                  subtopic_id: null,
                                });
                              }}
                              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white"
                            >
                              <option value="">— Nepasirinkta —</option>
                              {cache.topics.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.title}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Potemė</label>
                            <select
                              value={d.subtopic_id ?? ""}
                              disabled={!selectedTopicId}
                              onChange={(e) => {
                                const subId = e.target.value || null;
                                const st = subId
                                  ? cache.subtopics.find((s) => s.id === subId)
                                  : null;
                                patchDraft(item.id, {
                                  subtopic_id: subId,
                                  topic_id: st?.topic_id ?? selectedTopicId ?? null,
                                });
                              }}
                              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white disabled:opacity-50"
                            >
                              <option value="">— Nepasirinkta —</option>
                              {subtopicsForTopic.map((st) => (
                                <option key={st.id} value={st.id}>
                                  {st.title}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                      {topicLine ? (
                        <p className="text-xs text-violet-900">
                          Dabar: <span className="font-medium">{topicLine}</span>
                        </p>
                      ) : (
                        <p className="text-xs text-slate-500 italic">Potemė nepriskirta — reikalinga savarankiškam darbui iš banko.</p>
                      )}
                    </div>

                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Klausimas</label>
                    <textarea
                      value={d.question ?? ""}
                      onChange={(e) => patchDraft(item.id, { question: e.target.value })}
                      rows={4}
                      className="w-full text-sm font-mono border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-200 outline-none"
                    />
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Atsakymas</label>
                        <input
                          value={d.answer ?? ""}
                          onChange={(e) => patchDraft(item.id, { answer: e.target.value })}
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sunkumas</label>
                        <select
                          value={d.difficulty}
                          onChange={(e) =>
                            patchDraft(item.id, { difficulty: e.target.value as BankDifficulty })
                          }
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                        >
                          <option value="lengvos">Lengvos</option>
                          <option value="vidutinės">Vidutinės</option>
                          <option value="sunkios">Sunkios</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sprendimas</label>
                      <textarea
                        value={d.solution ?? ""}
                        onChange={(e) => patchDraft(item.id, { solution: e.target.value })}
                        rows={4}
                        className="w-full text-sm font-mono border border-slate-200 rounded-xl px-3 py-2"
                      />
                    </div>
                    {item.generation_prompt && (
                      <p className="text-xs text-slate-400">
                        Prompt: {item.generation_prompt.slice(0, 200)}
                        {item.generation_prompt.length > 200 ? "…" : ""}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void saveDraftItem(item)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {busy ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        Išsaugoti
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void approveItem(item)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {busy ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        {item.status === "approved" ? "Patvirtinti pataisymus" : "Patvirtinti"}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void cloneItem(item)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200 disabled:opacity-50"
                      >
                        {busy ? <Loader2 size={14} className="animate-spin" /> : <Copy size={14} />}
                        Klonuoti
                      </button>
                      {item.status !== "rejected" && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void rejectItem(item)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 disabled:opacity-50"
                        >
                          <X size={14} />
                          Atmesti
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
