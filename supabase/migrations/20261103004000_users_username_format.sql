-- Keep header usernames to the same shape the app accepts.

alter table public.users
  add constraint users_username_format_chk
  check (
    username is null
    or username ~ '^[A-Za-z0-9_]{2,32}$'
  );
