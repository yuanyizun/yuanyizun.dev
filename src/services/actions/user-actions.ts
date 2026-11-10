"use server";

import {
  deleteRegisteredUserAccount,
  updateRegisteredUserRoleAccount,
  type DeleteRegisteredUserState,
  type UpdateRegisteredUserRoleState,
} from "@/services/domain/users";
import { parseRoleKey } from "@/validation/role";
import { parseUserId } from "@/validation/user";

export async function deleteRegisteredUserAction(
  id: string,
): Promise<DeleteRegisteredUserState> {
  const userId = parseUserId(id);
  if (!userId) {
    return { ok: false, message: "Invalid user." };
  }
  return deleteRegisteredUserAccount(userId);
}

export async function updateRegisteredUserRoleAction(
  id: string,
  roleKey: string,
): Promise<UpdateRegisteredUserRoleState> {
  const userId = parseUserId(id);
  if (!userId) {
    return { ok: false, message: "Invalid user." };
  }
  const parsedRoleKey = parseRoleKey(roleKey);
  if (!parsedRoleKey) {
    return { ok: false, message: "Invalid role." };
  }
  return updateRegisteredUserRoleAccount(userId, parsedRoleKey);
}
