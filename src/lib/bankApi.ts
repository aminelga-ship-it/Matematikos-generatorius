import { supabase } from "./supabase";
import type {
  BankDifficulty,
  CurriculumSubtopic,
  CurriculumTopic,
  TaskBankItem,
  TaskBankItemWithMeta,
  TaskBankStatus,
  TaskFeedbackType,
  UserRole,
  DiagramConfig,
} from "./types";
import { curriculumSlotForTask } from "./types";

export async function fetchCurriculumTopics(grade: number): Promise<CurriculumTopic[]> {
  const { data, error } = await supabase
    .from("curriculum_topics")
    .select("id, grade, slug, title, sort_order")
    .eq("grade", grade)
    .order("sort_order");

  if (error) {
    console.error("curriculum_topics:", error);
    return [];
  }
  return (data ?? []) as CurriculumTopic[];
}

export async function resolveTopicIdForSubtopic(subtopicId: string): Promise<string | null> {
  const { data } = await supabase
    .from("curriculum_subtopics")
    .select("topic_id")
    .eq("id", subtopicId)
    .maybeSingle();
  return (data?.topic_id as string | undefined) ?? null;
}

export async function resolveCurriculumIdsForTask(
  taskIndex: number,
  subtopicIds: string[],
  topicIds: string[],
): Promise<{ topic_id: string | null; subtopic_id: string | null }> {
  const slot = curriculumSlotForTask(taskIndex, subtopicIds, topicIds);
  if (slot.subtopic_id) {
    const topic_id = await resolveTopicIdForSubtopic(slot.subtopic_id);
    return { topic_id, subtopic_id: slot.subtopic_id };
  }
  return { topic_id: slot.topic_id, subtopic_id: null };
}

export async function fetchCurriculumSubtopics(topicIds: string[]): Promise<CurriculumSubtopic[]> {
  if (!topicIds.length) return [];
  const { data, error } = await supabase
    .from("curriculum_subtopics")
    .select("id, topic_id, slug, title, sort_order")
    .in("topic_id", topicIds)
    .order("sort_order");

  if (error) {
    console.error("curriculum_subtopics:", error);
    return [];
  }
  return (data ?? []) as CurriculumSubtopic[];
}

export async function setProfileRole(role: Exclude<UserRole, "admin">): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Prisijunkite, kad pasirinktumėte vaidmenį.");

  const { error } = await supabase.from("profiles").update({ role }).eq("id", user.id);
  if (error) throw new Error(error.message);
}

