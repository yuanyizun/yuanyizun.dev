import "server-only";

import type { CurrentUser } from "@/data/users";
import { hasPermission } from "@/services/permissions/permissions";

/** Permission `role_create`: create roles via the roles-manage form. */
export function canCreateRole(actor: CurrentUser): boolean {
  return hasPermission("role_create", actor);
}
