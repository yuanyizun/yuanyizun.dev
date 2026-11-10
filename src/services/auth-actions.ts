"use server";

import {
  registerWithPassword,
  setUsername,
  signInWithPassword,
  signOut,
  updateProfile,
} from "@/services/auth";
import {
  parseLogin,
  parseRegister,
  parseUpdateProfile,
  parseUsername,
  type AuthFormState,
} from "@/validation/auth";

export async function loginAction(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = parseLogin(formData);
  if (!parsed.ok) return parsed.state;
  return signInWithPassword(parsed.value);
}

export async function registerAction(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = parseRegister(formData);
  if (!parsed.ok) return parsed.state;
  return registerWithPassword(parsed.value);
}

export async function setUsernameAction(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = parseUsername(formData);
  if (!parsed.ok) return parsed.state;
  return setUsername(parsed.value);
}

export async function updateProfileAction(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = parseUpdateProfile(formData);
  if (!parsed.ok) return parsed.state;
  return updateProfile(parsed.value);
}

export async function logoutAction(): Promise<void> {
  await signOut();
}
