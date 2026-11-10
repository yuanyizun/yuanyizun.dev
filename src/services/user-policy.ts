import "server-only";

import type { CurrentUser } from "@/data/users";

export type RegisteredUserTarget = {
  id: string;
};

/**
 * v1: any signed-in member with a username may remove any directory account.
 * Tighten later (admin role, ownership) without changing button wiring.
 */
export function canDeleteRegisteredUser(
  actor: CurrentUser,
  target: RegisteredUserTarget,
): boolean {
  return Boolean(actor.username && target.id);
}
