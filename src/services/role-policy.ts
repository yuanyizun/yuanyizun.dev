import "server-only";

import type { CurrentUser } from "@/data/users";

/**
 * v1: any signed-in member with a username may create roles.
 * Tighten later (admin role) without changing form wiring.
 */
export function canCreateRole(actor: CurrentUser): boolean {
  return Boolean(actor.username);
}
