-- 20260921000001_catalogue_schema
-- ═══════════════════════════════════════════════════════════════════════
-- Nihaa Jewels — e-catalogue core schema
--
-- Showcase catalogue, not a storefront: there is no cart, no checkout and
-- no online payment. Every product's call to action is booking an
-- appointment to visit the Coimbatore shop. Prices shown are INDICATIVE
-- estimates computed live from the day's gold rate — they are not offers.
-- ═══════════════════════════════════════════════════════════════════════

-- ─── Enums ─────────────────────────────────────────────────────────────
-- Karat is an enum, not an int: only these three purities are ever sold,
-- and it keeps the gold_rates ↔ products join honest.
create type karat_t as enum ('18K', '22K', '24K');

-- How a product's making charge is calculated. Jewellers vary this per
-- piece, so it cannot be a single global setting.
create type making_charge_t as enum ('per_gram', 'flat', 'percentage');

create type rate_source_t as enum ('api', 'manual');

create type appointment_status_t as enum ('new', 'confirmed', 'completed', 'cancelled');


-- ─── categories ────────────────────────────────────────────────────────
create table categories (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  description   text,
  -- Self-reference allows Rings → Engagement Rings without a second table.
  parent_id     uuid references categories(id) on delete set null,
  display_order integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table categories is 'Catalogue categories; self-referencing for one level of sub-categories.';


-- ─── products ──────────────────────────────────────────────────────────
create table products (
  id          uuid primary key default gen_random_uuid(),
  sku         text not null unique,
  slug        text not null unique,
  name        text not null,
  description text,
  category_id uuid not null references categories(id) on delete restrict,

  karat karat_t not null,

  -- gross = with stones; net = gold only. Pricing uses NET, because the
  -- customer must not be charged the gold rate for the weight of a stone.
  gross_weight_g numeric(10,3) not null check (gross_weight_g > 0),
  net_weight_g   numeric(10,3) not null check (net_weight_g   > 0),

  -- Wastage is per-product: intricate temple work wastes far more metal
  -- than a plain band.
  wastage_pct numeric(5,2) not null default 0 check (wastage_pct >= 0 and wastage_pct <= 100),

  making_charge_type  making_charge_t not null default 'per_gram',
  making_charge_value numeric(10,2)   not null default 0 check (making_charge_value >= 0),

  stone_charges   numeric(12,2) not null default 0 check (stone_charges   >= 0),
  hallmark_charges numeric(12,2) not null default 0 check (hallmark_charges >= 0),

  -- Merchandising / filtering
  occasion    text[] not null default '{}',   -- e.g. {wedding,daily-wear}
  gender      text,                            -- women | men | unisex | kids
  is_active   boolean not null default true,
  is_featured boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Net gold weight can never exceed the total weight of the piece.
  constraint net_not_over_gross check (net_weight_g <= gross_weight_g)
);

comment on column products.net_weight_g is 'Pure gold weight, excluding stones. This — not gross — drives the metal cost.';

create index products_category_idx on products (category_id) where is_active;
create index products_featured_idx on products (is_featured)  where is_active;
create index products_karat_idx    on products (karat)        where is_active;


-- ─── product_images ────────────────────────────────────────────────────
create table product_images (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references products(id) on delete cascade,
  storage_path  text not null,          -- path within the Supabase Storage bucket
  alt_text      text not null default '',  -- required for a11y + image SEO
  display_order integer not null default 0,
  is_primary    boolean not null default false,
  created_at    timestamptz not null default now()
);

-- At most one primary image per product — enforced in the DB rather than
-- hoped for in the admin UI.
create unique index product_images_one_primary
  on product_images (product_id) where is_primary;

create index product_images_product_idx on product_images (product_id);


-- ─── gold_rates ────────────────────────────────────────────────────────
-- APPEND-ONLY. Never UPDATE a row here.
--
-- A manual override inserts a new row with source='manual'; the current
-- rate is simply the newest effective_from for that karat. This gives a
-- free audit trail, so "what did we quote on the 14th?" is answerable
-- when a customer walks in citing an old price.
create table gold_rates (
  id             uuid primary key default gen_random_uuid(),
  karat          karat_t       not null,
  rate_per_gram  numeric(10,2) not null check (rate_per_gram > 0),
  source         rate_source_t not null,
  effective_from timestamptz   not null default now(),
  note           text,          -- why an override was made
  created_by     uuid references auth.users(id) on delete set null,
  created_at     timestamptz   not null default now()
);

comment on table gold_rates is 'Append-only rate history. Never UPDATE; insert a new row instead.';

-- The hot path: "latest rate for this karat".
create index gold_rates_karat_effective_idx
  on gold_rates (karat, effective_from desc);


-- ─── appointments ──────────────────────────────────────────────────────
-- Holds customer PII (name, phone, email). RLS below makes this
-- INSERT-only for the public — see the note there.
create table appointments (
  id         uuid primary key default gen_random_uuid(),
  -- Nullable: a customer may book a general visit, not tied to a product.
  -- set null on delete so removing a product never destroys the booking.
  product_id uuid references products(id) on delete set null,

  name  text not null check (length(trim(name)) > 0),
  phone text not null check (length(trim(phone)) > 0),
  email text,

  preferred_date date not null,
  preferred_slot text not null,   -- e.g. 'morning' | 'afternoon' | 'evening'
  notes          text,

  status appointment_status_t not null default 'new',

  -- Snapshot of the indicative price quoted at booking time. Without this
  -- there is no record of what the customer was shown, since the live
  -- price moves with the gold rate every day.
  quoted_price numeric(12,2),
  quoted_at    timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index appointments_status_idx on appointments (status, created_at desc);


-- ─── updated_at maintenance ────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger
language plpgsql
-- Empty search_path: without this, a role with CREATE on a schema earlier
-- in the path could shadow a function this trigger calls.
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger categories_updated_at   before update on categories
  for each row execute function set_updated_at();
create trigger products_updated_at     before update on products
  for each row execute function set_updated_at();
create trigger appointments_updated_at before update on appointments
  for each row execute function set_updated_at();


-- 20260921000002_rls_policies
-- ═══════════════════════════════════════════════════════════════════════
-- Row Level Security
--
-- The marketing site ships the anon key to every visitor's browser. That
-- key is not a secret and is not a password — THESE POLICIES are the only
-- thing protecting the data. Treat any change here as a security change.
--
-- Shape:
--   anon  → read active catalogue rows; insert appointments; read nothing else
--   staff → full access, via the service_role key (admin app only)
--
-- service_role bypasses RLS entirely, so no policy below applies to it.
-- ═══════════════════════════════════════════════════════════════════════

alter table categories     enable row level security;
alter table products       enable row level security;
alter table product_images enable row level security;
alter table gold_rates     enable row level security;
alter table appointments   enable row level security;


-- ─── Public catalogue reads ────────────────────────────────────────────
-- Only ACTIVE rows. A product toggled inactive in admin disappears from
-- the public site immediately, without being deleted.

create policy "public reads active categories"
  on categories for select
  to anon, authenticated
  using (is_active);

create policy "public reads active products"
  on products for select
  to anon, authenticated
  using (is_active);

-- An image is visible only if its parent product is. Without the exists()
-- check, images of an unpublished product would leak.
create policy "public reads images of active products"
  on product_images for select
  to anon, authenticated
  using (
    exists (
      select 1 from products p
      where p.id = product_images.product_id
        and p.is_active
    )
  );

-- Rates are public by nature — jewellers display the day's rate openly,
-- and the price breakdown on each product page shows it anyway.
create policy "public reads gold rates"
  on gold_rates for select
  to anon, authenticated
  using (true);


-- ─── Appointments: INSERT only ─────────────────────────────────────────
-- Deliberately NO select policy for anon.
--
-- This table holds customer names, phone numbers and emails. With a read
-- policy, anyone could take the public anon key from the JS bundle and
-- enumerate every customer who ever booked. Write-only is the whole point.
--
-- The consequence: the booking form cannot read back the row it just
-- created. That is intended — the confirmation UI is rendered from what
-- the customer typed, not from a round-trip.

create policy "public may request an appointment"
  on appointments for insert
  to anon, authenticated
  with check (
    -- Cannot self-assign a status; every booking starts as 'new' and only
    -- staff move it forward.
    status = 'new'
    -- No booking in the past. Cheap guard against junk rows.
    and preferred_date >= current_date
  );

-- Staff read/update appointments through the admin app's service_role
-- key, which bypasses RLS. No policy needed for that path.


-- 20260922000001_dynamic_categories_and_blog
-- ═══════════════════════════════════════════════════════════════════════
-- Dynamic categories, storage for product images, and the blog table.
--
-- Categories become fully staff-managed: adding one in admin creates its
-- public page immediately, with no deploy. That means the SEO text which
-- used to live in each hardcoded page.tsx has to live here instead.
--
-- blog_posts ships now although its UI is a later pass — adding the table
-- while the database is still empty is free, whereas migrating a live
-- database later is not.
-- ═══════════════════════════════════════════════════════════════════════

-- ─── Per-category SEO + presentation ───────────────────────────────────
-- Seeded below with the exact copy from the pages being replaced, so no
-- hand-tuned keyword text is lost in the move to a dynamic route.
alter table categories
  add column meta_title       text,
  add column meta_description text,
  add column meta_keywords    text[] not null default '{}',
  -- Editorial copy for the top of the collection page.
  add column hero_eyebrow     text,
  add column hero_image_path  text;

comment on column categories.meta_title is
  'Overrides the generated <title>. Falls back to "<name> | Nihaa Jewels".';


-- Nihaa SEO backfill removed: those slugs do not exist here.

-- ─── Blog ──────────────────────────────────────────────────────────────
-- Table only; the editor and public pages are a later pass.
create table blog_posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  excerpt       text,
  -- Markdown. Rendered server-side, and must be sanitised on the way out:
  -- staff are trusted, but a compromised admin account should not mean
  -- stored XSS on the public site.
  body          text not null default '',
  cover_image_path text,
  meta_title       text,
  meta_description text,
  meta_keywords    text[] not null default '{}',
  author_name   text,
  is_published  boolean not null default false,
  -- Nullable until first publish; drives ordering and the public filter.
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index blog_posts_published_idx
  on blog_posts (published_at desc) where is_published;

create trigger blog_posts_updated_at before update on blog_posts
  for each row execute function set_updated_at();

alter table blog_posts enable row level security;

-- Published posts only, and never one post-dated into the future.
create policy "public reads published posts"
  on blog_posts for select
  to anon, authenticated
  using (is_published and published_at is not null and published_at <= now());


-- ─── Storage: product images ───────────────────────────────────────────
-- Public bucket: product photography is meant to be seen, and a public
-- bucket serves through the CDN without signed-URL round trips.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760,  -- 10 MB; jewellery photography is detailed, but this caps abuse
  array['image/jpeg','image/png','image/webp','image/avif']
)
on conflict (id) do nothing;

create policy "public reads product images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

-- Uploads/deletes go through the admin app's service_role key, which
-- bypasses RLS. No anon write policy — deliberately.


-- 20260924000001_appointment_staff_notes
-- appointments.notes is the customer's message; staff need a separate place to record call outcomes.
alter table appointments
  add column staff_notes text;

comment on column appointments.staff_notes is
  'Internal only. Never exposed to the public site — appointments has no anon SELECT policy.';


-- 20260925000001_category_nav_fields
-- The public navigation reads categories directly, so the badge and menu-visibility
-- it displays have to be staff-editable like everything else about a category.

alter table categories
  add column badge text,
  add column show_in_nav boolean not null default true;

comment on column categories.badge is
  'Short label shown on the mega-menu card, e.g. NEW ARRIVAL. Null hides it.';
comment on column categories.show_in_nav is
  'A category can be live at its own URL without appearing in the main menu.';



-- 20261012000001_sakthi_initial_rates
-- Placeholder rates, not confirmed for Sakthi: without one row per karat every product shows "Price on enquiry".
insert into gold_rates (karat, rate_per_gram, source, note) values
  ('22K', 7250.00, 'manual', 'Placeholder — confirm with client before launch'),
  ('18K', 5930.00, 'manual', 'Placeholder — confirm with client before launch'),
  ('24K', 7910.00, 'manual', 'Placeholder — confirm with client before launch');




-- 20261020000001_product_discount
-- Per-product discount, applied to wastage and making only (never the gold value), with GST charged on the discounted amount, as GRT and the large jewellers do.

alter table products
  add column discount_pct numeric(5,2) not null default 0
    check (discount_pct >= 0 and discount_pct <= 100);

comment on column products.discount_pct is
  'Percent off wastage + making charges. 0 = no offer. The site shows the original price struck through and "N% Off".';


-- 20261020000002_discount_type
-- A discount can now be a percentage or a flat rupee amount, both taken off wastage + making only; discount_pct becomes discount_value.

create type discount_t as enum ('percentage', 'flat');

alter table products rename column discount_pct to discount_value;
alter table products drop constraint if exists products_discount_pct_check;
-- Wider than numeric(5,2), which tops out below ₹1,000 and could not hold a flat amount.
alter table products alter column discount_value type numeric(12,2);
alter table products add column discount_type discount_t not null default 'percentage';

alter table products add constraint products_discount_check
  check (discount_value >= 0 and (discount_type = 'flat' or discount_value <= 100));

comment on column products.discount_value is
  'Percent (discount_type = percentage) or rupees (flat) off wastage + making. 0 = no offer. A flat amount larger than wastage + making is capped at it.';


-- 20261021000001_admin_phase1
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


-- 20261022000001_staff_roles
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
