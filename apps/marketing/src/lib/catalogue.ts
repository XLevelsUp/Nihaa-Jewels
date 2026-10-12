// Server-only: prices are computed here so the rate and charge structure never reach the browser.

import 'server-only';

import { unstable_cache } from 'next/cache';

import { supabase } from './supabase';
import { calculatePrice, type PriceBreakdown } from './pricing';
import type { Category, Karat, ProductWithRelations } from '@/types/database';

export const GOLD_RATE_TAG = 'gold-rate';

const PRODUCT_SELECT = `
  id, sku, slug, name, description, category_id, karat,
  gross_weight_g, net_weight_g, wastage_pct,
  making_charge_type, making_charge_value,
  stone_charges, hallmark_charges,
  occasion, gender, is_active, is_featured,
  created_at, updated_at,
  category:categories ( id, slug, name ),
  images:product_images ( id, product_id, storage_path, alt_text, display_order, is_primary, created_at )
`;

const CATEGORY_SELECT = `
  id, slug, name, description, parent_id, display_order, is_active,
  meta_title, meta_description, meta_keywords,
  hero_eyebrow, hero_image_path, badge, show_in_nav,
  created_at, updated_at
`;

export interface PricedProduct extends ProductWithRelations {
  price: PriceBreakdown | null;
}

export const getCurrentRates = unstable_cache(
  async (): Promise<Record<Karat, number>> => {
    const { data, error } = await supabase
      .from('gold_rates')
      .select('karat, rate_per_gram, effective_from')
      .lte('effective_from', new Date().toISOString())
      .order('effective_from', { ascending: false });

    if (error) throw new Error(`Failed to load gold rates: ${error.message}`);

    const rates = {} as Record<Karat, number>;
    for (const row of data ?? []) {
      if (!(row.karat in rates)) rates[row.karat as Karat] = Number(row.rate_per_gram);
    }
    return rates;
  },
  ['current-gold-rates'],
  { tags: [GOLD_RATE_TAG], revalidate: 3600 },
);

function withPrice(product: ProductWithRelations, rates: Record<Karat, number>): PricedProduct {
  const rate = rates[product.karat];
  if (!rate) return { ...product, price: null };

  return {
    ...product,
    price: calculatePrice(
      {
        netWeightG: Number(product.net_weight_g),
        karat: product.karat,
        wastagePct: Number(product.wastage_pct),
        makingChargeType: product.making_charge_type,
        makingChargeValue: Number(product.making_charge_value),
        stoneCharges: Number(product.stone_charges),
        hallmarkCharges: Number(product.hallmark_charges),
      },
      rate,
    ),
  };
}

function normalise(row: Record<string, unknown>): ProductWithRelations {
  const category = row.category;
  return {
    ...row,
    category: Array.isArray(category) ? (category[0] ?? null) : category,
    images: [...((row.images as ProductWithRelations['images']) ?? [])].sort(
      (a, b) => Number(b.is_primary) - Number(a.is_primary) || a.display_order - b.display_order,
    ),
  } as ProductWithRelations;
}

export interface ProductFilters {
  categorySlug?: string;
  /** Parent plus children, so a category page includes its sub-categories. */
  categoryIds?: string[];
  karat?: Karat;
  gender?: string;
  occasion?: string;
  minPrice?: number;
  maxPrice?: number;
  featuredOnly?: boolean;
  limit?: number;
}

export async function getProducts(filters: ProductFilters = {}): Promise<PricedProduct[]> {
  let query = supabase.from('products').select(PRODUCT_SELECT).eq('is_active', true);

  // A parent category shows its own products plus everything in its children,
  // so /collections/rings still lists engagement rings.
  if (filters.categoryIds?.length) {
    query = query.in('category_id', filters.categoryIds);
  } else if (filters.categorySlug) {
    query = query.eq('categories.slug', filters.categorySlug);
  }

  if (filters.karat) query = query.eq('karat', filters.karat);
  // Unisex pieces suit everyone, so they belong in the women's and men's results
  // too — an exact match would hide them from both.
  if (filters.gender) {
    query =
      filters.gender === 'women' || filters.gender === 'men'
        ? query.in('gender', [filters.gender, 'unisex'])
        : query.eq('gender', filters.gender);
  }
  if (filters.occasion) query = query.contains('occasion', [filters.occasion]);
  if (filters.featuredOnly) query = query.eq('is_featured', true);

  query = query.order('created_at', { ascending: false });
  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw new Error(`Failed to load products: ${error.message}`);

  const rates = await getCurrentRates();
  let priced = (data ?? []).map((row) => withPrice(normalise(row), rates));

  // Price is computed from today's rate rather than stored, so it cannot be a
  // database filter — it is applied after pricing.
  if (filters.minPrice != null || filters.maxPrice != null) {
    priced = priced.filter((p) => {
      if (!p.price) return false;
      if (filters.minPrice != null && p.price.total < filters.minPrice) return false;
      if (filters.maxPrice != null && p.price.total > filters.maxPrice) return false;
      return true;
    });
  }

  return priced;
}

