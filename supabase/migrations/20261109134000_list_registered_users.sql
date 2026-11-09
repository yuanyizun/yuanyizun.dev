-- Directory of registered accounts for signed-in visitors.
-- Returns no email. Do not widen public.users SELECT: that column is on the row.

create or replace function public.list_registered_users()
returns table (
  id uuid,
  username text,
  role_key text,
  role_label text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select u.id, u.username, r.key, r.label, u.created_at
  from public.users u
  join public.roles r on r.id = u.role_id
  where auth.uid() is not null
  order by u.created_at desc;
$$;

revoke all on function public.list_registered_users() from public;
revoke all on function public.list_registered_users() from anon;
grant execute on function public.list_registered_users() to authenticated;
