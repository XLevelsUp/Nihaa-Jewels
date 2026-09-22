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
