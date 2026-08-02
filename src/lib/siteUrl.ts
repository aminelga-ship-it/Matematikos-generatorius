/**
 * Canonical app origin for OAuth / email magic links.
 *
 * Supabase → Authentication → URL Configuration:
 * - Redirect URLs must include this origin (e.g. http://localhost:5173/**)
 * - If redirectTo is not allowed, Supabase falls back to Site URL (often bolt.host)
 *
 * Local: optional VITE_SITE_URL in .env; in dev we prefer the browser origin.
 */
export function getSupabaseProjectRef(): string | null {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  if (!url) return null;
  const match = url.match(/^https:\/\/([^.]+)\.supabase\.co\/?$/);
  return match?.[1] ?? null;
}

export function getSiteOrigin(): string {
  if (import.meta.env.DEV && typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  const fromEnv = import.meta.env.VITE_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return "";
}

/** Supabase redirectTo — trailing slash matches common allow-list entries */
export function getAuthRedirectUrl(): string {
  const origin = getSiteOrigin();
  return origin ? `${origin}/` : "/";
}
