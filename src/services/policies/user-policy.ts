import "server-only";

import type { CurrentUser } from "@/data/users";
import { hasPermission } from "@/services/permissions/permissions";

export type RegisteredUserTarget = {
  id: string;
};

/** Permission `user_delete`: remove a directory account (requires a loaded target id). */
export function canDeleteRegisteredUser(
  actor: CurrentUser,
  target: RegisteredUserTarget,
): boolean {
  return Boolean(hasPermission("user_delete", actor) && target.id);
}

/** Permission `user_update_role`: change a directory user's role (requires a loaded target id). */
export function canUpdateRegisteredUserRole(
  actor: CurrentUser,
  target: RegisteredUserTarget,
): boolean {
  return Boolean(hasPermission("user_update_role", actor) && target.id);
}
