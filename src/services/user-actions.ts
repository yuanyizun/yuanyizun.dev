"use server";

import {
  deleteRegisteredUserAccount,
  type DeleteRegisteredUserState,
} from "@/services/users";

export async function deleteRegisteredUserAction(
  id: string,
): Promise<DeleteRegisteredUserState> {
  return deleteRegisteredUserAccount(id);
}
