import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/data/internal/database";

export type CurrentUser = {
  id: string;
  email: string;
  username: string | null;
  roleKey: string;
};

export type AuthStorageError = {
  message: string;
};

export type SignUpResult =
  | { ok: true; hasSession: boolean }
  | { ok: false; error: AuthStorageError };

export type SignInResult =
  | { ok: true }
  | { ok: false; error: AuthStorageError };

export type UpdateUsernameResult =
  | { ok: true }
  | { ok: false; error: AuthStorageError };

type ProfileRow = {
  id: string;
  email: string;
  username: string | null;
  roles: { key: string } | { key: string }[] | null;
};

function toCurrentUser(profile: ProfileRow): CurrentUser | null {
  const role = profile.roles;
  const roleKey = Array.isArray(role) ? role[0]?.key : role?.key;
  if (!roleKey) {
    return null;
  }

  return {
    id: profile.id,
    email: profile.email,
    username: profile.username,
    roleKey,
  };
}

async function loadProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<ProfileRow | null> {
  const { data: profile, error } = await supabase
    .from("users")
    .select("id, email, username, roles!inner(key)")
    .eq("id", userId)
    .maybeSingle();

  if (error || !profile) {
    return null;
  }

  return profile as ProfileRow;
}

async function loadCurrentUser(
  supabase: SupabaseClient,
): Promise<CurrentUser | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  let profile = await loadProfile(supabase, user.id);

  if (!profile) {
    const { error } = await supabase.rpc("ensure_user_profile");
    if (error) {
      return null;
    }
    profile = await loadProfile(supabase, user.id);
  }

  if (!profile) {
    return null;
  }

  return toCurrentUser(profile);
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  return loadCurrentUser(supabase);
}

export async function signUpWithPassword(input: {
  email: string;
  password: string;
  username: string;
  emailRedirectTo: string;
}): Promise<SignUpResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { username: input.username },
      emailRedirectTo: input.emailRedirectTo,
    },
  });

  if (error) {
    return { ok: false, error: { message: error.message } };
  }

  return { ok: true, hasSession: Boolean(data.session) };
}

export async function signInWithPassword(input: {
  email: string;
  password: string;
}): Promise<SignInResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) {
    return { ok: false, error: { message: error.message } };
  }

  return { ok: true };
}

export async function signOutAuth(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

export async function updateUsername(
  userId: string,
  username: string,
): Promise<UpdateUsernameResult> {
  const supabase = await createClient();
  const { data: updated, error } = await supabase
    .from("users")
    .update({ username })
    .eq("id", userId)
    .select("id")
    .maybeSingle();

  if (error) {
    return { ok: false, error: { message: error.message } };
  }

  if (!updated) {
    return {
      ok: false,
      error: { message: "Could not save username. Try again." },
    };
  }

  return { ok: true };
}

export async function startGoogleOAuth(redirectTo: string): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error || !data.url) {
    throw new Error(error?.message ?? "Google sign-in failed.");
  }

  return data.url;
}

export async function exchangeAuthCode(code: string): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    throw new Error(error.message);
  }
  return loadCurrentUser(supabase);
}
