import "server-only";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { listRoleOptions } from "@/data/roles";
import {
  deleteRegisteredUser,
  getCurrentUser,
  getRegisteredUserById,
  signOutAuth,
  updateRegisteredUserRole,
} from "@/data/users";
import {
  canDeleteRegisteredUser,
  canUpdateRegisteredUserRole,
} from "@/services/policies/user-policy";
import { parseRoleKey } from "@/validation/role";
import { parseUserId } from "@/validation/user";

export type DeleteRegisteredUserState =
  | { ok: true }
  | { ok: false; message: string };

export type UpdateRegisteredUserRoleState =
  | { ok: true }
  | { ok: false; message: string };

export async function deleteRegisteredUserAccount(
  id: string,
): Promise<DeleteRegisteredUserState> {
  const actor = await getCurrentUser();
  if (!actor) {
    return { ok: false, message: "Sign in required." };
  }

  if (!actor.username) {
    return { ok: false, message: "Finish setting up your username first." };
  }

  const userId = parseUserId(id);
  if (!userId) {
    return { ok: false, message: "Invalid user." };
  }

  const target = await getRegisteredUserById(userId);
  if (!target || !canDeleteRegisteredUser(actor, target)) {
    return { ok: false, message: "You cannot delete this user." };
  }

  const result = await deleteRegisteredUser(target.id);
  if (!result.ok) {
    console.error("deleteRegisteredUser failed:", result.error.message);
    return { ok: false, message: "Could not delete user. Try again." };
  }

  const deletedSelf = target.id === actor.id;
  if (deletedSelf) {
    await signOutAuth();
    redirect("/");
  }

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateRegisteredUserRoleAccount(
  id: string,
  roleKeyInput: string,
): Promise<UpdateRegisteredUserRoleState> {
  const actor = await getCurrentUser();
  if (!actor) {
    return { ok: false, message: "Sign in required." };
  }

  if (!actor.username) {
    return { ok: false, message: "Finish setting up your username first." };
  }

  const userId = parseUserId(id);
  if (!userId) {
    return { ok: false, message: "Invalid user." };
  }

  const roleKey = parseRoleKey(roleKeyInput);
  if (!roleKey) {
    return { ok: false, message: "Invalid role." };
  }

  const roles = await listRoleOptions();
  if (!roles.some((role) => role.key === roleKey)) {
    return { ok: false, message: "Invalid role." };
  }

  const target = await getRegisteredUserById(userId);
  if (!target || !canUpdateRegisteredUserRole(actor, target)) {
    return { ok: false, message: "You cannot update this user's role." };
  }

  if (target.roleKey === roleKey) {
    return { ok: true };
  }

  const result = await updateRegisteredUserRole({
    userId: target.id,
    roleKey,
  });
  if (!result.ok) {
    console.error("updateRegisteredUserRole failed:", result.error.message);
    return { ok: false, message: "Could not update role. Try again." };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}
