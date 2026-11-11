import { z } from "zod";
import { firstFieldErrors } from "@/validation/issues";

export const ROLE_NAME_MAX = 64;
export const ROLE_DESCRIPTION_MAX = 280;
export const ROLE_KEY_MAX = 64;

/** Readable labels: letters, numbers, spaces, hyphens. */
export const ROLE_NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 -]{0,63}$/;
export const ROLE_NAME_PATTERN_ATTR = "[A-Za-z0-9][A-Za-z0-9 \\-]{0,63}";
export const ROLE_NAME_HINT =
  "Name must be 1–64 letters, numbers, spaces, or hyphens.";

export type RoleFieldErrors = {
  name?: string;
  description?: string;
};

export type RoleFormState = {
  ok?: boolean;
  message?: string;
  errors?: RoleFieldErrors;
  /** Remount key for clearing uncontrolled inputs after success. */
  createdKey?: string;
};

export type CreateRoleInput = {
  key: string;
  label: string;
  description: string | null;
};

type ParseResult =
  | { ok: true; value: CreateRoleInput }
  | { ok: false; state: RoleFormState };

/** Derive a stable slug from a display name. Server-only authority for `key`. */
export function slugifyRoleKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, ROLE_KEY_MAX);
}

/** Untrusted role keys from select / action args — slug format only. */
const ROLE_KEY_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const roleKeySchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1)
  .max(ROLE_KEY_MAX)
  .regex(ROLE_KEY_RE);

const createRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Name is required.", abort: true })
    .max(ROLE_NAME_MAX, {
      error: `Name must be at most ${ROLE_NAME_MAX} characters.`,
    })
    .regex(ROLE_NAME_PATTERN, { error: ROLE_NAME_HINT }),
  description: z
    .string()
    .trim()
    .max(ROLE_DESCRIPTION_MAX, {
      error: `Description must be at most ${ROLE_DESCRIPTION_MAX} characters.`,
    })
    .transform((value) => (value.length > 0 ? value : null)),
});

export function parseRoleKey(key: unknown): string | null {
  const parsed = roleKeySchema.safeParse(key);
  return parsed.success ? parsed.data : null;
}

function readFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function parseCreateRole(formData: FormData): ParseResult {
  const parsed = createRoleSchema.safeParse({
    name: readFormString(formData, "name"),
    description: readFormString(formData, "description"),
  });

  if (!parsed.success) {
    const flat = firstFieldErrors(parsed.error);
    const errors: RoleFieldErrors = {};
    if (flat.name) errors.name = flat.name;
    if (flat.description) errors.description = flat.description;
    return { ok: false, state: { errors } };
  }

  const key = slugifyRoleKey(parsed.data.name);
  // The name pattern already requires a letter or number, so this does not
  // fire for names that schema accepts. It stays so an empty key is never stored.
  if (!key) {
    return {
      ok: false,
      state: {
        errors: { name: "Name must include at least one letter or number." },
      },
    };
  }

  return {
    ok: true,
    value: {
      key,
      label: parsed.data.name,
      description: parsed.data.description,
    },
  };
}
