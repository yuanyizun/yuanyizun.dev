"use server";

import {
  deleteRegisteredUserAccount,
  updateRegisteredUserRoleAccount,
  type DeleteRegisteredUserState,
  type UpdateRegisteredUserRoleState,
} from "@/services/domain/users";

export async function deleteRegisteredUserAction(
  id: string,
): Promise<DeleteRegisteredUserState> {
  return deleteRegisteredUserAccount(id);
}

export async function updateRegisteredUserRoleAction(
  id: string,
  roleKey: string,
): Promise<UpdateRegisteredUserRoleState> {
  return updateRegisteredUserRoleAccount(id, roleKey);
}
