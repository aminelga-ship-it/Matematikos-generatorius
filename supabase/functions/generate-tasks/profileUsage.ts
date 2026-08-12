import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { PLAN_LIMITS, currentUsageDay, currentUsageMonth } from "./planLimits.ts";

export const PRO_LIMIT_EXHAUSTED_MESSAGE =
  "Atsiprašome, jūsų limitas išnaudotas. Papildykite limitus.";

export type ProfileUsage = {
  id: string;
  plan: string;
  role?: string | null;
  used_requests: number;
  used_tasks: number;
  requests_today?: number | null;
  usage_day?: string | null;
  requests_month?: number | null;
  tasks_month?: number | null;
  usage_month?: string | null;
};

function normalizePeriodCounters(profile: ProfileUsage): {
  requestsToday: number;
  requestsMonth: number;
  tasksMonth: number;
  usageDay: string;
  usageMonth: string;
} {
  const today = currentUsageDay();
  const month = currentUsageMonth();
  const sameDay = profile.usage_day === today;
  const sameMonth = profile.usage_month === month;

  return {
    requestsToday: sameDay ? (profile.requests_today ?? 0) : 0,
    requestsMonth: sameMonth ? (profile.requests_month ?? profile.used_requests ?? 0) : 0,
    tasksMonth: sameMonth ? (profile.tasks_month ?? profile.used_tasks ?? 0) : 0,
    usageDay: today,
    usageMonth: month,
  };
}

export function assertLoggedInWithinLimits(
  profile: ProfileUsage,
  taskCount: number,
):
  | { ok: true; period: ReturnType<typeof normalizePeriodCounters> }
  | { ok: false; error: string; code?: "pro_limit" } {
  const period = normalizePeriodCounters(profile);

  if (profile.role === "admin" || profile.plan === "unlimited") {
    if (taskCount > PLAN_LIMITS.unlimited.maxTasksPerGeneration) {
      return { ok: false, error: "Vienu metu galite generuoti ne daugiau nei 15 užduočių." };
    }
    return { ok: true, period };
  }

  const isPro = profile.plan === "pro";

  if (isPro) {
    if (taskCount > PLAN_LIMITS.pro.maxTasksPerGeneration) {
      return { ok: false, error: "Vienu metu galite generuoti ne daugiau nei 15 užduočių." };
    }
    if (period.requestsMonth >= PLAN_LIMITS.pro.maxRequestsPerMonth) {
      return {
        ok: false,
        error: PRO_LIMIT_EXHAUSTED_MESSAGE,
        code: "pro_limit",
      };
    }
    if (period.tasksMonth + taskCount > PLAN_LIMITS.pro.maxTasksPerMonth) {
      return {
        ok: false,
        error: PRO_LIMIT_EXHAUSTED_MESSAGE,
        code: "pro_limit",
      };
    }
    return { ok: true, period };
  }

  // Free
  if (taskCount > PLAN_LIMITS.free.maxTasksPerGeneration) {
    return {
      ok: false,
      error: "Nemokamame plane vienu metu galima generuoti 1 užduotį. Atnaujinkite į PRO.",
    };
  }
  if (period.requestsToday >= PLAN_LIMITS.free.maxRequestsPerDay) {
    return {
      ok: false,
      error: `Nemokamame plane — iki ${PLAN_LIMITS.free.maxRequestsPerDay} užklausų per dieną. Atnaujinkite į PRO arba bandykite rytoj.`,
    };
  }
  if (period.requestsMonth >= PLAN_LIMITS.free.maxRequestsPerMonth) {
    return {
      ok: false,
      error: `Viršijote nemokamo plano mėnesinį užklausų limitą (${PLAN_LIMITS.free.maxRequestsPerMonth}). Atnaujinkite į PRO.`,
    };
  }
  return { ok: true, period };
}

export async function incrementLoggedInUsage(
  supabaseAdmin: SupabaseClient,
  profile: ProfileUsage,
  taskCount: number,
  period: ReturnType<typeof normalizePeriodCounters>,
): Promise<void> {
  const nextToday = period.requestsToday + 1;
  const nextMonthReq = period.requestsMonth + 1;
  const nextMonthTasks = period.tasksMonth + taskCount;

  await supabaseAdmin
    .from("profiles")
    .update({
      used_requests: (profile.used_requests ?? 0) + 1,
      used_tasks: (profile.used_tasks ?? 0) + taskCount,
      requests_today: nextToday,
      usage_day: period.usageDay,
      requests_month: nextMonthReq,
      tasks_month: nextMonthTasks,
      usage_month: period.usageMonth,
    })
    .eq("id", profile.id);
}
