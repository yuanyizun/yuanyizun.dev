import "server-only";

import { redirect } from "next/navigation";
import { access } from "@/authorization/access";
import {
  listRegisteredUsers,
  type RegisteredUser,
} from "@/data/registered-users";
import { listRoleOptions, listRoles, type AppRole } from "@/data/roles";
import type { CurrentUser } from "@/data/users";
import { requireUser } from "@/services/domain/auth";
import {
  parseRegisteredUsersQuery,
  type RegisteredUsersSelection,
} from "@/utils/registered-users-query";

export type DashboardRoleOption = {
  key: string;
  label: string;
};

export type DashboardRegisteredUsers = {
  active: RegisteredUsersSelection;
  roles: DashboardRoleOption[];
  users: RegisteredUser[];
  error: boolean;
};

export type DashboardPageData = {
  user: CurrentUser & { username: string };
  roleLabel: string;
  registeredUsers: DashboardRegisteredUsers | null;
  roles: AppRole[] | null;
};

export async function getDashboardPage(
  raw: Record<string, string | string[] | undefined>,
): Promise<DashboardPageData> {
  const user = await requireUser();
  if (!user.username) {
    redirect("/register/username");
  }

  const canViewUsers = access.has("user_view", user);
  const canViewRoles = access.has("role_view", user);
  const roles = canViewRoles ? await listRoles() : null;
  const roleOptions = roles
    ? roles.map(({ key, label }) => ({ key, label }))
    : await listRoleOptions();
  const roleLabel =
    roleOptions.find((role) => role.key === user.roleKey)?.label ?? user.roleKey;

  return {
    user: { ...user, username: user.username },
    roleLabel,
    registeredUsers: canViewUsers
      ? await loadRegisteredUsers(raw, roleOptions)
      : null,
    roles,
  };
}

async function loadRegisteredUsers(
  raw: Record<string, string | string[] | undefined>,
  roleOptions: DashboardRoleOption[],
): Promise<DashboardRegisteredUsers> {
  const active = parseRegisteredUsersQuery(
    raw,
    roleOptions.map((role) => role.key),
  );
  const result = await listRegisteredUsers(active);
  if (!result.ok) {
    return { active, roles: roleOptions, users: [], error: true };
  }
  return { active, roles: roleOptions, users: result.users, error: false };
}
