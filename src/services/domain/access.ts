import "server-only";

import { redirect } from "next/navigation";
import { hasPermission } from "@/authorization/permissions";
import { getCurrentUser, type CurrentUser } from "@/data/users";

/** Page gate. Anonymous visitors go to /login. Signed-in denial goes to /. */
export async function requirePermission(
  permission: string,
): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (!hasPermission(permission, user)) {
    redirect("/");
  }
  return user;
}
