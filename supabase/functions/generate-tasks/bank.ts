import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

export type BankDifficulty = "lengvos" | "vidutinės" | "sunkios";

export interface BankTaskRow {
  id: string;
  question: string;
  answer: string;
  solution: string;
  diagram_config?: unknown;
  function_equation?: string;
  difficulty: BankDifficulty;
}

export interface TaskWithBankId {
  question: string;
  answer: string;
  solution: string;
  diagram_config?: unknown;
  function_equation?: string;
  bank_item_id: string;
  from_approved_bank?: boolean;
  task_difficulty?: BankDifficulty;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type DeliveryInfo = { delivered_at: string };

/** Tik dar nematytos užduotys; jau duotos — nebekartojamos (tada AI papildo). */
function orderForUser(
  rows: BankTaskRow[],
  delivered: Map<string, DeliveryInfo>,
): BankTaskRow[] {
  return shuffle(rows.filter((r) => !delivered.has(r.id)));
}

async function fetchUserDeliveries(
  supabaseAdmin: SupabaseClient,
  userId: string,
  itemIds: string[],
): Promise<Map<string, DeliveryInfo>> {
  const map = new Map<string, DeliveryInfo>();
  if (!itemIds.length) return map;

  const { data, error } = await supabaseAdmin
    .from("user_bank_deliveries")
    .select("task_bank_item_id, delivered_at")
    .eq("user_id", userId)
    .in("task_bank_item_id", itemIds);

  if (error) {
    console.error("user_bank_deliveries select:", error.message);
    return map;
  }
  for (const row of data ?? []) {
    const r = row as { task_bank_item_id: string; delivered_at: string };
    map.set(r.task_bank_item_id, { delivered_at: r.delivered_at });
  }
  return map;
}

async function recordUserDeliveries(
  supabaseAdmin: SupabaseClient,
  userId: string,
  itemIds: string[],
): Promise<void> {
  if (!itemIds.length) return;
  const now = new Date().toISOString();

  for (const task_bank_item_id of itemIds) {
    const { data: existing, error: selectError } = await supabaseAdmin
      .from("user_bank_deliveries")
      .select("delivery_count")
      .eq("user_id", userId)
      .eq("task_bank_item_id", task_bank_item_id)
      .maybeSingle();

    if (selectError) {
      console.error("user_bank_deliveries select:", selectError.message);
      continue;
    }

    if (existing) {
      const prev = (existing as { delivery_count: number }).delivery_count ?? 0;
      const { error: updateError } = await supabaseAdmin
        .from("user_bank_deliveries")
        .update({
          delivered_at: now,
          delivery_count: prev + 1,
        })
        .eq("user_id", userId)
        .eq("task_bank_item_id", task_bank_item_id);
      if (updateError) {
        console.error("user_bank_deliveries update:", updateError.message);
      }
    } else {
      const { error: insertError } = await supabaseAdmin.from("user_bank_deliveries").insert({
        user_id: userId,
        task_bank_item_id,
        delivered_at: now,
        delivery_count: 1,
      });
      if (insertError) {
        console.error("user_bank_deliveries insert:", insertError.message);
      }
    }
  }
}

function rowToTask(row: BankTaskRow): TaskWithBankId {
  return {
    question: row.question,
    answer: row.answer,
    solution: row.solution ?? "",
    diagram_config: row.diagram_config ?? undefined,
    function_equation: row.function_equation ?? undefined,
    bank_item_id: row.id,
    from_approved_bank: true,
    task_difficulty: row.difficulty,
  };
}

/** Rotacija per vartotojo pasirinktas potemes / temas (savarankiškam AI papildymui). */
export function curriculumSlot(
  index: number,
  subtopicIds: string[],
  topicIds: string[],
): { topicId: string | null; subtopicId: string | null } {
  if (subtopicIds.length > 0) {
    return { topicId: null, subtopicId: subtopicIds[index % subtopicIds.length] };
  }
  if (topicIds.length > 0) {
    return { topicId: topicIds[index % topicIds.length], subtopicId: null };
  }
  return { topicId: null, subtopicId: null };
}

const BANK_ITEM_SELECT =
  "id, question, answer, solution, diagram_config, function_equation, difficulty";

function mergeBankRows(byId: Map<string, BankTaskRow>, rows: BankTaskRow[] | null | undefined) {
  for (const row of rows ?? []) {
    byId.set(row.id, row);
  }
}

async function parentTopicIdsForSubtopics(
  supabaseAdmin: SupabaseClient,
  subtopicIds: string[],
): Promise<string[]> {
  if (!subtopicIds.length) return [];
  const { data, error } = await supabaseAdmin
    .from("curriculum_subtopics")
    .select("topic_id")
    .in("id", subtopicIds);
  if (error) {
    console.error("curriculum_subtopics lookup:", error.message);
    return [];
  }
  return [
    ...new Set(
      ((data ?? []) as { topic_id: string | null }[])
        .map((r) => r.topic_id)
        .filter((id): id is string => typeof id === "string" && id.length > 0),
    ),
  ];
}

/** Orientacinis ~40/40/20 mišiniui; vieno lygio režime — tik tas pool. */
export async function selectTasksFromBank(
  supabaseAdmin: SupabaseClient,
  grade: number,
  filters: { subtopicIds: string[]; topicIds: string[] },
  taskCount: number,
  bankMode: BankDifficulty | "mix" = "mix",
  userId?: string | null,
): Promise<{ tasks: TaskWithBankId[]; error?: string }> {
  const subtopicIds = filters.subtopicIds.filter(Boolean);
  const topicIds = filters.topicIds.filter(Boolean);

  if (!subtopicIds.length && !topicIds.length) {
    return { tasks: [], error: "Pasirinkite bent vieną temą arba potemę." };
  }

  const byId = new Map<string, BankTaskRow>();

  if (subtopicIds.length) {
    const { data, error } = await supabaseAdmin
      .from("task_bank_items")
      .select(BANK_ITEM_SELECT)
      .eq("grade", grade)
      .eq("status", "approved")
      .in("subtopic_id", subtopicIds);

    if (error) {
      console.error("Bank select (subtopic) error:", error.message);
      return { tasks: [], error: "Nepavyko gauti užduočių iš banko." };
    }
    mergeBankRows(byId, data as BankTaskRow[]);

    // Be potemės — ta pati tema, bet bet kuri pasirinkta potemė.
    const parentTopicIds = await parentTopicIdsForSubtopics(supabaseAdmin, subtopicIds);
    if (parentTopicIds.length) {
      const { data: topicWide, error: topicWideError } = await supabaseAdmin
        .from("task_bank_items")
        .select(BANK_ITEM_SELECT)
        .eq("grade", grade)
        .eq("status", "approved")
        .in("topic_id", parentTopicIds)
        .is("subtopic_id", null);

      if (topicWideError) {
        console.error("Bank select (topic-wide for subtopics) error:", topicWideError.message);
        return { tasks: [], error: "Nepavyko gauti užduočių iš banko." };
      }
      mergeBankRows(byId, topicWide as BankTaskRow[]);
    }
  }

  if (topicIds.length) {
    const { data, error } = await supabaseAdmin
      .from("task_bank_items")
      .select(BANK_ITEM_SELECT)
      .eq("grade", grade)
      .eq("status", "approved")
      .in("topic_id", topicIds)
      .is("subtopic_id", null);

    if (error) {
      console.error("Bank select (topic) error:", error.message);
      return { tasks: [], error: "Nepavyko gauti užduočių iš banko." };
    }
    mergeBankRows(byId, data as BankTaskRow[]);
  }

  const all = [...byId.values()];
  if (all.length === 0) {
    return { tasks: [] };
  }

  const allIds = all.map((r) => r.id);
  const delivered = userId
    ? await fetchUserDeliveries(supabaseAdmin, userId, allIds)
    : new Map<string, DeliveryInfo>();

  const pools: Record<BankDifficulty, BankTaskRow[]> = {
    lengvos: orderForUser(all.filter((r) => r.difficulty === "lengvos"), delivered),
    vidutinės: orderForUser(all.filter((r) => r.difficulty === "vidutinės"), delivered),
    sunkios: orderForUser(all.filter((r) => r.difficulty === "sunkios"), delivered),
  };

  if (bankMode !== "mix") {
    const pool = pools[bankMode];
    const picked = pool.slice(0, taskCount);
    if (picked.length === 0) {
      return { tasks: [] };
    }
    const ids = picked.map((r) => r.id);
    const { data: usageRows } = await supabaseAdmin
      .from("task_bank_items")
      .select("id, usage_count")
      .in("id", ids);
    if (usageRows) {
      await Promise.all(
        usageRows.map((u: { id: string; usage_count: number }) =>
          supabaseAdmin
            .from("task_bank_items")
            .update({
              usage_count: (u.usage_count ?? 0) + 1,
              updated_at: new Date().toISOString(),
            })
            .eq("id", u.id)
        ),
      );
    }
    if (userId) {
      await recordUserDeliveries(supabaseAdmin, userId, ids);
    }
    return { tasks: picked.map(rowToTask) };
  }

  let wantLengvos = Math.round(taskCount * 0.4);
  let wantVidutines = Math.round(taskCount * 0.4);
  let wantSunkios = taskCount - wantLengvos - wantVidutines;
  if (wantSunkios < 0) wantSunkios = 0;

  const picked: BankTaskRow[] = [];
  const usedIds = new Set<string>();

  const takeFrom = (pool: BankTaskRow[], n: number) => {
    for (const row of pool) {
      if (picked.length >= taskCount || n <= 0) break;
      if (usedIds.has(row.id)) continue;
      picked.push(row);
      usedIds.add(row.id);
      n--;
    }
    return n;
  };

  let remL = takeFrom(pools.lengvos, wantLengvos);
  let remV = takeFrom(pools.vidutinės, wantVidutines);
  let remS = takeFrom(pools.sunkios, wantSunkios);

  const remainder = [
    ...pools.lengvos.filter((r) => !usedIds.has(r.id)),
    ...pools.vidutinės.filter((r) => !usedIds.has(r.id)),
    ...pools.sunkios.filter((r) => !usedIds.has(r.id)),
  ];

  for (const row of remainder) {
    if (picked.length >= taskCount) break;
    if (usedIds.has(row.id)) continue;
    picked.push(row);
    usedIds.add(row.id);
  }

  void remL;
  void remV;
  void remS;

  const finalPick = picked.slice(0, taskCount);
  if (finalPick.length === 0) {
    return { tasks: [] };
  }
  const ids = finalPick.map((r) => r.id);

  const { data: usageRows } = await supabaseAdmin
    .from("task_bank_items")
    .select("id, usage_count")
    .in("id", ids);

  if (usageRows) {
    await Promise.all(
      usageRows.map((u: { id: string; usage_count: number }) =>
        supabaseAdmin
          .from("task_bank_items")
          .update({
            usage_count: (u.usage_count ?? 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", u.id)
      ),
    );
  }

  if (userId) {
    await recordUserDeliveries(supabaseAdmin, userId, ids);
  }

  return { tasks: shuffle(finalPick).map(rowToTask) };
}

export async function insertTasksAsBankDrafts(
  supabaseAdmin: SupabaseClient,
  params: {
    grade: number;
    difficulty: BankDifficulty;
    generationPrompt: string;
    createdBy: string | null;
    topicId?: string | null;
    subtopicId?: string | null;
    /** Pasirinktos potemės/temos — kiekvienai užduočiai rotacija */
    curriculum?: { subtopicIds: string[]; topicIds: string[] };
    difficultyForIndex?: (index: number) => BankDifficulty;
    /** Visada draft kol mokytojas/admin nepatvirtina. */
    bankStatus?: "draft" | "approved";
    tasks: Array<{
      question: string;
      answer: string;
      solution: string;
      diagram_config?: unknown;
      function_equation?: string;
    }>;
  },
): Promise<TaskWithBankId[]> {
  const result: TaskWithBankId[] = [];
  const bankStatus = params.bankStatus ?? "draft";
  const reviewedAt = bankStatus === "approved" ? new Date().toISOString() : null;
  const reviewedBy = bankStatus === "approved" ? params.createdBy : null;

  const subtopicIdsForLookup = new Set<string>();
  if (params.curriculum) {
    for (let i = 0; i < params.tasks.length; i++) {
      const slot = curriculumSlot(i, params.curriculum.subtopicIds, params.curriculum.topicIds);
      if (slot.subtopicId) subtopicIdsForLookup.add(slot.subtopicId);
    }
  }

  const topicIdBySubtopicId = new Map<string, string>();
  if (subtopicIdsForLookup.size > 0) {
    const { data: subRows } = await supabaseAdmin
      .from("curriculum_subtopics")
      .select("id, topic_id")
      .in("id", [...subtopicIdsForLookup]);
    for (const row of subRows ?? []) {
      const r = row as { id: string; topic_id: string };
      topicIdBySubtopicId.set(r.id, r.topic_id);
    }
  }

  for (let i = 0; i < params.tasks.length; i++) {
    const t = params.tasks[i];
    const slot = params.curriculum
      ? curriculumSlot(i, params.curriculum.subtopicIds, params.curriculum.topicIds)
      : { topicId: params.topicId ?? null, subtopicId: params.subtopicId ?? null };
    const topic_id = slot.subtopicId
      ? topicIdBySubtopicId.get(slot.subtopicId) ?? slot.topicId
      : slot.topicId;
    const subtopic_id = slot.subtopicId;
    const difficulty = params.difficultyForIndex?.(i) ?? params.difficulty;

    const { data, error } = await supabaseAdmin
      .from("task_bank_items")
      .insert({
        grade: params.grade,
        topic_id,
        subtopic_id,
        difficulty,
        question: t.question,
        answer: t.answer,
        solution: t.solution ?? "",
        diagram_config: t.diagram_config ?? null,
        function_equation: t.function_equation ?? null,
        status: bankStatus,
        source: "ai_generated",
        generation_prompt: params.generationPrompt,
        created_by: params.createdBy,
        reviewed_by: reviewedBy,
        reviewed_at: reviewedAt,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("Bank draft insert error:", error?.message);
      result.push({ ...t, bank_item_id: "" });
    } else {
      result.push({ ...t, bank_item_id: data.id as string });
    }
  }

  return result;
}
