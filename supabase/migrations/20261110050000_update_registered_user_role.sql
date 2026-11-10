-- Update a directory user's app role via security definer RPC
-- (public.users UPDATE RLS locks role_id — PostgREST cannot change it).

create or replace function public.update_registered_user_role(
  target_id uuid,
  p_role_key text
)
returns table (
  id uuid,
  username text,
  role_key text,
  role_label text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  new_role_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if target_id is null then
    raise exception 'invalid target';
  end if;

  if p_role_key is null or length(trim(p_role_key)) = 0 then
    raise exception 'invalid role';
  end if;

  select r.id into new_role_id
  from public.roles r
  where r.key = trim(p_role_key)
  limit 1;

  if new_role_id is null then
    raise exception 'role not found';
  end if;

  if not exists (select 1 from public.users u where u.id = target_id) then
    raise exception 'not found';
  end if;

  update public.users
  set role_id = new_role_id
  where public.users.id = target_id;

  return query
  select u.id, u.username, r.key, r.label, u.created_at
  from public.users u
  join public.roles r on r.id = u.role_id
  where u.id = target_id;
end;
$$;

revoke all on function public.update_registered_user_role(uuid, text) from public;
revoke all on function public.update_registered_user_role(uuid, text) from anon;
grant execute on function public.update_registered_user_role(uuid, text) to authenticated;
