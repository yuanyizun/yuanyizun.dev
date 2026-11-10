-- Load one directory row for authorize-before-delete.
-- Returns no email. Same column shape as list_registered_users.

create or replace function public.get_registered_user(target_id uuid)
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
    and u.id = target_id;
$$;

revoke all on function public.get_registered_user(uuid) from public;
revoke all on function public.get_registered_user(uuid) from anon;
grant execute on function public.get_registered_user(uuid) to authenticated;

-- Delete Auth user (cascades to public.users). Caller must be signed in.
-- App-layer canDeleteRegisteredUser remains the policy gate.

create or replace function public.delete_registered_user(target_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if target_id is null then
    raise exception 'invalid target';
  end if;

  if not exists (select 1 from public.users where id = target_id) then
    raise exception 'not found';
  end if;

  delete from auth.users where id = target_id;
end;
$$;

revoke all on function public.delete_registered_user(uuid) from public;
revoke all on function public.delete_registered_user(uuid) from anon;
grant execute on function public.delete_registered_user(uuid) to authenticated;
