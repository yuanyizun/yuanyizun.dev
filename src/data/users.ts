import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";
import { createClient } from "@/data/internal/database";
import { listRoleOptions } from "@/data/roles";

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

export type RegisteredUser = {
  id: string;
  username: string | null;
  roleKey: string;
  roleLabel: string;
  createdAt: string;
};

export type ListRegisteredUsersResult =
  | { ok: true; users: RegisteredUser[] }
  | { ok: false };

type RegisteredUserRow = {
  id: string;
  username: string | null;
  role_key: string;
  role_label: string;
  created_at: string;
};

function toRegisteredUser(row: RegisteredUserRow): RegisteredUser {
  return {
    id: row.id,
    username: row.username,
    roleKey: row.role_key,
    roleLabel: row.role_label,
    createdAt: row.created_at,
  };
}

function isRegisteredUserRow(value: unknown): value is RegisteredUserRow {
  if (!value || typeof value !== "object") {
    return false;
  }
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === "string" &&
    (typeof row.username === "string" || row.username === null) &&
    typeof row.role_key === "string" &&
    typeof row.role_label === "string" &&
    typeof row.created_at === "string"
  );
}

export type { AppRoleOption } from "@/data/roles";

export type RegisteredUsersFilters = {
  q: string;
  role: string | null;
};

function applyRegisteredUserFilters(
  users: RegisteredUser[],
  filters?: RegisteredUsersFilters,
): RegisteredUser[] {
  if (!filters) {
    return users;
  }

  const q = filters.q.trim().toLowerCase();
  return users.filter((user) => {
    if (q) {
      if (!user.username || !user.username.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (filters.role && user.roleKey !== filters.role) {
      return false;
    }
    return true;
  });
}

export async function listAppRoles() {
  return listRoleOptions();
}

export async function listRegisteredUsers(
  filters?: RegisteredUsersFilters,
): Promise<ListRegisteredUsersResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("list_registered_users");

  if (error || !Array.isArray(data) || !data.every(isRegisteredUserRow)) {
    return { ok: false };
  }

  return {
    ok: true,
    users: applyRegisteredUserFilters(data.map(toRegisteredUser), filters),
  };
}

export async function getRegisteredUserById(
  userId: string,
): Promise<RegisteredUser | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_registered_user", {
    target_id: userId,
  });

  if (error || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  const row = data[0];
  if (!isRegisteredUserRow(row)) {
    return null;
  }

  return toRegisteredUser(row);
}

export type DeleteRegisteredUserResult =
  | { ok: true }
  | { ok: false; error: AuthStorageError };

export async function deleteRegisteredUser(
  userId: string,
): Promise<DeleteRegisteredUserResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_registered_user", {
    target_id: userId,
  });

  if (error) {
    return { ok: false, error: { message: error.message } };
  }

  return { ok: true };
}

export type UpdateRegisteredUserRoleResult =
  | { ok: true; user: RegisteredUser }
  | { ok: false; error: AuthStorageError };

export async function updateRegisteredUserRole(input: {
  userId: string;
  roleKey: string;
}): Promise<UpdateRegisteredUserRoleResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("update_registered_user_role", {
    target_id: input.userId,
    p_role_key: input.roleKey,
  });

  if (error) {
    return { ok: false, error: { message: error.message } };
  }

  if (!Array.isArray(data) || data.length === 0) {
    return {
      ok: false,
      error: { message: "Unexpected update_registered_user_role response." },
    };
  }

  const row = data[0];
  if (!isRegisteredUserRow(row)) {
    return {
      ok: false,
      error: { message: "Unexpected update_registered_user_role response." },
    };
  }

  return { ok: true, user: toRegisteredUser(row) };
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  return loadCurrentUser(supabase);
});

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