/** A category plus its children, so a parent page can list descendant products. */
export async function getCategoryWithChildren(
  slug: string,
): Promise<{ category: Category; children: Category[] } | null> {
  const category = await getCategoryBySlug(slug);
  if (!category) return null;

  const { data, error } = await supabase
    .from('categories')
    .select(CATEGORY_SELECT)
    .eq('parent_id', category.id)
    .eq('is_active', true)
    .order('display_order');

  if (error) throw new Error(`Failed to load sub-categories: ${error.message}`);
  return { category, children: (data ?? []) as Category[] };
}

export async function getProductBySlug(slug: string): Promise<PricedProduct | null> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw new Error(`Failed to load product "${slug}": ${error.message}`);
  if (!data) return null;

  const rates = await getCurrentRates();
  return withPrice(normalise(data), rates);
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select(CATEGORY_SELECT)
    .eq('is_active', true)
    .order('display_order');

  if (error) throw new Error(`Failed to load categories: ${error.message}`);
  return (data ?? []) as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select(CATEGORY_SELECT)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw new Error(`Failed to load category "${slug}": ${error.message}`);
  return (data as Category) ?? null;
}

export const NAV_TAG = 'navigation';

export interface NavCategory {
  slug: string;
  name: string;
  description: string | null;
  badge: string | null;
  heroImagePath: string | null;
}

export const getNavCategories = unstable_cache(
  async (): Promise<NavCategory[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('slug, name, description, badge, hero_image_path, display_order')
      .eq('is_active', true)
      .eq('show_in_nav', true)
      .is('parent_id', null)
      .order('display_order');

    // The menu must never take the site down; an empty menu is survivable.
    if (error) {
      console.error('[nav] Failed to load categories:', error.message);
      return [];
    }

    return (data ?? []).map((c) => ({
      slug: c.slug,
      name: c.name,
      description: c.description,
      badge: c.badge,
      heroImagePath: c.hero_image_path,
    }));
  },
  ['nav-categories'],
  { tags: [NAV_TAG], revalidate: 3600 },
);

export interface NavSubCategory {
  slug: string;
  name: string;
  parentSlug: string;
}

export const getSubCategories = unstable_cache(
  async (): Promise<NavSubCategory[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('slug, name, display_order, parent:parent_id ( slug )')
      .not('parent_id', 'is', null)
      .eq('is_active', true)
      .order('display_order');

    if (error) {
      console.error('[nav] Failed to load sub-categories:', error.message);
      return [];
    }

    return (data ?? [])
      .map((c) => {
        const parent = Array.isArray(c.parent) ? c.parent[0] : c.parent;
        return parent ? { slug: c.slug, name: c.name, parentSlug: parent.slug } : null;
      })
      .filter((c): c is NavSubCategory => c !== null);
  },
  ['nav-subcategories'],
  { tags: [NAV_TAG], revalidate: 3600 },
);

/** Occasions actually present per category, so the menu never offers a filter
 *  that would return nothing. */
export const getCategoryOccasions = unstable_cache(
  async (): Promise<Record<string, string[]>> => {
    const { data, error } = await supabase
      .from('products')
      .select('occasion, category:categories ( slug )')
      .eq('is_active', true);

    if (error) {
      console.error('[nav] Failed to load category occasions:', error.message);
      return {};
    }

    const map: Record<string, Set<string>> = {};
    for (const row of data ?? []) {
      const cat = Array.isArray(row.category) ? row.category[0] : row.category;
      if (!cat?.slug) continue;
      map[cat.slug] ??= new Set();
      for (const o of (row.occasion as string[]) ?? []) map[cat.slug].add(o);
    }

    return Object.fromEntries(Object.entries(map).map(([k, v]) => [k, [...v].sort()]));
  },
  ['category-occasions'],
  { tags: [NAV_TAG], revalidate: 3600 },
);
