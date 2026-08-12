import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import {
  PLAN_LIMITS,
  clientIpFromRequest,
  sha256Hex,
} from "./planLimits.ts";

type GuestRow = { key: string; used_requests: number; used_tasks: number };

async function getOrCreateGuestRow(
  supabaseAdmin: SupabaseClient,
  key: string,
): Promise<GuestRow> {
  const { data } = await supabaseAdmin
    .from("guest_usage")
    .select("key, used_requests, used_tasks")
    .eq("key", key)
    .maybeSingle();

  if (data) {
    return data as GuestRow;
  }

  const { data: inserted, error } = await supabaseAdmin
    .from("guest_usage")
    .insert({ key, used_requests: 0, used_tasks: 0 })
    .select("key, used_requests, used_tasks")
    .single();

  if (error || !inserted) {
    // Race: row already exists
    const { data: again } = await supabaseAdmin
      .from("guest_usage")
      .select("key, used_requests, used_tasks")
      .eq("key", key)
      .maybeSingle();
    if (again) return again as GuestRow;
    throw new Error(error?.message ?? "Nepavyko sukurti svečio skaitiklio.");
  }

  return inserted as GuestRow;
}

export async function assertGuestWithinLimits(
  supabaseAdmin: SupabaseClient,
  req: Request,
  guestClientId: string | undefined,
  taskCount: number,
): Promise<{ ok: true; keys: string[] } | { ok: false; error: string; usedRequests: number; usedTasks: number }> {
  const limits = PLAN_LIMITS.guest;
  if (taskCount > limits.maxTasksPerGeneration) {
    return {
      ok: false,
      error: "Svečio režimu galite generuoti ne daugiau nei 1 užduotį vienu metu.",
      usedRequests: 0,
      usedTasks: 0,
    };
  }

  const keys: string[] = [];
  const clientId = (guestClientId ?? "").trim();
  if (clientId.length >= 8) {
    keys.push(`client:${await sha256Hex(clientId)}`);
  }
  const ip = clientIpFromRequest(req);
  if (ip && ip !== "unknown") {
    keys.push(`ip:${await sha256Hex(ip)}`);
  }
  if (keys.length === 0) {
    keys.push(`fallback:${await sha256Hex(req.headers.get("user-agent") ?? "ua")}`);
  }

  let maxReq = 0;
  let maxTasks = 0;
  for (const key of keys) {
    const row = await getOrCreateGuestRow(supabaseAdmin, key);
    maxReq = Math.max(maxReq, row.used_requests);
    maxTasks = Math.max(maxTasks, row.used_tasks);
  }

  if (maxReq >= limits.maxRequestsTotal) {
    return {
      ok: false,
      error: `Svečio režimu galima iki ${limits.maxRequestsTotal} generavimų. Prisijunkite arba atnaujinkite į PRO.`,
      usedRequests: maxReq,
      usedTasks: maxTasks,
    };
  }
  if (maxTasks + taskCount > limits.maxTasksTotal) {
    return {
      ok: false,
      error: `Svečio režimu galima iki ${limits.maxTasksTotal} užduočių iš viso. Prisijunkite arba atnaujinkite į PRO.`,
      usedRequests: maxReq,
      usedTasks: maxTasks,
    };
  }

  return { ok: true, keys };
}

export async function incrementGuestUsage(
  supabaseAdmin: SupabaseClient,
  keys: string[],
  taskCount: number,
): Promise<{ usedRequests: number; usedTasks: number }> {
  let usedRequests = 0;
  let usedTasks = 0;

  for (const key of keys) {
    const row = await getOrCreateGuestRow(supabaseAdmin, key);
    const nextReq = row.used_requests + 1;
    const nextTasks = row.used_tasks + taskCount;
    await supabaseAdmin
      .from("guest_usage")
      .update({
        used_requests: nextReq,
        used_tasks: nextTasks,
        updated_at: new Date().toISOString(),
      })
      .eq("key", key);
    usedRequests = Math.max(usedRequests, nextReq);
    usedTasks = Math.max(usedTasks, nextTasks);
  }

  return { usedRequests, usedTasks };
}
