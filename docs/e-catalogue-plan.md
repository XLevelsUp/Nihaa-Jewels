# Interactive E-Catalogue — Implementation Plan

Status of the catalogue module, the decisions behind it, and what is left
to build. Updated 2026-09-22.

## What this module is

A showcase catalogue that drives footfall to the Coimbatore store.

**There is no cart, no checkout and no online payment anywhere on the
site.** Every product's call to action is *Book an Appointment*. Prices
shown are indicative estimates computed live from the day's gold rate —
they are not offers, and every surface that displays one says so.

## Confirmed decisions

| Question | Decision |
|---|---|
| Commerce model | Booking only. No cart, ever. |
| Data store | Supabase (Postgres + Storage + RLS) |
| Gold rate | Manual entry now; external API + override later |
| Categories | Fully dynamic — staff create them, no deploy needed |
| Category SEO | Stored per-category in the DB, editable in admin |
| Admin auth | Supabase Auth, email + password, no public signup |
| Product images | Uploaded to Supabase Storage from the admin form |
| Admin scope | Catalogue, categories, rates, appointments, blog |

## Architecture

```
ADMIN (:3001, staff only)          MARKETING (:3000, public)
service_role key                    anon key + RLS
        │                                   │
        ├── products ──────┐       ┌────────┤
        ├── categories ────┤       │        │
        ├── gold_rates ────┼─ DB ──┤    getProducts()
        ├── appointments ──┤       │    getCurrentRates()
        └── blog_posts ────┘       │        │
                                   │   calculatePrice()  ← server-side only
                                   │        │
                                   └──► ProductCard / detail page
                                            │
                                     Book an Appointment
                                            │
                                    appointments (insert-only)
```

Prices are computed **server-side**. The gold rate and charge structure
never reach the browser as raw data, so a customer cannot alter them in
devtools, and pages stay SEO-indexable.

## Why categories are dynamic

Each category used to be a hardcoded folder under
`src/app/collections/`. Adding "Anklets" meant a developer creating a
folder and deploying.

All seven are replaced by one dynamic route, `/collections/[category]`,
which renders any active category from the database. Staff add a category
in admin and its page exists immediately.

The hand-written SEO text from the original seven pages (targeted
keywords like "gold rings Coimbatore") is preserved — moved into
`meta_title` / `meta_description` / `meta_keywords` columns on
`categories` and seeded with the exact existing copy, so nothing is lost
and staff can tune it per category.

## Phases

### Phase 1 — Foundation ✅ DONE

- CSP fixed in `next.config.ts` (Supabase origin in `connect-src` and
  `img-src`; without this every browser call to Supabase is blocked)
- Dependencies: `@supabase/supabase-js`, `zod`, `server-only`
- Schema, RLS policies, seed data
- Pricing engine — pure, no I/O, 21 verification checks passing
- Catalogue UI: card, grid, price breakdown, rate strip
- Booking: server action + dialog + honeypot
- Product detail page at `/collections/[category]/[slug]`
- Rings collection wired to live data

### Phase A — Apply migrations + dynamic categories

1. Extra migration: SEO + hero columns on `categories`, `blog_posts`
   table, Storage bucket and policies
2. `supabase link` + `db push` **(needs the DB password — user runs this)**
3. Replace the seven hardcoded folders with `/collections/[category]`
4. `generateStaticParams` from the DB; SEO metadata per category
5. Dynamic `sitemap.ts` reading categories and products
6. Verify the build goes green

### Phase B — Admin foundation + auth

1. MUI theme, layout, navigation (admin has no UI at all today)
2. Supabase Auth email/password; middleware guarding every route
3. Server-side `service_role` client, never imported client-side
4. Dashboard: counts, today's rate, recent bookings

### Phase C — Gold rate management

1. Rate entry screen — current rate per karat, publish an override
2. Rate history table (`gold_rates` is append-only, so history is free)
3. Enforce the >5% deviation gate on manual entry too
4. `revalidateTag('gold-rate')` so a correction is live in seconds

### Phase D — Product & category CRUD

1. Product list: search, filter, toggle active
2. Product form with a **live price preview** as fields change — staff
   see the customer-facing price before saving
3. Image upload to Supabase Storage, drag-to-reorder, set primary
4. Category CRUD including the SEO fields
5. `revalidatePath()` on save, so the site updates within seconds rather
   than waiting for the hourly revalidate

### Phase E — Appointments inbox

1. List by status, with the product and the price quoted at booking time
2. Status workflow: new → confirmed → completed / cancelled
3. Staff notes

### Phase F — Blog *(table now, UI later)*

`blog_posts` ships in the Phase A migration so no second migration is
needed against a live database. Editor and public pages are a later pass.

### Phase G — Gold rate API *(blocked)*

Needs a vendor decision. See the open question below.

## Open questions

### 1. Gold rate API vendor — blocks Phase G

Free APIs return **USD spot per troy ounce**. Customers see a
**Coimbatore 22K retail rate per gram**. Converting requires USD→INR,
ounce→gram, a 24K→22K purity ratio, and a local retail margin that varies
by city and jeweller — and that last part is not derivable from spot.

The likely failure is a price that is close but wrong: a customer walks
in saying "your site said ₹7,180, the shop down the road quotes ₹7,250."
That is worse than no automation.

**Ask the client where they get their daily rate today.** Most jewellers
already have a source — an association rate, a bullion dealer's SMS. If
so, manual entry is more accurate than any API, and the rate screen in
Phase C is all that is needed.

### 2. Placeholder pricing data — MUST be confirmed before launch

Every number in `seed_data.sql` is invented:

- Rates: 22K ₹7,250/g, 18K ₹5,930/g, 24K ₹7,910/g
- All product weights, wastage percentages and making charges

These drive real customer-facing prices. Confirm every one with the
client.

### 3. Next.js security advisory

15.5.19 has a critical advisory (SSRF + Server Actions DoS). 15.5.25 is
a patch bump that clears it. Worth taking before launch, especially since
booking uses a server action.

### 4. Appointment notifications

Do staff need email or WhatsApp on a new booking, or is the inbox they
check enough? Affects Phase E.

## Conventions

- **`gold_rates` is append-only.** Never `UPDATE`. A correction inserts a
  new row; the current rate is the newest `effective_from` per karat.
  Free audit history — "what did we quote on the 14th?" is answerable.
- **`appointments` is insert-only for the public.** No select policy for
  anon, so nobody can take the public key from the JS bundle and
  enumerate customer phone numbers. The booking form cannot read back
  what it wrote, by design.
- **Pricing uses `net_weight_g`**, never gross. A customer must not be
  charged the gold rate for the weight of a stone.
- **No `offers` in product JSON-LD.** Nothing is purchasable online and
  prices move daily; advertising a fixed price would misrepresent it.
  Fabricated `aggregateRating` values were removed from the rings page
  for the same reason — they violate Google's structured-data policy.
- **Types are duplicated** between the two apps (`src/types/database.ts`).
  There is no shared package. Change one, change the other.
