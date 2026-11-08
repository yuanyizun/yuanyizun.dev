"use server";

import { registerWithPassword, setUsername } from "@/services/auth";
import type { AuthFormState } from "@/utils/auth-form";

export async function registerAction(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  return registerWithPassword(formData);
}

export async function setUsernameAction(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  return setUsername(formData);
}
