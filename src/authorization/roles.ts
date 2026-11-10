import { hasPermission, type PermissionActor } from "@/authorization/permissions";

/** Permission `role_create`: create roles via the roles-manage form. */
export function canCreateRole(actor: PermissionActor): boolean {
  return hasPermission("role_create", actor);
}
