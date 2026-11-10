import type { ProfileCacheClaims } from "@/data/session";

export type SupabaseAuthCheck =
  | { status: "signed_out" }
  | { status: "unavailable" }
  | { status: "verified"; sub: string };

export type ReconcileDecision = "clear" | "keep" | "reload";

export type ReconcileInput = {
  auth: SupabaseAuthCheck;
  cache: ProfileCacheClaims | null;
  /** True when iat is past TTL or the token could not be read as fresh. */
  stale: boolean;
};

/**
 * Pure profile-cache reconcile. Supabase Auth decides identity;
 * the cache never proves sign-in on its own.
 */
export function reconcileProfileCache(
  input: ReconcileInput,
): ReconcileDecision {
  const { auth, cache, stale } = input;

  if (auth.status === "signed_out") {
    return "clear";
  }

  if (auth.status === "unavailable") {
    // Transient Auth blip: do not mass-log out, and do not invent a login.
    return "keep";
  }

  if (
    !cache ||
    cache.sub !== auth.sub ||
    !cache.username ||
    !cache.role ||
    stale
  ) {
    return "reload";
  }

  return "keep";
}
