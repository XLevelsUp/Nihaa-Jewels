-- Silver and diamond jewellery: each product gets a metal (gold with karat, or silver with purity), optional certified-diamond details and a price-on-request flag; silver gets its own daily rate table, and existing gold products are unchanged.

create type metal_t as enum ('gold', 'silver');
create type silver_purity_t as enum ('925', '999');

alter table products
  add column metal         metal_t not null default 'gold',
  add column silver_purity silver_purity_t;

alter table products alter column karat drop not null;

alter table products add constraint products_metal_purity_check check (
  (metal = 'gold'   and karat is not null and silver_purity is null) or
  (metal = 'silver' and silver_purity is not null and karat is null)
);

comment on column products.metal is 'gold or silver. Gold products use karat; silver products use silver_purity.';
comment on column products.silver_purity is '925 = sterling silver, 999 = fine silver. Null for gold.';

create index products_metal_idx on products (metal) where deleted_at is null;

alter table products
  add column has_diamond        boolean not null default false,
  add column diamond_carat      numeric(7,3) check (diamond_carat > 0),
  add column diamond_count      integer      check (diamond_count > 0),
  add column diamond_clarity    text,
  add column diamond_colour     text,
  add column diamond_cut        text,
  add column certificate_lab    text,
  add column certificate_number text,
  add column diamond_value      numeric(12,2) check (diamond_value >= 0),
  add column price_on_request   boolean not null default false;

alter table products add constraint products_diamond_fields_check check (
  has_diamond or (
    diamond_carat is null and diamond_count is null and diamond_clarity is null and diamond_colour is null
    and diamond_cut is null and certificate_lab is null and certificate_number is null and diamond_value is null
  )
);

comment on column products.has_diamond is 'True for diamond pieces. When false, every diamond_* and certificate_* column must be empty.';
comment on column products.diamond_carat is 'Total diamond weight in carats for the whole piece.';
comment on column products.certificate_lab is 'Lab that certified the diamonds, as printed on the certificate. Entered by staff; never assumed.';
comment on column products.diamond_value is 'Rupee value of the diamonds, added to the metal price when price_on_request is off.';
comment on column products.price_on_request is 'Hides the price and breakdown on the website and shows "Price on request" instead. Used for diamond pieces for now.';

create unique index products_certificate_unique
  on products (certificate_lab, certificate_number)
  where certificate_number is not null and deleted_at is null;

create table silver_rates (
  id             uuid primary key default gen_random_uuid(),
  purity         silver_purity_t not null,
  rate_per_gram  numeric(10,2)   not null check (rate_per_gram > 0),
  source         rate_source_t   not null default 'manual',
  effective_from timestamptz     not null default now(),
  note           text,
  created_by     uuid references auth.users(id) on delete set null,
  created_at     timestamptz     not null default now()
);

comment on table silver_rates is 'Append-only silver rate history, entered daily by staff. Never UPDATE; insert a new row instead. Public read; staff write via the admin service_role key.';

create index silver_rates_purity_effective_idx on silver_rates (purity, effective_from desc);

alter table silver_rates enable row level security;

create policy "public reads silver rates"
  on silver_rates for select
  to anon, authenticated
  using (true);
