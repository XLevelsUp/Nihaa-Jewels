-- Staff roles for the admin: only people listed here can use it, each as admin or manager; what each role may do lives in apps/admin/src/lib/permissions.ts.

create type staff_role_t as enum ('admin', 'manager');

create table staff (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  role       staff_role_t not null default 'manager',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger staff_updated_at before update on staff
  for each row execute function set_updated_at();

-- No policies: only the admin app's service_role key reads or writes staff.
alter table staff enable row level security;

-- Everyone who can sign in today keeps full access, so switching roles on locks nobody out.
insert into staff (user_id, email, role)
select id, coalesce(email, ''), 'admin' from auth.users
on conflict (user_id) do nothing;
