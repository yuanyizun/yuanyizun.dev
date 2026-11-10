import "server-only";

import type { CurrentUser } from "@/data/users";
import { isActionAuthorized } from "@/services/action-access";

export type RegisteredUserTarget = {
  id: string;
};

/** JSON action `viewRegisteredUsers`: view the registered-users section / directory data. */
export function canViewRegisteredUsers(actor: CurrentUser): boolean {
  return isActionAuthorized("viewRegisteredUsers", actor);
}

/** JSON action `deleteRegisteredUser`: remove a directory account (requires a loaded target id). */
export function canDeleteRegisteredUser(
  actor: CurrentUser,
  target: RegisteredUserTarget,
): boolean {
  return Boolean(
    isActionAuthorized("deleteRegisteredUser", actor) && target.id,
  );
}

/** JSON action `updateRegisteredUserRole`: change a directory user's role (requires a loaded target id). */
export function canUpdateRegisteredUserRole(
  actor: CurrentUser,
  target: RegisteredUserTarget,
): boolean {
  return Boolean(
    isActionAuthorized("updateRegisteredUserRole", actor) && target.id,
  );
}
