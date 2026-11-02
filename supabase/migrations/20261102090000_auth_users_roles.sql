-- Roles lookup
create table public.roles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null
);

insert into public.roles (key, label)
values ('member', 'Member');

-- App profile linked to auth.users
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  username text,
  role_id uuid not null references public.roles (id),
  created_at timestamptz not null default now()
);

create unique index users_username_lower_uidx
  on public.users (lower(username))
  where username is not null;

-- Create profile + default member role on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  member_role_id uuid;
  meta_username text;
begin
  select id into member_role_id
  from public.roles
  where key = 'member'
  limit 1;

  if member_role_id is null then
    raise exception 'default role member is missing';
  end if;

  meta_username := nullif(trim(coalesce(new.raw_user_meta_data->>'username', '')), '');

  insert into public.users (id, email, username, role_id)
  values (new.id, new.email, meta_username, member_role_id);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon;
revoke execute on function public.handle_new_user() from authenticated;
grant execute on function public.handle_new_user() to supabase_auth_admin;

-- RLS
alter table public.roles enable row level security;
alter table public.users enable row level security;

create policy "Authenticated users can read roles"
  on public.roles
  for select
  to authenticated
  using (true);

create policy "Users can read own profile"
  on public.users
  for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own username"
  on public.users
  for update
  to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role_id = (select u.role_id from public.users u where u.id = auth.uid())
    and email = (select u.email from public.users u where u.id = auth.uid())
  );
