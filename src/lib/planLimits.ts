/** Planų limitai — turi sutapti su supabase/functions/generate-tasks/planLimits.ts */

export const PLAN_LIMITS = {
  free: {
    maxRequestsPerDay: 3,
    maxRequestsPerMonth: 10,
    maxTasksPerGeneration: 1,
    maxSecondaryPerMonth: 10,
  },
  pro: {
    maxRequestsPerMonth: 100,
    maxTasksPerMonth: 300,
    maxTasksPerGeneration: 15,
    maxSecondaryPerMonth: 80,
  },
  unlimited: {
    maxTasksPerGeneration: 15,
  },
} as const;

/** Papildomo limitų paketo (6,99 €) kreditai */
export const EXTRA_LIMITS_PACKAGE = {
  priceEur: "6,99",
  bonusRequests: 50,
  bonusTasks: 150,
  bonusSecondary: 40,
} as const;

export const EXTRA_LIMITS_FEATURES = [
  `+${EXTRA_LIMITS_PACKAGE.bonusRequests} užklausų`,
  `+${EXTRA_LIMITS_PACKAGE.bonusTasks} užduočių`,
  `+${EXTRA_LIMITS_PACKAGE.bonusSecondary} antrinių generavimų`,
] as const;
