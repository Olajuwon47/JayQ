begin;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (length(trim(full_name)) > 0),
  student_id text not null check (length(trim(student_id)) > 0),
  active boolean not null default true
);

alter table public.profiles enable row level security;

grant select, insert, update, delete on public.profiles to authenticated;

create policy "Students can read their own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Administrators can manage student profiles"
  on public.profiles
  for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

commit;