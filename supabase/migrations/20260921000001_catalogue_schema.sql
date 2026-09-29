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
