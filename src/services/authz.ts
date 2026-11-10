import "server-only";

import type { CurrentUser } from "@/data/users";

/** Trusted app role key for dashboard admin tools. Matches `public.roles.key`. */
export const ADMIN_ROLE_KEY = "admin";

/**
 * Admin check from a verified `CurrentUser` (`getCurrentUser()`).
 * Never call with posted FormData / query / cookie role claims.
 */
export function isAdmin(actor: Pick<CurrentUser, "roleKey">): boolean {
  return actor.roleKey === ADMIN_ROLE_KEY;
}
