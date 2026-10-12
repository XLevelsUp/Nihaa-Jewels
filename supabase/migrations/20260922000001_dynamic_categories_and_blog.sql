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


-- ─── Backfill SEO from the replaced hardcoded pages ────────────────────
update categories set
  meta_title = 'Gold & Diamond Rings Coimbatore | Nihaa Jewels',
  meta_description = 'Discover exquisite gold rings in Coimbatore, stunning diamond rings, and engagement rings. Handcrafted with BIS hallmarked gold & IGI certified diamonds.',
  meta_keywords = array['gold rings Coimbatore','diamond rings Coimbatore','engagement ring'],
  hero_eyebrow = 'Collection',
  hero_image_path = '/images/rings.webp'
where slug = 'rings';

update categories set
  meta_title = 'Gold & Diamond Necklaces Coimbatore | Nihaa Jewels',
  meta_description = 'Explore IGI certified diamond necklaces and BIS hallmarked gold necklaces in Coimbatore. Bespoke designs crafted by four generations of goldsmiths.',
  meta_keywords = array['gold necklace Coimbatore','diamond necklace Coimbatore','bridal necklace'],
  hero_eyebrow = 'Collection',
  hero_image_path = '/images/necklace1.webp'
where slug = 'necklaces';

update categories set
  meta_title = 'Gold Earrings & Jhumkas Coimbatore | Nihaa Jewels',
  meta_description = 'Timeless gold earrings and traditional jhumkas in Coimbatore. From everyday studs to chandelier drops, in BIS hallmarked gold.',
  meta_keywords = array['gold earrings Coimbatore','jhumkas Coimbatore','diamond earrings'],
  hero_eyebrow = 'Collection',
  hero_image_path = '/images/earring1.webp'
where slug = 'earrings';

update categories set
  meta_title = 'Gold Bangles Coimbatore | Nihaa Jewels',
  meta_description = 'Traditional and contemporary gold bangles in Coimbatore. Bridal bangles, daily wear and lightweight designs in BIS hallmarked gold.',
  meta_keywords = array['gold bangles Coimbatore','bridal bangles','temple bangles'],
  hero_eyebrow = 'Collection',
  hero_image_path = '/images/bangles1.webp'
where slug = 'bangles';

update categories set
  meta_title = 'Bridal Jewellery Coimbatore | Nihaa Jewels',
  meta_description = 'Complete bridal jewellery sets in Coimbatore. Necklaces, bangles, jhumkas and mangalsutras crafted for your forever moment.',
  meta_keywords = array['bridal jewellery Coimbatore','wedding jewellery','bridal set'],
  hero_eyebrow = 'The Bridal Edit',
  hero_image_path = '/images/bridaljewel.webp'
where slug = 'bridal';

update categories set
  meta_title = 'Temple Jewellery Coimbatore | Nihaa Jewels',
  meta_description = 'Sacred heritage in modern form. Handcrafted temple jewellery in Coimbatore, made in the traditional South Indian style.',
  meta_keywords = array['temple jewellery Coimbatore','antique jewellery','traditional gold'],
  hero_eyebrow = 'Heritage',
  hero_image_path = '/images/necklace1.webp'
where slug = 'temple';

update categories set
  meta_title = 'Daily Wear Gold Jewellery Coimbatore | Nihaa Jewels',
  meta_description = 'Lightweight gold jewellery for every day. Office-friendly rings, bangles and chains in BIS hallmarked gold, Coimbatore.',
  meta_keywords = array['daily wear gold jewellery','lightweight gold','office wear jewellery'],
  hero_eyebrow = 'Everyday',
  hero_image_path = '/images/dailywear_image.webp'
where slug = 'daily-wear';


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
