-- Ensure the admin role key exists for app-layer authorization.
-- Idempotent: safe if the row was already created via create_role / ops.

insert into public.roles (key, label, description)
values ('admin', 'Admin', 'Admin Users')
on conflict (key) do nothing;
