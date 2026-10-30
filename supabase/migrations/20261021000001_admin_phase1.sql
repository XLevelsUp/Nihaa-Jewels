-- Admin phase 1: product status with soft delete, gold-specific details, and a trigger-written change history that staff can undo.

-- ─── Status and soft delete ────────────────────────────────────────────
create type product_status_t as enum ('draft', 'published', 'archived');

alter table products
  add column status     product_status_t not null default 'draft',
  add column deleted_at timestamptz;

-- Existing rows keep exactly what they show today.
update products set status = case when is_active then 'published'::product_status_t else 'draft'::product_status_t end;

-- is_active stays the one flag the storefront and RLS read; deriving it here means it can never disagree with status.
create or replace function sync_product_visibility()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.is_active := (new.status = 'published' and new.deleted_at is null);
  return new;
end;
$$;

create trigger products_sync_visibility before insert or update on products
  for each row execute function sync_product_visibility();


-- ─── Gold details ──────────────────────────────────────────────────────
alter table products
  add column metal_colour      text check (metal_colour in ('yellow', 'rose', 'white')),
  add column huid              text check (huid ~ '^[A-Z0-9]{6}$'),
  add column size_label        text,
  add column dimensions        text,
  add column closure           text,
  add column care_instructions text;

comment on column products.huid is 'BIS 6-character Hallmark Unique ID of this piece.';
comment on column products.size_label is 'Chain length or bangle/ring size as shown to customers, e.g. 18 in or 2.6.';

-- One HUID belongs to one physical piece, so two live products can never share it.
create unique index products_huid_unique on products (huid) where huid is not null and deleted_at is null;


-- ─── Change history ────────────────────────────────────────────────────
create table product_audit (
  id         bigint generated always as identity primary key,
  product_id uuid not null references products(id) on delete cascade,
  action     text not null check (action in ('created', 'updated', 'deleted', 'restored')),
  changed_by text,
  -- {"field": {"from": old, "to": new}} for every field that changed; enough to undo the change.
  changes    jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index product_audit_product_idx on product_audit (product_id, created_at desc);

-- No policies: only the admin app's service_role key can read or write the history.
alter table product_audit enable row level security;

create or replace function log_product_change()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  old_row jsonb;
  new_row jsonb := to_jsonb(new);
  diff    jsonb := '{}';
  k       text;
  act     text;
begin
  if tg_op = 'INSERT' then
    act := 'created';
  else
    old_row := to_jsonb(old);
    for k in select jsonb_object_keys(new_row) loop
      -- Bookkeeping columns change on every save and would bury the real edits.
      if k not in ('updated_at', 'is_active') and old_row -> k is distinct from new_row -> k then
        diff := diff || jsonb_build_object(k, jsonb_build_object('from', old_row -> k, 'to', new_row -> k));
      end if;
    end loop;
    if diff = '{}'::jsonb then
      return new;
    end if;
    act := case
      when old.deleted_at is null and new.deleted_at is not null then 'deleted'
      when old.deleted_at is not null and new.deleted_at is null then 'restored'
      else 'updated'
    end;
  end if;

  -- The admin app names the staff member in an x-changed-by request header; keeping it off the product row keeps staff emails away from the public anon key.
  insert into public.product_audit (product_id, action, changed_by, changes)
  values (new.id, act, nullif(current_setting('request.headers', true), '')::json ->> 'x-changed-by', diff);
  return new;
end;
$$;

create trigger products_audit after insert or update on products
  for each row execute function log_product_change();
