import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { getCurrentUser, type CurrentUser } from "@/data/users";
import {
  clearSessionCookie,
  setSessionCookie,
} from "@/services/session";
import {
  USERNAME_HINT,
  USERNAME_PATTERN,
  type AuthFieldErrors,
  type AuthFormState,
} from "@/utils/auth-form";
import { createClient } from "@/utils/supabase/server";

export type { AuthFieldErrors, AuthFormState };

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
  if (!USERNAME_PATTERN.test(value)) {
    return { error: USERNAME_HINT };
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
  if (lower.includes("users_username_format")) {
    return USERNAME_HINT;
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

async function finishAuthenticatedRedirect(user: CurrentUser): Promise<never> {
  if (!user.username) {
    redirect("/register/username");
  }
  await setSessionCookie({ sub: user.id, username: user.username });
  redirect("/");
}

/** Send signed-in visitors away from login/register forms. */
export async function redirectIfSignedIn(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    return;
  }
  if (!user.username) {
    redirect("/register/username");
  }
  redirect("/");
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
  const { data, error } = await supabase.auth.signUp({
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

  if (data.session) {
    const user = await getCurrentUser();
    if (!user) {
      return {
        message: "Account created, but the profile is missing. Try signing in.",
      };
    }
    return finishAuthenticatedRedirect(user);
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
  if (!user) {
    return {
      message: "Signed in, but the profile is missing. Try again.",
    };
  }

  return finishAuthenticatedRedirect(user);
}

export async function signOut(): Promise<void> {
  await clearSessionCookie();
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function startGoogleOAuth(
  supabase: SupabaseClient,
): Promise<string> {
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

export async function exchangeAuthCode(
  supabase: SupabaseClient,
  code: string,
): Promise<void> {
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
