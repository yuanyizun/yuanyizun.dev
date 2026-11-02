import "server-only";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/data/users";
import {
  clearSessionCookie,
  setSessionCookie,
} from "@/services/session";
import type { AuthFieldErrors, AuthFormState } from "@/utils/auth-form";
import { createClient } from "@/utils/supabase/server";

export type { AuthFieldErrors, AuthFormState };

const USERNAME_MAX = 32;
const PASSWORD_MIN = 8;

function siteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3002"
  );
}

export function validateUsername(raw: FormDataEntryValue | null): {
  value?: string;
  error?: string;
} {
  const value = String(raw ?? "").trim();
  if (!value) {
    return { error: "Username is required." };
  }
  if (value.length > USERNAME_MAX) {
    return { error: `Username must be at most ${USERNAME_MAX} characters.` };
  }
  return { value };
}

export function validateEmail(raw: FormDataEntryValue | null): {
  value?: string;
  error?: string;
} {
  const value = String(raw ?? "").trim();
  if (!value) {
    return { error: "Email is required." };
  }
  const at = value.indexOf("@");
  if (at <= 0 || at !== value.lastIndexOf("@") || at === value.length - 1) {
    return { error: "Enter a valid email." };
  }
  return { value };
}

export function validatePassword(raw: FormDataEntryValue | null): {
  value?: string;
  error?: string;
} {
  const value = String(raw ?? "");
  if (!value) {
    return { error: "Password is required." };
  }
  if (value.length < PASSWORD_MIN) {
    return { error: `Password must be at least ${PASSWORD_MIN} characters.` };
  }
  return { value };
}

function mapAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("user already registered")) {
    return "An account with this email already exists.";
  }
  if (lower.includes("email not confirmed")) {
    return "Confirm your email before signing in.";
  }
  if (
    lower.includes("password") &&
    (lower.includes("least") || lower.includes("weak") || lower.includes("short"))
  ) {
    return `Password must be at least ${PASSWORD_MIN} characters.`;
  }
  if (
    lower.includes("duplicate") ||
    lower.includes("unique") ||
    lower.includes("users_username_lower")
  ) {
    return "That username is already taken.";
  }
  if (lower.includes("invalid login credentials")) {
    return "Email or password is incorrect.";
  }
  return message || "Something went wrong. Try again.";
}

export async function registerWithPassword(
  formData: FormData,
): Promise<AuthFormState> {
  const username = validateUsername(formData.get("username"));
  const email = validateEmail(formData.get("email"));
  const password = validatePassword(formData.get("password"));

  const errors: AuthFieldErrors = {};
  if (username.error) errors.username = username.error;
  if (email.error) errors.email = email.error;
  if (password.error) errors.password = password.error;
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: email.value!,
    password: password.value!,
    options: {
      data: { username: username.value },
      emailRedirectTo: `${siteUrl()}/auth/callback`,
    },
  });

  if (error) {
    const mapped = mapAuthError(error.message);
    if (mapped.toLowerCase().includes("username")) {
      return { errors: { username: mapped } };
    }
    if (mapped.toLowerCase().includes("email already")) {
      return { errors: { email: mapped } };
    }
    if (mapped.toLowerCase().includes("password")) {
      return { errors: { password: mapped } };
    }
    return { message: mapped };
  }

  return {
    ok: true,
    message: "Check your email to confirm your account.",
  };
}

export async function signInWithPassword(
  formData: FormData,
): Promise<AuthFormState> {
  const email = validateEmail(formData.get("email"));
  const password = validatePassword(formData.get("password"));

  const errors: AuthFieldErrors = {};
  if (email.error) errors.email = email.error;
  if (password.error) errors.password = password.error;
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value!,
    password: password.value!,
  });

  if (error) {
    return { message: mapAuthError(error.message) };
  }

  const user = await getCurrentUser();
  if (user?.username) {
    await setSessionCookie({ sub: user.id, username: user.username });
  }

  redirect("/");
}

export async function signOut(): Promise<void> {
  await clearSessionCookie();
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function startGoogleOAuth(): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl()}/auth/callback`,
    },
  });

  if (error || !data.url) {
    throw new Error(mapAuthError(error?.message ?? "Google sign-in failed."));
  }

  return data.url;
}

export async function exchangeAuthCode(code: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    throw new Error(mapAuthError(error.message));
  }
}

export async function setUsername(
  formData: FormData,
): Promise<AuthFormState> {
  const username = validateUsername(formData.get("username"));
  if (username.error) {
    return { errors: { username: username.error } };
  }

  const current = await getCurrentUser();
  if (!current) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data: updated, error } = await supabase
    .from("users")
    .update({ username: username.value })
    .eq("id", current.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return {
      errors: { username: mapAuthError(error.message) },
    };
  }

  if (!updated) {
    return {
      errors: { username: "Could not save username. Try again." },
    };
  }

  await setSessionCookie({ sub: current.id, username: username.value! });
  redirect("/");
}
