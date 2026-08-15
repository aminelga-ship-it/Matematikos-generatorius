import { supabase } from "./supabase";

/** Temos su atskiru „Generuoti atsakymą“ (GPT solve, −1 generavimas). */
export const GENERATE_ANSWER_TOPIC_SLUGS = new Set(["10-racionaliosios-lygtys"]);

export function topicSlugUsesGenerateAnswer(slug: string): boolean {
  return GENERATE_ANSWER_TOPIC_SLUGS.has(slug.trim().toLowerCase());
}

export function selectionSlugsUseGenerateAnswer(slugs: string[]): boolean {
  return slugs.some((s) => topicSlugUsesGenerateAnswer(s));
}

/** Temų slug sąrašas iš pasirinktų temų / potemių ID. */
export async function resolveTopicSlugsFromSelection(
  topicIds: string[],
  subtopicIds: string[],
): Promise<string[]> {
  const slugs = new Set<string>();

  if (topicIds.length > 0) {
    const { data } = await supabase.from("curriculum_topics").select("slug").in("id", topicIds);
    for (const row of data ?? []) {
      if (row.slug) slugs.add(row.slug);
    }
  }

  if (subtopicIds.length > 0) {
    const { data: subs } = await supabase
      .from("curriculum_subtopics")
      .select("topic_id")
      .in("id", subtopicIds);

    const parentIds = [...new Set((subs ?? []).map((s) => s.topic_id).filter(Boolean))];
    if (parentIds.length > 0) {
      const { data: topics } = await supabase
        .from("curriculum_topics")
        .select("slug")
        .in("id", parentIds);
      for (const row of topics ?? []) {
        if (row.slug) slugs.add(row.slug);
      }
    }
  }

  return [...slugs];
}

export async function resolveDeferredSolveFromSelection(
  topicIds: string[],
  subtopicIds: string[],
): Promise<boolean> {
  const slugs = await resolveTopicSlugsFromSelection(topicIds, subtopicIds);
  return selectionSlugsUseGenerateAnswer(slugs);
}
