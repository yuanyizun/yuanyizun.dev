import type { QueryFilterPatch } from "@/utils/query-params";

export const registeredUsersParams = {
  q: "q",
  role: "role",
  page: "page",
} as const;

export type RegisteredUsersSelection = {
  q: string;
  role: string | null;
};

type ParamSource = URLSearchParams | Record<string, string | string[] | undefined>;

function readValues(source: ParamSource, key: string) {
  if (source instanceof URLSearchParams) {
    return source.getAll(key).map((value) => value.trim()).filter(Boolean);
  }

  const value = source[key];
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }
  return [];
}

export function parseRegisteredUsersQuery(
  source: ParamSource,
  roleKeys: readonly string[],
): RegisteredUsersSelection {
  const q = readValues(source, registeredUsersParams.q)[0] ?? "";
  const roleRaw = readValues(source, registeredUsersParams.role)[0];
  const known = new Set(roleKeys);
  const role = roleRaw && known.has(roleRaw) ? roleRaw : null;
  return { q, role };
}

export function registeredUsersFilterPatch(
  selection: RegisteredUsersSelection,
): QueryFilterPatch {
  return {
    [registeredUsersParams.q]: selection.q.trim() || null,
    [registeredUsersParams.role]: selection.role || null,
    [registeredUsersParams.page]: null,
  };
}

export function hasRegisteredUsersFilters(selection: RegisteredUsersSelection) {
  return Boolean(selection.q.trim() || selection.role);
}
