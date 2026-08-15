import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { buildSubtopicPromptBlock } from "./subtopicPrompts.ts";

export type TopicPromptResult = {
  prompt: string;
  /** Potemės aprašas — system prompt be visos klasės programos */
  subtopicGuided: boolean;
  /** AI negeneruoja answer (pvz. trupmeniniai reiškiniai) */
  omitAnswers: boolean;
  /** Atsakymas gaunamas atskira „Rodyti atsakymą“ užklausa */
  deferredAnswers: boolean;
};

/** User prompt AI generacijai pagal pasirinktą curriculum (režimas „pagal temą“). */
export async function buildSavarankiskasTopicPrompt(
  supabaseAdmin: SupabaseClient,
  topicIds: string[],
  subtopicIds: string[],
  grade: number,
  difficulty: string,
  taskCount: number,
): Promise<TopicPromptResult> {
  const topicIdSet = new Set<string>(topicIds);
  const selectedSubRows: { id: string; title: string; topic_id: string; slug: string }[] = [];

  if (subtopicIds.length) {
    const { data: selectedSubs } = await supabaseAdmin
      .from("curriculum_subtopics")
      .select("id, title, topic_id, slug")
      .in("id", subtopicIds);

    for (const row of selectedSubs ?? []) {
      const sub = row as { id: string; title: string; topic_id: string; slug: string };
      topicIdSet.add(sub.topic_id);
      selectedSubRows.push(sub);
    }
  }

  const scopedTopicIds = [...topicIdSet];

  if (scopedTopicIds.length === 0) {
    return {
      prompt: [
        `Generuok ${taskCount} užduotis.`,
        `Klasė: ${grade}`,
        "Vartotojas nepasirinko konkrečios temos — laikykis bendros klasės programos.",
      ].join("\n\n"),
      subtopicGuided: false,
      omitAnswers: false,
      deferredAnswers: false,
    };
  }

  const { data: topics } = await supabaseAdmin
    .from("curriculum_topics")
    .select("id, title, slug")
    .in("id", scopedTopicIds);

  const topicTitleById = new Map<string, string>();
  const topicSlugById = new Map<string, string>();
  for (const row of topics ?? []) {
    const t = row as { id: string; title: string; slug: string };
    topicTitleById.set(t.id, t.title);
    topicSlugById.set(t.id, t.slug);
  }

  const { data: allSubsForTopics } = await supabaseAdmin
    .from("curriculum_subtopics")
    .select("id, title, topic_id, slug, sort_order")
    .in("topic_id", scopedTopicIds)
    .order("sort_order", { ascending: true });

  const subsByTopic = new Map<string, { id: string; title: string; slug: string }[]>();
  for (const row of allSubsForTopics ?? []) {
    const sub = row as { id: string; title: string; topic_id: string; slug: string };
    const list = subsByTopic.get(sub.topic_id) ?? [];
    list.push({ id: sub.id, title: sub.title, slug: sub.slug });
    subsByTopic.set(sub.topic_id, list);
  }

  const selectedSubIdSet = new Set(subtopicIds);
  const focusParts: string[] = [];
  const selectedSubtopicRefs = selectedSubRows.map((s) => ({
    slug: s.slug,
    topicSlug: topicSlugById.get(s.topic_id) ?? "",
  }));

  for (const topicId of scopedTopicIds) {
    const topicTitle = topicTitleById.get(topicId) ?? "Tema";
    const topicSubs = subsByTopic.get(topicId) ?? [];

    if (topicSubs.length === 0 && topicIds.includes(topicId)) {
      focusParts.push(topicTitle);
      continue;
    }

    const selectedInTopic = topicSubs.filter((s) => selectedSubIdSet.has(s.id));
    if (selectedInTopic.length > 0) {
      for (const s of selectedInTopic) {
        focusParts.push(`${topicTitle} → ${s.title}`);
      }
    } else if (topicIds.includes(topicId)) {
      focusParts.push(topicTitle);
    }
  }

  const focusUnique = [...new Set(focusParts.filter(Boolean))];
  const focusLine =
    focusUnique.length > 0
      ? focusUnique.join("; ")
      : scopedTopicIds.map((id) => topicTitleById.get(id) ?? "Tema").join("; ");

  const intro =
    difficulty === "savarankiskas" || difficulty === "ivairus"
      ? `Įvairaus sudėtingumo — generuok ${taskCount} užduotis.`
      : `Generuok ${taskCount} užduotis.`;

  const topicSlugsForPrompts = new Set<string>();
  for (const topicId of scopedTopicIds) {
    const topicSlug = topicSlugById.get(topicId);
    if (!topicSlug) continue;
    const topicSubs = subsByTopic.get(topicId) ?? [];
    const topicOnly = topicIds.includes(topicId) &&
      !topicSubs.some((s) => selectedSubIdSet.has(s.id));
    const hasSelectedSub = topicSubs.some((s) => selectedSubIdSet.has(s.id));
    if (topicOnly || hasSelectedSub) {
      topicSlugsForPrompts.add(topicSlug);
    }
  }

  const { text: subtopicBlock, guided, omitAnswers, deferredAnswers } = buildSubtopicPromptBlock(
    grade,
    selectedSubtopicRefs,
    difficulty,
    [...topicSlugsForPrompts],
  );

  if (guided) {
    return {
      prompt: [
        intro,
        `Klasė: ${grade}`,
        subtopicBlock,
        `Fokusas (tik šios potemės): ${focusLine}. Įvairink uždavinius, vengk kopijų.`,
      ].join("\n\n"),
      subtopicGuided: true,
      omitAnswers,
      deferredAnswers,
    };
  }

  return {
    prompt: [
      intro,
      `Klasė: ${grade}`,
      `Fokusas — generuok tik iš: ${focusLine}. Įvairink uždavinius, vengk kopijų.`,
    ].join("\n\n"),
    subtopicGuided: false,
    omitAnswers,
    deferredAnswers,
  };
}
