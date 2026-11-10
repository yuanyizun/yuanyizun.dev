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

export function parseRoleKey(key: unknown): string | null {
  if (typeof key !== "string") {
    return null;
  }
  const trimmed = key.trim().toLowerCase();
  if (
    !trimmed ||
    trimmed.length > ROLE_KEY_MAX ||
    !ROLE_KEY_RE.test(trimmed)
  ) {
    return null;
  }
  return trimmed;
}

export function parseCreateRole(formData: FormData): ParseResult {
  const rawName = String(formData.get("name") ?? "").trim();
  const rawDescription = String(formData.get("description") ?? "").trim();

  const errors: RoleFieldErrors = {};

  if (!rawName) {
    errors.name = "Name is required.";
  } else if (rawName.length > ROLE_NAME_MAX) {
    errors.name = `Name must be at most ${ROLE_NAME_MAX} characters.`;
  } else if (!ROLE_NAME_PATTERN.test(rawName)) {
    errors.name = ROLE_NAME_HINT;
  }

  if (rawDescription.length > ROLE_DESCRIPTION_MAX) {
    errors.description = `Description must be at most ${ROLE_DESCRIPTION_MAX} characters.`;
  }

  if (errors.name || errors.description) {
    return { ok: false, state: { errors } };
  }

  const key = slugifyRoleKey(rawName);
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
      label: rawName,
      description: rawDescription.length > 0 ? rawDescription : null,
    },
  };
}
