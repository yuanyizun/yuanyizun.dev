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
