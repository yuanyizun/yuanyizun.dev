import "server-only";

import { createClient } from "@/data/internal/database";

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
  | { ok: false; error: { message: string } };

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
  | { ok: false; error: { message: string } };

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
