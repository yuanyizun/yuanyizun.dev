import "server-only";

import { redirect } from "next/navigation";
import type { CurrentUser } from "@/data/users";
import { hasPermission } from "@/services/permissions/permission-rules";

export {
  assertPermission,
  hasPermission,
  parsePermissionCatalog,
  parseRolePermissions,
  PermissionError,
  permissionCatalog,
  permissionsForActor,
  permissionsForRole,
  roleGrants,
  withPermission,
  type PermissionActor,
  type RoleGrant,
} from "@/services/permissions/permission-rules";

/** Page gate. Anonymous visitors go to /login. Signed-in denial goes to /. */
export async function requirePermission(
  permission: string,
): Promise<CurrentUser> {
  const { getCurrentUser } = await import("@/data/users");
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (!hasPermission(permission, user)) {
    redirect("/");
  }
  return user;
}
