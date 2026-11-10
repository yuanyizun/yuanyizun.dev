import "server-only";

import type { CurrentUser } from "@/data/users";
import { isActionAuthorized } from "@/services/action-access";

/** JSON action `createRole`: create roles via the roles-manage form. */
export function canCreateRole(actor: CurrentUser): boolean {
  return isActionAuthorized("createRole", actor);
}

/** JSON action `manageRoles`: view and use the roles-manage dashboard section. */
export function canManageRoles(actor: CurrentUser): boolean {
  return isActionAuthorized("manageRoles", actor);
}
