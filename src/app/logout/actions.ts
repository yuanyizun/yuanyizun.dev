"use server";

import { signOut } from "@/services/auth";

export async function logoutAction(): Promise<void> {
  await signOut();
}
