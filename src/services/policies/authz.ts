import "server-only";

import type { CurrentUser } from "@/data/users";

/**
 * Trusted admin role key used by SQL RPC defense-in-depth
 * (`public.is_current_user_admin`). Product gates use
 * `hasPermission` and `src/configs/role-permissions.json`.
 */
export const ADMIN_ROLE_KEY = "admin";

/**
 * Convenience admin check from a verified `CurrentUser`.
 * Prefer `hasPermission` for action authorization.
 * Never call with posted FormData / query / cookie role claims.
 */
export function isAdmin(actor: Pick<CurrentUser, "roleKey">): boolean {
  return actor.roleKey === ADMIN_ROLE_KEY;
}
