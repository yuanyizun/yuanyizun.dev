import { hasPermission, type PermissionActor } from "@/authorization/permissions";

/** Permission `user_delete`: remove a directory account (requires a loaded target id). */
export function canDeleteRegisteredUser(
  actor: PermissionActor,
  target: { id: string },
): boolean {
  return Boolean(hasPermission("user_delete", actor) && target.id);
}

/** Permission `user_update_role`: change a directory user's role (requires a loaded target id). */
export function canUpdateRegisteredUserRole(
  actor: PermissionActor,
  target: { id: string },
): boolean {
  return Boolean(hasPermission("user_update_role", actor) && target.id);
}
