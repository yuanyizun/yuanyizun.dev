import "server-only";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearProfileCache } from "@/data/session";
import {
  deleteRegisteredUser,
  getCurrentUser,
  getRegisteredUserById,
  signOutAuth,
} from "@/data/users";
import { canDeleteRegisteredUser } from "@/services/user-policy";
import { parseUserId } from "@/validation/user";

export type DeleteRegisteredUserState =
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
    await clearProfileCache();
    await signOutAuth();
    redirect("/");
  }

  revalidatePath("/dashboard");
  return { ok: true };
}
