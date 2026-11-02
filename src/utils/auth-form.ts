export const USERNAME_PATTERN = /^[A-Za-z0-9_]{2,32}$/;
export const USERNAME_PATTERN_ATTR = "[A-Za-z0-9_]{2,32}";
export const USERNAME_HINT =
  "Username must be 2–32 letters, numbers, or underscores.";

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
