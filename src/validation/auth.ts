import { z } from "zod";
import { firstFieldErrors } from "@/validation/issues";

export const USERNAME_PATTERN = /^[A-Za-z0-9_]{2,32}$/;
export const USERNAME_PATTERN_ATTR = "[A-Za-z0-9_]{2,32}";
export const USERNAME_HINT =
  "Username must be 2–32 letters, numbers, or underscores.";
export const PASSWORD_MIN = 8;

export type AuthFieldErrors = {
  username?: string;
  email?: string;
  password?: string;
};

export type AuthFormState = {
  ok?: boolean;
  message?: string;
  errors?: AuthFieldErrors;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  username: string;
  email: string;
  password: string;
};

export type UsernameInput = {
  username: string;
};

type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; state: AuthFormState };

const usernameSchema = z
  .string()
  .trim()
  .min(1, { error: "Username is required.", abort: true })
  .regex(USERNAME_PATTERN, { error: USERNAME_HINT });

const emailSchema = z
  .string()
  .trim()
  .min(1, { error: "Email is required.", abort: true })
  .pipe(
    z.email({
      pattern: z.regexes.html5Email,
      error: "Enter a valid email.",
    }),
  );

const passwordSchema = z
  .string()
  .min(1, { error: "Password is required.", abort: true })
  .min(PASSWORD_MIN, {
    error: `Password must be at least ${PASSWORD_MIN} characters.`,
  });

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

const usernameFormSchema = z.object({
  username: usernameSchema,
});

function readFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function parseAuth<T>(
  schema: z.ZodType<T>,
  value: unknown,
  fields: Array<keyof AuthFieldErrors>,
): ParseResult<T> {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    const flat = firstFieldErrors(parsed.error);
    const errors: AuthFieldErrors = {};
    for (const field of fields) {
      const message = flat[field];
      if (message) {
        errors[field] = message;
      }
    }
    return { ok: false, state: { errors } };
  }
  return { ok: true, value: parsed.data };
}

export function parseLogin(formData: FormData): ParseResult<LoginInput> {
  return parseAuth(
    loginSchema,
    {
      email: readFormString(formData, "email"),
      password: readFormString(formData, "password"),
    },
    ["email", "password"],
  );
}

export function parseRegister(formData: FormData): ParseResult<RegisterInput> {
  return parseAuth(
    registerSchema,
    {
      username: readFormString(formData, "username"),
      email: readFormString(formData, "email"),
      password: readFormString(formData, "password"),
    },
    ["username", "email", "password"],
  );
}

export function parseUsername(formData: FormData): ParseResult<UsernameInput> {
  return parseAuth(
    usernameFormSchema,
    { username: readFormString(formData, "username") },
    ["username"],
  );
}

/** Dashboard profile edit — same username allowlist; ignore any posted ids/roles. */
export function parseUpdateProfile(
  formData: FormData,
): ParseResult<UsernameInput> {
  return parseUsername(formData);
}
