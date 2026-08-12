const GUEST_ID_KEY = "mg_guest_client_id";
const GUEST_USAGE_KEY = "mg_guest_usage_v1";

export const GUEST_MAX_REQUESTS = 3;
export const GUEST_MAX_TASKS = 3;

/** Stabilus svečio ID naršyklėje (siunčiamas serveriui). */
export function getGuestClientId(): string {
  try {
    let id = localStorage.getItem(GUEST_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(GUEST_ID_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

type GuestUsageLocal = { requests: number; tasks: number };

function readLocalUsage(): GuestUsageLocal {
  try {
    const raw = localStorage.getItem(GUEST_USAGE_KEY);
    if (!raw) return { requests: 0, tasks: 0 };
    const parsed = JSON.parse(raw) as GuestUsageLocal;
    return {
      requests: Number(parsed.requests) || 0,
      tasks: Number(parsed.tasks) || 0,
    };
  } catch {
    return { requests: 0, tasks: 0 };
  }
}

function writeLocalUsage(u: GuestUsageLocal): void {
  try {
    localStorage.setItem(GUEST_USAGE_KEY, JSON.stringify(u));
  } catch {
    /* ignore */
  }
}

export function getGuestLocalUsage(): GuestUsageLocal {
  return readLocalUsage();
}

/** Greitas UI tikrinimas; tikras limitas — serveryje. */
export function guestCanGenerateLocally(taskCount: number): boolean {
  const u = readLocalUsage();
  return u.requests < GUEST_MAX_REQUESTS && u.tasks + taskCount <= GUEST_MAX_TASKS;
}

export function recordGuestLocalUsage(taskCount: number): void {
  const u = readLocalUsage();
  writeLocalUsage({
    requests: u.requests + 1,
    tasks: u.tasks + taskCount,
  });
}

export function syncGuestLocalUsageFromServer(usedRequests: number, usedTasks: number): void {
  const u = readLocalUsage();
  writeLocalUsage({
    requests: Math.max(u.requests, usedRequests),
    tasks: Math.max(u.tasks, usedTasks),
  });
}
