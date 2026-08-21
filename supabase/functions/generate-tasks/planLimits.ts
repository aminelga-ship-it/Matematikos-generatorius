/** Planų limitai — turi sutapti su PricingPage. */

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

/** Papildomo limitų paketo (6,99 €) kreditai — turi sutapti su PricingPage. */
export const EXTRA_LIMITS_PACKAGE = {
  bonusRequests: 50,
  bonusTasks: 150,
  bonusSecondary: 40,
} as const;

export function currentUsageDay(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function currentUsageMonth(d = new Date()): string {
  return d.toISOString().slice(0, 7);
}

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function clientIpFromRequest(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}