export async function updateTaskBankItem(
  id: string,
  patch: {
    question?: string;
    answer?: string;
    solution?: string;
    difficulty?: BankDifficulty;
    status?: TaskBankStatus;
    diagram_config?: DiagramConfig | null;
    function_equation?: string | null;
    source?: "user_corrected" | "manual";
    topic_id?: string | null;
    subtopic_id?: string | null;
    grade?: number;
  },
): Promise<void> {
  const { error } = await supabase
    .from("task_bank_items")
    .update({
      ...patch,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function createGeneratedTaskBankDraft(params: {
  grade: number;
  difficulty?: BankDifficulty;
  task: {
    question: string;
    answer: string;
    solution?: string;
    diagram_config?: DiagramConfig | null;
    function_equation?: string | null;
  };
  topic_id?: string | null;
  subtopic_id?: string | null;
  generation_prompt?: string | null;
}): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Prisijunkite.");

  let topic_id = params.topic_id ?? null;
  const subtopic_id = params.subtopic_id ?? null;
  if (subtopic_id && !topic_id) {
    topic_id = await resolveTopicIdForSubtopic(subtopic_id);
  }

  const { data, error } = await supabase
    .from("task_bank_items")
    .insert({
      grade: params.grade,
      topic_id,
      subtopic_id,
      difficulty: params.difficulty ?? "vidutinės",
      question: params.task.question,
      answer: params.task.answer,
      solution: params.task.solution ?? "",
      diagram_config: params.task.diagram_config ?? null,
      function_equation: params.task.function_equation ?? null,
      status: "draft",
      source: "ai_generated",
      generation_prompt: params.generation_prompt ?? null,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Nepavyko išsaugoti užduoties banke.");
  return data.id as string;
}

export async function submitTaskFeedback(
  taskBankItemId: string,
  feedbackType: TaskFeedbackType,
  comment?: string,
  curriculum?: { topic_id: string | null; subtopic_id: string | null },
): Promise<"approved" | "draft" | "deleted"> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Prisijunkite.");

  if (feedbackType === "unsuitable") {
    const { error } = await supabase.from("task_bank_items").delete().eq("id", taskBankItemId);
    if (error) throw new Error(error.message);
    return "deleted";
  }

  if (feedbackType === "suitable") {
    const { error } = await supabase
      .from("task_bank_items")
      .update({
        status: "approved",
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...(curriculum?.subtopic_id ? { subtopic_id: curriculum.subtopic_id } : {}),
        ...(curriculum?.topic_id ? { topic_id: curriculum.topic_id } : {}),
      })
      .eq("id", taskBankItemId);
    if (error) throw new Error(error.message);
    return "approved";
  }

  const { error: fbError } = await supabase.from("task_bank_feedback").insert({
    task_bank_item_id: taskBankItemId,
    user_id: user.id,
    feedback_type: feedbackType,
    comment: comment?.trim() || null,
  });
  if (fbError) throw new Error(fbError.message);

  await supabase
    .from("task_bank_items")
    .update({ status: "draft", updated_at: new Date().toISOString() })
    .eq("id", taskBankItemId);

  return "draft";
}

export async function cloneBankItem(source: TaskBankItem): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Prisijunkite.");

  let topic_id = source.topic_id ?? null;
  const subtopic_id = source.subtopic_id ?? null;
  if (subtopic_id && !topic_id) {
    const { data: st } = await supabase
      .from("curriculum_subtopics")
      .select("topic_id")
      .eq("id", subtopic_id)
      .maybeSingle();
    if (st?.topic_id) topic_id = st.topic_id as string;
  }

  const { data, error } = await supabase
    .from("task_bank_items")
    .insert({
      grade: source.grade,
      topic_id,
      subtopic_id,
      difficulty: source.difficulty,
      question: source.question,
      answer: source.answer,
      solution: source.solution ?? "",
      diagram_config: source.diagram_config ?? null,
      function_equation: source.function_equation ?? null,
      status: "draft",
      source: "manual",
      generation_prompt: null,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Nepavyko klonuoti.");
  return data.id as string;
}

/** @deprecated Naudokite cloneBankItem */
export async function duplicateBankItemAsDraft(
  source: TaskBankItem,
  overrides: {
    question: string;
    topic_id?: string | null;
    subtopic_id?: string | null;
    difficulty?: BankDifficulty;
  },
): Promise<string> {
  return cloneBankItem({
    ...source,
    question: overrides.question.trim(),
    topic_id: overrides.topic_id ?? source.topic_id ?? null,
    subtopic_id: overrides.subtopic_id ?? source.subtopic_id ?? null,
    difficulty: overrides.difficulty ?? source.difficulty,
  });
}

export async function saveBankItemContent(
  id: string,
  content: {
    grade: number;
    question: string;
    answer: string;
    solution: string;
    difficulty: BankDifficulty;
    topic_id: string | null;
    subtopic_id: string | null;
  },
): Promise<void> {
  await updateTaskBankItem(id, {
    ...content,
    source: "manual",
  });
}

export async function fetchBankStatusCounts(): Promise<Record<TaskBankStatus, number>> {
  const statuses: TaskBankStatus[] = ["draft", "approved", "rejected"];
  const out = { draft: 0, approved: 0, rejected: 0 } as Record<TaskBankStatus, number>;
  await Promise.all(
    statuses.map(async (status) => {
      const { count, error } = await supabase
        .from("task_bank_items")
        .select("id", { count: "exact", head: true })
        .eq("status", status);
      if (!error && count != null) out[status] = count;
    }),
  );
  return out;
}

export async function fetchAdminBankItems(options?: {
  status?: TaskBankStatus | "all";
  limit?: number;
}): Promise<TaskBankItemWithMeta[]> {
  const baseSelect = `
      *,
      topic:curriculum_topics (
        id,
        title,
        grade
      ),
      subtopic:curriculum_subtopics (
        id,
        title,
        topic:curriculum_topics (
          id,
          title
        )
      ),
      feedback:task_bank_feedback (
        id,
        task_bank_item_id,
        user_id,
        feedback_type,
        comment,
        created_at
      )
    `;

  let q = supabase
    .from("task_bank_items")
    .select(baseSelect)
    .order("updated_at", { ascending: false })
    .limit(options?.limit ?? 500);

  if (options?.status && options.status !== "all") {
    q = q.eq("status", options.status);
  }

  let { data, error } = await q;

  if (error) {
    let fallback = supabase
      .from("task_bank_items")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(options?.limit ?? 500);
    if (options?.status && options.status !== "all") {
      fallback = fallback.eq("status", options.status);
    }
    const res = await fallback;
    if (res.error) throw new Error(res.error.message);
    data = res.data as typeof data;
  }

  type RawRow = TaskBankItem & {
    topic?: { id: string; title: string; grade: number } | null;
    subtopic?: {
      id: string;
      title: string;
      topic?: { id: string; title: string } | null;
    } | null;
    feedback?: TaskBankItemWithMeta["feedback"];
  };

  return ((data ?? []) as RawRow[]).map((row) => {
    const { subtopic, topic, feedback, ...item } = row;
    const sortedFeedback = [...(feedback ?? [])].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    return {
      ...item,
      topic_title: subtopic?.topic?.title ?? topic?.title ?? null,
      subtopic_title: subtopic?.title ?? null,
      feedback: sortedFeedback,
    };
  });
}

export async function clearTaskBankFeedback(taskBankItemId: string): Promise<void> {
  const { error } = await supabase
    .from("task_bank_feedback")
    .delete()
    .eq("task_bank_item_id", taskBankItemId);

  if (error) throw new Error(error.message);
}

export async function saveAndReviewBankItem(
  id: string,
  content: {
    grade: number;
    question: string;
    answer: string;
    solution: string;
    difficulty: BankDifficulty;
    topic_id: string | null;
    subtopic_id: string | null;
  },
  status: "approved" | "rejected",
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Prisijunkite.");

  const { error } = await supabase
    .from("task_bank_items")
    .update({
      grade: content.grade,
      question: content.question,
      answer: content.answer,
      solution: content.solution,
      difficulty: content.difficulty,
      topic_id: content.topic_id,
      subtopic_id: content.subtopic_id,
      source: "manual",
      status,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  if (status === "approved") {
    await clearTaskBankFeedback(id);
  }
}

export async function reviewBankItem(
  id: string,
  status: "approved" | "rejected",
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Prisijunkite.");

  const { error } = await supabase
    .from("task_bank_items")
    .update({
      status,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}
