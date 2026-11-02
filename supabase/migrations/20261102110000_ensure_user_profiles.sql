-- Backfill profiles for auth users created before the trigger existed,
-- and expose an RPC so signed-in users can repair a missing profile row.

insert into public.users (id, email, username, role_id)
select
  au.id,
  au.email,
  nullif(trim(coalesce(au.raw_user_meta_data ->> 'username', '')), ''),
  r.id
from auth.users au
cross join lateral (
  select id
  from public.roles
  where key = 'member'
  limit 1
) r
where not exists (
  select 1
  from public.users u
  where u.id = au.id
);

create or replace function public.ensure_user_profile()
returns public.users
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  member_role_id uuid;
  meta_username text;
  result public.users;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  select *
  into result
  from public.users
  where id = uid;

  if found then
    return result;
  end if;

  select id
  into member_role_id
  from public.roles
  where key = 'member'
  limit 1;

  if member_role_id is null then
    raise exception 'default role member is missing';
  end if;

  select nullif(trim(coalesce(raw_user_meta_data ->> 'username', '')), '')
  into meta_username
  from auth.users
  where id = uid;

  insert into public.users (id, email, username, role_id)
  select au.id, au.email, meta_username, member_role_id
  from auth.users au
  where au.id = uid
  on conflict (id) do nothing
  returning * into result;

  if result.id is null then
    select *
    into result
    from public.users
    where id = uid;
  end if;

  return result;
end;
$$;

revoke all on function public.ensure_user_profile() from public;
grant execute on function public.ensure_user_profile() to authenticated;
