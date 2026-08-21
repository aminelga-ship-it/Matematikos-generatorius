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
  secondary_month?: number | null;
  bonus_requests?: number | null;
  bonus_tasks?: number | null;
  bonus_secondary?: number | null;
};

function normalizePeriodCounters(profile: ProfileUsage): {
  requestsToday: number;
  requestsMonth: number;
  tasksMonth: number;
  secondaryMonth: number;
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
    secondaryMonth: sameMonth ? (profile.secondary_month ?? 0) : 0,
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

    const bonusRequests = profile.bonus_requests ?? 0;
    const bonusTasks = profile.bonus_tasks ?? 0;
    const baseReqLimit = PLAN_LIMITS.pro.maxRequestsPerMonth;
    const baseTaskLimit = PLAN_LIMITS.pro.maxTasksPerMonth;

    if (period.requestsMonth >= baseReqLimit && bonusRequests < 1) {
      return {
        ok: false,
        error: PRO_LIMIT_EXHAUSTED_MESSAGE,
        code: "pro_limit",
      };
    }

    if (period.tasksMonth + taskCount > baseTaskLimit) {
      const overflow = period.tasksMonth + taskCount - baseTaskLimit;
      if (bonusTasks < overflow) {
        return {
          ok: false,
          error: PRO_LIMIT_EXHAUSTED_MESSAGE,
          code: "pro_limit",
        };
      }
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

  const update: Record<string, unknown> = {
    used_requests: (profile.used_requests ?? 0) + 1,
    used_tasks: (profile.used_tasks ?? 0) + taskCount,
    requests_today: nextToday,
    usage_day: period.usageDay,
    requests_month: nextMonthReq,
    tasks_month: nextMonthTasks,
    usage_month: period.usageMonth,
  };

  if (profile.plan === "pro") {
    const baseReqLimit = PLAN_LIMITS.pro.maxRequestsPerMonth;
    const baseTaskLimit = PLAN_LIMITS.pro.maxTasksPerMonth;
    let bonusRequests = profile.bonus_requests ?? 0;
    let bonusTasks = profile.bonus_tasks ?? 0;

    if (period.requestsMonth >= baseReqLimit) {
      bonusRequests = Math.max(0, bonusRequests - 1);
    }
    if (period.tasksMonth + taskCount > baseTaskLimit) {
      const overflow = period.tasksMonth + taskCount - baseTaskLimit;
      bonusTasks = Math.max(0, bonusTasks - overflow);
    }

    update.bonus_requests = bonusRequests;
    update.bonus_tasks = bonusTasks;
  }

  await supabaseAdmin.from("profiles").update(update).eq("id", profile.id);
}

export function assertSecondaryWithinLimits(
  profile: ProfileUsage,
):
  | { ok: true; period: ReturnType<typeof normalizePeriodCounters> }
  | { ok: false; error: string; code?: "pro_limit" } {
  const period = normalizePeriodCounters(profile);

  if (profile.role === "admin" || profile.plan === "unlimited") {
    return { ok: true, period };
  }

  const limit =
    profile.plan === "pro"
      ? PLAN_LIMITS.pro.maxSecondaryPerMonth
      : PLAN_LIMITS.free.maxSecondaryPerMonth;

  if (period.secondaryMonth >= limit) {
    if (profile.plan === "pro" && (profile.bonus_secondary ?? 0) >= 1) {
      return { ok: true, period };
    }
    return {
      ok: false,
      error: PRO_LIMIT_EXHAUSTED_MESSAGE,
      code: "pro_limit",
    };
  }

  return { ok: true, period };
}

export async function incrementSecondaryUsage(
  supabaseAdmin: SupabaseClient,
  profile: ProfileUsage,
  period: ReturnType<typeof normalizePeriodCounters>,
): Promise<void> {
  const nextSecondary = period.secondaryMonth + 1;

  const update: Record<string, unknown> = {
    secondary_month: nextSecondary,
    usage_month: period.usageMonth,
  };

  if (
    profile.plan === "pro" &&
    period.secondaryMonth >= PLAN_LIMITS.pro.maxSecondaryPerMonth
  ) {
    update.bonus_secondary = Math.max(0, (profile.bonus_secondary ?? 0) - 1);
  }

  await supabaseAdmin.from("profiles").update(update).eq("id", profile.id);
}
