import "server-only";

import { createClient } from "@/data/internal/database";

export type AppRole = {
  key: string;
  label: string;
  description: string | null;
};

export type AppRoleOption = {
  key: string;
  label: string;
};

export type CreateRoleResult =
  | { ok: true; role: AppRole }
  | { ok: false; error: { message: string; code?: string } };

function isRoleRow(row: unknown): row is {
  key: string;
  label: string;
  description: string | null;
} {
  if (!row || typeof row !== "object") {
    return false;
  }
  const r = row as Record<string, unknown>;
  return (
    typeof r.key === "string" &&
    r.key.length > 0 &&
    typeof r.label === "string" &&
    r.label.length > 0 &&
    (r.description === null || typeof r.description === "string")
  );
}

export async function listRoles(): Promise<AppRole[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("roles")
    .select("key, label, description")
    .order("label");

  if (error || !Array.isArray(data)) {
    return [];
  }

  return data.flatMap((row) => {
    if (!isRoleRow(row)) {
      return [];
    }
    return [
      {
        key: row.key,
        label: row.label,
        description: row.description ?? null,
      },
    ];
  });
}

export async function listRoleOptions(): Promise<AppRoleOption[]> {
  const roles = await listRoles();
  return roles.map(({ key, label }) => ({ key, label }));
}

export async function createRole(input: {
  key: string;
  label: string;
  description: string | null;
}): Promise<CreateRoleResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_role", {
    p_key: input.key,
    p_label: input.label,
    p_description: input.description,
  });

  if (error) {
    return {
      ok: false,
      error: { message: error.message, code: error.code },
    };
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!isRoleRow(row)) {
    return {
      ok: false,
      error: { message: "Unexpected create_role response." },
    };
  }

  return {
    ok: true,
    role: {
      key: row.key,
      label: row.label,
      description: row.description ?? null,
    },
  };
}
