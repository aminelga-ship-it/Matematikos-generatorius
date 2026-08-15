import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { fetchCurriculumSubtopics, fetchCurriculumTopics } from "../lib/bankApi";
import type { CurriculumSubtopic, CurriculumTopic } from "../lib/types";

interface SavarankiskasTopicPickerProps {
  grade: number;
  selectedSubtopicIds: string[];
  selectedTopicIds: string[];
  onSubtopicIdsChange: (ids: string[]) => void;
  onTopicIdsChange: (ids: string[]) => void;
  onTopicSlugsChange?: (slugs: string[]) => void;
}

export function SavarankiskasTopicPicker({
  grade,
  selectedSubtopicIds,
  selectedTopicIds,
  onSubtopicIdsChange,
  onTopicIdsChange,
  onTopicSlugsChange,
}: SavarankiskasTopicPickerProps) {
  const [topics, setTopics] = useState<CurriculumTopic[]>([]);
  const [subtopics, setSubtopics] = useState<CurriculumSubtopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    setExpandedTopicId(null);

    void (async () => {
      const t = await fetchCurriculumTopics(grade);
      if (cancelled) return;
      setTopics(t);
      if (t.length === 0) {
        setSubtopics([]);
        setLoading(false);
        setLoadError(`Klasės ${grade} temų sąrašas dar tuščias — papildykite curriculum duomenų bazėje.`);
        return;
      }
      const st = await fetchCurriculumSubtopics(t.map((x) => x.id));
      if (cancelled) return;
      setSubtopics(st);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [grade]);

  const subtopicsByTopic = useMemo(() => {
    const map = new Map<string, CurriculumSubtopic[]>();
    for (const st of subtopics) {
      const list = map.get(st.topic_id) ?? [];
      list.push(st);
      map.set(st.topic_id, list);
    }
    return map;
  }, [subtopics]);

  useEffect(() => {
    if (!onTopicSlugsChange) return;
    const slugSet = new Set<string>();
    for (const id of selectedTopicIds) {
      const topic = topics.find((t) => t.id === id);
      if (topic?.slug) slugSet.add(topic.slug);
    }
    for (const stId of selectedSubtopicIds) {
      const st = subtopics.find((s) => s.id === stId);
      if (!st) continue;
      const topic = topics.find((t) => t.id === st.topic_id);
      if (topic?.slug) slugSet.add(topic.slug);
    }
    onTopicSlugsChange([...slugSet]);
  }, [selectedTopicIds, selectedSubtopicIds, topics, subtopics, onTopicSlugsChange]);

  const toggleSubtopic = (id: string) => {
    if (selectedSubtopicIds.includes(id)) {
      onSubtopicIdsChange(selectedSubtopicIds.filter((x) => x !== id));
    } else {
      onSubtopicIdsChange([...selectedSubtopicIds, id]);
    }
  };

  const toggleTopicOnly = (topicId: string) => {
    if (selectedTopicIds.includes(topicId)) {
      onTopicIdsChange(selectedTopicIds.filter((x) => x !== topicId));
    } else {
      onTopicIdsChange([...selectedTopicIds, topicId]);
    }
  };

  const selectAllForTopic = (topicId: string) => {
    const ids = (subtopicsByTopic.get(topicId) ?? []).map((s) => s.id);
    const allSelected = ids.every((id) => selectedSubtopicIds.includes(id));
    if (allSelected) {
      onSubtopicIdsChange(selectedSubtopicIds.filter((id) => !ids.includes(id)));
    } else {
      const merged = new Set([...selectedSubtopicIds, ...ids]);
      onSubtopicIdsChange([...merged]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500 py-6 justify-center">
        <Loader2 size={18} className="animate-spin" />
        Kraunamos temos…
      </div>
    );
  }

  if (loadError) {
    return <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">{loadError}</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">
        Pasirinkite temą: jei yra potemės — pažymėkite jas; jei potemių nėra — pažymėkite pačią temą.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {topics.map((topic) => {
          const topicSubs = subtopicsByTopic.get(topic.id) ?? [];
          const hasSubs = topicSubs.length > 0;
          const expanded = expandedTopicId === topic.id;
          const topicOnlySelected = selectedTopicIds.includes(topic.id);
          const selectedCount = topicSubs.filter((s) => selectedSubtopicIds.includes(s.id)).length;

          if (!hasSubs) {
            return (
              <label
                key={topic.id}
                className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 cursor-pointer transition-all ${
                  topicOnlySelected
                    ? "border-violet-400 bg-violet-50"
                    : "border-slate-100 bg-slate-50 hover:border-violet-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={topicOnlySelected}
                  onChange={() => toggleTopicOnly(topic.id)}
                  className="rounded border-slate-300 text-violet-600 focus:ring-violet-300"
                />
                <span className="text-sm font-semibold text-slate-800">{topic.title}</span>
                <span className="text-[10px] text-slate-400 ml-auto">visa tema</span>
              </label>
            );
          }

          return (
            <div
              key={topic.id}
              className={`rounded-xl border-2 transition-all ${
                expanded ? "border-violet-300 bg-violet-50/40" : "border-slate-100 bg-slate-50"
              }`}
            >
              <button
                type="button"
                onClick={() => setExpandedTopicId(expanded ? null : topic.id)}
                className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left"
              >
                <div>
                  <span className="text-sm font-semibold text-slate-800">{topic.title}</span>
                  {selectedCount > 0 && (
                    <span className="ml-2 text-[11px] font-medium text-violet-600">
                      {selectedCount}/{topicSubs.length} potemės
                    </span>
                  )}
                </div>
                {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
              </button>

              {expanded && (
                <div className="px-3 pb-3 space-y-2 border-t border-violet-100">
                  <button
                    type="button"
                    onClick={() => selectAllForTopic(topic.id)}
                    className="mt-2 text-[11px] font-semibold text-violet-600 hover:text-violet-800"
                  >
                    {topicSubs.every((s) => selectedSubtopicIds.includes(s.id))
                      ? "Nuimti visas potemes"
                      : "Pasirinkti visas potemes"}
                  </button>
                  <div className="flex flex-col gap-1.5">
                    {topicSubs.map((st) => {
                      const checked = selectedSubtopicIds.includes(st.id);
                      return (
                        <label
                          key={st.id}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm ${
                            checked ? "bg-violet-100 text-violet-900" : "bg-white border border-slate-100 text-slate-700"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleSubtopic(st.id)}
                            className="rounded border-slate-300 text-violet-600 focus:ring-violet-300"
                          />
                          {st.title}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
