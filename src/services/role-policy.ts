import "server-only";

import type { CurrentUser } from "@/data/users";
import { isAdmin } from "@/services/authz";

/** Admin-only: create roles via the roles-manage form. */
export function canCreateRole(actor: CurrentUser): boolean {
  return isAdmin(actor);
}

/** Admin-only: view and use the roles-manage dashboard section. */
export function canManageRoles(actor: CurrentUser): boolean {
  return isAdmin(actor);
}
