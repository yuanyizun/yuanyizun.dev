import "server-only";

import { redirect } from "next/navigation";
import {
  clearSessionCookie,
  setSessionCookie,
} from "@/data/session";
import {
  exchangeAuthCode as exchangeAuthCodeInData,
  getCurrentUser,
  signInWithPassword as signInWithPasswordInData,
  signOutAuth,
  signUpWithPassword,
  startGoogleOAuth as startGoogleOAuthInData,
  updateUsername,
  type CurrentUser,
} from "@/data/users";
import {
  PASSWORD_MIN,
  USERNAME_HINT,
  type AuthFormState,
  type LoginInput,
  type RegisterInput,
  type UsernameInput,
} from "@/validation/auth";

export type { AuthFormState } from "@/validation/auth";

function siteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3002"
  );
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
  input: RegisterInput,
): Promise<AuthFormState> {
  const result = await signUpWithPassword({
    email: input.email,
    password: input.password,
    username: input.username,
    emailRedirectTo: `${siteUrl()}/auth/callback`,
  });

  if (!result.ok) {
    const mapped = mapAuthError(result.error.message);
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

  if (result.hasSession) {
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
  input: LoginInput,
): Promise<AuthFormState> {
  const result = await signInWithPasswordInData(input);

  if (!result.ok) {
    return { message: mapAuthError(result.error.message) };
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
  await signOutAuth();
  redirect("/");
}

export async function startGoogleOAuth(): Promise<string> {
  try {
    return await startGoogleOAuthInData(`${siteUrl()}/auth/callback`);
  } catch (error) {
    throw new Error(
      mapAuthError(error instanceof Error ? error.message : "Google sign-in failed."),
    );
  }
}

export async function exchangeAuthCode(code: string): Promise<string> {
  let user: CurrentUser | null;
  try {
    user = await exchangeAuthCodeInData(code);
  } catch (error) {
    throw new Error(
      mapAuthError(error instanceof Error ? error.message : "Sign-in failed."),
    );
  }

  if (user?.username) {
    await setSessionCookie({ sub: user.id, username: user.username });
    return `${siteUrl()}/`;
  }

  return `${siteUrl()}/register/username`;
}

export async function setUsername(
  input: UsernameInput,
): Promise<AuthFormState> {
  const current = await getCurrentUser();
  if (!current) {
    redirect("/login");
  }

  const result = await updateUsername(current.id, input.username);
  if (!result.ok) {
    return {
      errors: { username: mapAuthError(result.error.message) },
    };
  }

  await setSessionCookie({ sub: current.id, username: input.username });
  redirect("/");
}
