import type { PermissionActor } from "rbac";
import { access } from "@/authorization/access";

/** Permission `role_create`: create roles via the roles-manage form. */
export function canCreateRole(actor: PermissionActor): boolean {
  return access.has("role_create", actor);
}
