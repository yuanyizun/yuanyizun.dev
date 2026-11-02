"use server";

import { signInWithPassword } from "@/services/auth";
import type { AuthFormState } from "@/utils/auth-form";

export async function loginAction(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  return signInWithPassword(formData);
}
