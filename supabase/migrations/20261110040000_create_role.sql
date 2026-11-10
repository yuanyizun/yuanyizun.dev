-- Optional description on app roles; create via security definer RPC
-- (no broad INSERT RLS — PostgREST cannot insert directly).

alter table public.roles
  add column if not exists description text;

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
