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

function parseUsernameField(raw: FormDataEntryValue | null): {
  value?: string;
  error?: string;
} {
  const value = String(raw ?? "").trim();
  if (!value) {
    return { error: "Username is required." };
  }
  if (!USERNAME_PATTERN.test(value)) {
    return { error: USERNAME_HINT };
  }
  return { value };
}

function parseEmailField(raw: FormDataEntryValue | null): {
  value?: string;
  error?: string;
} {
  const value = String(raw ?? "").trim();
  if (!value) {
    return { error: "Email is required." };
  }
  const at = value.indexOf("@");
  if (at <= 0 || at !== value.lastIndexOf("@") || at === value.length - 1) {
    return { error: "Enter a valid email." };
  }
  return { value };
}

function parsePasswordField(raw: FormDataEntryValue | null): {
  value?: string;
  error?: string;
} {
  const value = String(raw ?? "");
  if (!value) {
    return { error: "Password is required." };
  }
  if (value.length < PASSWORD_MIN) {
    return { error: `Password must be at least ${PASSWORD_MIN} characters.` };
  }
  return { value };
}

export function parseLogin(formData: FormData): ParseResult<LoginInput> {
  const email = parseEmailField(formData.get("email"));
  const password = parsePasswordField(formData.get("password"));
  const errors: AuthFieldErrors = {};
  if (email.error) errors.email = email.error;
  if (password.error) errors.password = password.error;
  if (Object.keys(errors).length > 0) {
    return { ok: false, state: { errors } };
  }
  return {
    ok: true,
    value: { email: email.value!, password: password.value! },
  };
}

export function parseRegister(formData: FormData): ParseResult<RegisterInput> {
  const username = parseUsernameField(formData.get("username"));
  const email = parseEmailField(formData.get("email"));
  const password = parsePasswordField(formData.get("password"));
  const errors: AuthFieldErrors = {};
  if (username.error) errors.username = username.error;
  if (email.error) errors.email = email.error;
  if (password.error) errors.password = password.error;
  if (Object.keys(errors).length > 0) {
    return { ok: false, state: { errors } };
  }
  return {
    ok: true,
    value: {
      username: username.value!,
      email: email.value!,
      password: password.value!,
    },
  };
}

export function parseUsername(formData: FormData): ParseResult<UsernameInput> {
  const username = parseUsernameField(formData.get("username"));
  if (username.error) {
    return { ok: false, state: { errors: { username: username.error } } };
  }
  return { ok: true, value: { username: username.value! } };
}
