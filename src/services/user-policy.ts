import "server-only";

import type { CurrentUser } from "@/data/users";
import { isAdmin } from "@/services/authz";

export type RegisteredUserTarget = {
  id: string;
};

/** Admin-only: view the registered-users dashboard section / directory data. */
export function canViewRegisteredUsers(actor: CurrentUser): boolean {
  return isAdmin(actor);
}

/** Admin-only: remove a directory account (requires a loaded target id). */
export function canDeleteRegisteredUser(
  actor: CurrentUser,
  target: RegisteredUserTarget,
): boolean {
  return Boolean(isAdmin(actor) && target.id);
}

/** Admin-only: change a directory user's role (requires a loaded target id). */
export function canUpdateRegisteredUserRole(
  actor: CurrentUser,
  target: RegisteredUserTarget,
): boolean {
  return Boolean(isAdmin(actor) && target.id);
}
