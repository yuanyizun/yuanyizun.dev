-- Hard authorization for privileged security-definer RPCs.
-- App-layer allowlists live in src/services/action-access.json; this SQL
-- mirrors role key 'admin' as defense in depth against direct PostgREST rpc.

create or replace function public.is_current_user_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users u
    join public.roles r on r.id = u.role_id
    where u.id = auth.uid()
      and r.key = 'admin'
  );
$$;

revoke all on function public.is_current_user_admin() from public;
revoke all on function public.is_current_user_admin() from anon;
revoke all on function public.is_current_user_admin() from authenticated;

create or replace function public.list_registered_users()
returns table (
  id uuid,
  username text,
  role_key text,
  role_label text,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if not public.is_current_user_admin() then
    raise exception 'not authorized';
  end if;

  return query
  select u.id, u.username, r.key, r.label, u.created_at
  from public.users u
  join public.roles r on r.id = u.role_id
  order by u.created_at desc;
end;
$$;

revoke all on function public.list_registered_users() from public;
revoke all on function public.list_registered_users() from anon;
grant execute on function public.list_registered_users() to authenticated;

create or replace function public.get_registered_user(target_id uuid)
returns table (
  id uuid,
  username text,
  role_key text,
  role_label text,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if not public.is_current_user_admin() then
    raise exception 'not authorized';
  end if;

  return query
  select u.id, u.username, r.key, r.label, u.created_at
  from public.users u
  join public.roles r on r.id = u.role_id
  where u.id = target_id;
end;
$$;

revoke all on function public.get_registered_user(uuid) from public;
revoke all on function public.get_registered_user(uuid) from anon;
grant execute on function public.get_registered_user(uuid) to authenticated;

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

  if not public.is_current_user_admin() then
    raise exception 'not authorized';
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

  if not public.is_current_user_admin() then
    raise exception 'not authorized';
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

create or replace function public.create_role(
  p_key text,
  p_label text,
  p_description text
)
returns table (
  id uuid,
  key text,
  label text,
  description text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if not public.is_current_user_admin() then
    raise exception 'not authorized';
  end if;

  if p_key is null or length(trim(p_key)) = 0 then
    raise exception 'invalid key';
  end if;

  if p_label is null or length(trim(p_label)) = 0 then
    raise exception 'invalid label';
  end if;

  return query
  insert into public.roles (key, label, description)
  values (
    trim(p_key),
    trim(p_label),
    nullif(trim(coalesce(p_description, '')), '')
  )
  returning
    public.roles.id,
    public.roles.key,
    public.roles.label,
    public.roles.description;
end;
$$;

revoke all on function public.create_role(text, text, text) from public;
revoke all on function public.create_role(text, text, text) from anon;
grant execute on function public.create_role(text, text, text) to authenticated;
