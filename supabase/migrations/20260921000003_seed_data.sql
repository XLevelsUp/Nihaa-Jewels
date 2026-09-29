-- ═══════════════════════════════════════════════════════════════════════
-- Seed data — categories, an opening gold rate, and sample products.
--
-- Categories and the rate are real and should stay. The PRODUCTS are
-- placeholders for development, using the existing /images/*.webp files:
-- weights, wastage and making charges are plausible but INVENTED.
-- Replace them with the client's real catalogue before going live.
-- ═══════════════════════════════════════════════════════════════════════

-- ─── Categories ────────────────────────────────────────────────────────
-- Slugs match the existing route folders under src/app/collections/.
insert into categories (slug, name, description, display_order) values
  ('rings',      'Rings',            'Statement pieces in gold & diamond',      1),
  ('necklaces',  'Necklaces',        'Graceful layers for every occasion',      2),
  ('earrings',   'Earrings',         'From studs to chandelier drops',          3),
  ('bangles',    'Bangles',          'Traditional and contemporary bangles',    4),
  ('bridal',     'Bridal',           'Crafted for your forever moment',         5),
  ('temple',     'Temple Jewellery', 'Sacred heritage, modern form',            6),
  ('daily-wear', 'Daily Wear',       'Lightweight pieces for every day',        7);


-- ─── Opening gold rates ────────────────────────────────────────────────
-- Manual seed so the catalogue prices something from day one. Staff
-- override these from the admin panel; the API job takes over in Phase 2.
-- Indicative Coimbatore retail rates — CONFIRM WITH THE CLIENT.
insert into gold_rates (karat, rate_per_gram, source, note) values
  ('22K', 7250.00, 'manual', 'Seed rate — confirm with client before launch'),
  ('18K', 5930.00, 'manual', 'Seed rate — confirm with client before launch'),
  ('24K', 7910.00, 'manual', 'Seed rate — confirm with client before launch');


-- ─── Sample products (development placeholders) ────────────────────────
insert into products (
  sku, slug, name, description, category_id, karat,
  gross_weight_g, net_weight_g, wastage_pct,
  making_charge_type, making_charge_value,
  stone_charges, hallmark_charges, occasion, gender, is_featured
)
select * from (values
  ('NJ-RNG-001', 'classic-gold-band', 'Classic Gold Band',
   'A timeless 22K band, hand-finished to a soft lustre. Equally at home as a wedding ring or an everyday piece.',
   (select id from categories where slug = 'rings'), '22K'::karat_t,
   8.500, 8.500, 10.00, 'per_gram'::making_charge_t, 600.00,
   0.00, 45.00, array['wedding','daily-wear'], 'unisex', true),

  ('NJ-RNG-002', 'solitaire-engagement-ring', 'Solitaire Engagement Ring',
   'An 18K setting cradling a single IGI-certified brilliant. Understated, and made to be looked at closely.',
   (select id from categories where slug = 'rings'), '18K'::karat_t,
   6.200, 4.800, 12.00, 'percentage'::making_charge_t, 14.00,
   125000.00, 45.00, array['wedding','engagement'], 'women', true),

  ('NJ-NCK-001', 'royal-nizam-necklace', 'The Royal Nizam Necklace',
   'A tribute to regal heritage — layered 22K goldwork with hand-set stones across the collar.',
   (select id from categories where slug = 'necklaces'), '22K'::karat_t,
   48.750, 42.300, 14.00, 'per_gram'::making_charge_t, 850.00,
   185000.00, 45.00, array['wedding','festive'], 'women', true),

  ('NJ-EAR-001', 'legacy-jhumkas', 'Legacy Jhumkas',
   'Temple-form jhumkas in 22K gold, with the bell profile and granulation of traditional South Indian work.',
   (select id from categories where slug = 'earrings'), '22K'::karat_t,
   18.400, 17.900, 16.00, 'per_gram'::making_charge_t, 720.00,
   0.00, 45.00, array['festive','wedding'], 'women', true),

  ('NJ-EAR-002', 'everyday-gold-studs', 'Everyday Gold Studs',
   'Feather-light 18K studs, designed to be put on once and forgotten about.',
   (select id from categories where slug = 'earrings'), '18K'::karat_t,
   2.400, 2.400, 8.00, 'flat'::making_charge_t, 2200.00,
   0.00, 45.00, array['daily-wear','office'], 'women', false),

  ('NJ-BNG-001', 'temple-work-bangles', 'Temple Work Bangles',
   'A matched pair in 22K, worked with deity motifs in the Nagercoil tradition.',
   (select id from categories where slug = 'bangles'), '22K'::karat_t,
   62.000, 60.500, 15.00, 'per_gram'::making_charge_t, 780.00,
   0.00, 45.00, array['wedding','festive'], 'women', true),

  ('NJ-BNG-002', 'slim-daily-bangles', 'Slim Daily Bangles',
   'Set of four slim 22K bangles, light enough to wear from desk to dinner.',
   (select id from categories where slug = 'daily-wear'), '22K'::karat_t,
   24.000, 24.000, 9.00, 'per_gram'::making_charge_t, 520.00,
   0.00, 45.00, array['daily-wear','office'], 'women', false),

  ('NJ-BRD-001', 'bridal-trousseau-set', 'Complete Bridal Trousseau',
   'Necklace, jhumkas, bangles and maang tikka in matched 22K goldwork. Commissioned as a set.',
   (select id from categories where slug = 'bridal'), '22K'::karat_t,
   142.500, 128.000, 16.00, 'per_gram'::making_charge_t, 920.00,
   340000.00, 45.00, array['wedding'], 'women', true)
) as t(sku, slug, name, description, category_id, karat, gross_weight_g, net_weight_g,
       wastage_pct, making_charge_type, making_charge_value, stone_charges,
       hallmark_charges, occasion, gender, is_featured);


-- ─── Sample images ─────────────────────────────────────────────────────
-- Points at the existing files in apps/marketing/public/images/ so the UI
-- has something to render before real photography and Storage uploads
-- exist. Phase 7 replaces these with uploaded Storage paths.
insert into product_images (product_id, storage_path, alt_text, display_order, is_primary)
select p.id, i.path, i.alt, 0, true
from (values
  ('classic-gold-band',         '/images/rings.webp',        'Classic 22K gold band by Nihaa Jewels, Coimbatore'),
  ('solitaire-engagement-ring', '/images/rings2.webp',       'IGI certified solitaire engagement ring in 18K gold'),
  ('royal-nizam-necklace',      '/images/necklace1.webp',    'The Royal Nizam 22K gold and diamond necklace'),
  ('legacy-jhumkas',            '/images/earring1.webp',     'Traditional 22K gold temple jhumkas'),
  ('everyday-gold-studs',       '/images/earring2.webp',     'Lightweight 18K gold everyday stud earrings'),
  ('temple-work-bangles',       '/images/bangles1.webp',     'Pair of 22K gold temple work bangles'),
  ('slim-daily-bangles',        '/images/bracelet2.webp',    'Set of four slim 22K gold daily wear bangles'),
  ('bridal-trousseau-set',      '/images/bridaljewel.webp',  'Complete 22K gold bridal trousseau set')
) as i(slug, path, alt)
join products p on p.slug = i.slug;
