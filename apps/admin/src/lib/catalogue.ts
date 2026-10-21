import 'server-only';

// Admin reads include inactive rows, unlike the public site which sees only is_active.

import { createAdminClient } from './supabase-server';
import type { Category, Product, ProductAudit, ProductImage, ProductStatus } from '@/types/database';

export interface ProductRow extends Product {
  category: Pick<Category, 'id' | 'slug' | 'name'> | null;
  images: ProductImage[];
}

const PRODUCT_SELECT = `
  *,
  category:categories ( id, slug, name ),
  images:product_images ( id, product_id, storage_path, alt_text, display_order, is_primary, created_at )
`;

function normalise(row: Record<string, unknown>): ProductRow {
  const category = row.category;
  return {
    ...row,
    category: Array.isArray(category) ? (category[0] ?? null) : category,
    images: [...((row.images as ProductImage[]) ?? [])].sort(
      (a, b) => Number(b.is_primary) - Number(a.is_primary) || a.display_order - b.display_order,
    ),
  } as ProductRow;
}

export type ProductView = 'all' | ProductStatus | 'deleted';

export interface ProductListFilters {
  search?: string;
  view?: ProductView;
  /** A collection and its sub-collections. */
  categoryIds?: string[];
  colour?: 'yellow' | 'rose' | 'white' | 'none';
  karat?: string;
  discount?: 'with' | 'without';
  /** Data-quality views the dashboard links to. */
  missing?: 'photo' | 'huid' | 'stale-draft';
}

export const STALE_DRAFT_DAYS = 7;

export async function listProducts({ search, view = 'all', categoryIds, colour, karat, discount, missing }: ProductListFilters = {}): Promise<ProductRow[]> {
  const supabase = createAdminClient();
  let query = supabase.from('products').select(PRODUCT_SELECT);

  // Deleted products live only in their own tab, so they never clutter the everyday list.
  query = view === 'deleted' ? query.not('deleted_at', 'is', null) : query.is('deleted_at', null);
  if (view !== 'all' && view !== 'deleted') query = query.eq('status', view);

  if (categoryIds?.length) query = query.in('category_id', categoryIds);
  if (colour) query = colour === 'none' ? query.is('metal_colour', null) : query.eq('metal_colour', colour);
  if (karat) query = query.eq('karat', karat);
  if (discount) query = discount === 'with' ? query.gt('discount_value', 0) : query.eq('discount_value', 0);
  if (missing === 'huid') query = query.is('huid', null);
  if (missing === 'stale-draft') {
    query = query.eq('status', 'draft').lt('updated_at', new Date(Date.now() - STALE_DRAFT_DAYS * 86_400_000).toISOString());
  }

  if (search?.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(`name.ilike.${term},sku.ilike.${term},huid.ilike.${term}`);
  }

  const { data, error } = await query.order('updated_at', { ascending: false });
  if (error) throw new Error(`Failed to load products: ${error.message}`);
  const rows = (data ?? []).map(normalise);
  // "No photo" depends on the related images, so it is filtered here rather than in the query.
  return missing === 'photo' ? rows.filter((p) => p.images.length === 0) : rows;
}

export interface DashboardHealth {
  publishedNoPhoto: number;
  noHuid: number;
  staleDrafts: number;
}

export async function getCatalogueHealth(): Promise<DashboardHealth> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('products')
    .select('status, huid, updated_at, images:product_images ( id )')
    .is('deleted_at', null);
  if (error) throw new Error(`Failed to check the catalogue: ${error.message}`);

  const staleBefore = Date.now() - STALE_DRAFT_DAYS * 86_400_000;
  const rows = data ?? [];
  return {
    publishedNoPhoto: rows.filter((p) => p.status === 'published' && (p.images as unknown[]).length === 0).length,
    noHuid: rows.filter((p) => p.status !== 'archived' && !p.huid).length,
    staleDrafts: rows.filter((p) => p.status === 'draft' && new Date(p.updated_at).getTime() < staleBefore).length,
  };
}

export async function countProductsByView(): Promise<Record<ProductView, number>> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('products').select('status, deleted_at');
  if (error) throw new Error(`Failed to count products: ${error.message}`);

  const counts: Record<ProductView, number> = { all: 0, draft: 0, published: 0, archived: 0, deleted: 0 };
  for (const row of data ?? []) {
    if (row.deleted_at) {
      counts.deleted += 1;
    } else {
      counts.all += 1;
      counts[row.status as ProductStatus] += 1;
    }
  }
  return counts;
}

export async function getProductHistory(productId: string): Promise<ProductAudit[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('product_audit')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw new Error(`Failed to load history: ${error.message}`);
  return (data ?? []) as ProductAudit[];
}

export async function getProduct(id: string): Promise<ProductRow | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(`Failed to load product: ${error.message}`);
  return data ? normalise(data) : null;
}

export async function listCategories(): Promise<Category[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order');

  if (error) throw new Error(`Failed to load categories: ${error.message}`);
  return (data ?? []) as Category[];
}

export async function getCategory(id: string): Promise<Category | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(`Failed to load category: ${error.message}`);
  return (data as Category) ?? null;
}

export async function getProductCountByCategory(): Promise<Map<string, number>> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('products').select('category_id').is('deleted_at', null);
  if (error) throw new Error(`Failed to count products: ${error.message}`);

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    counts.set(row.category_id, (counts.get(row.category_id) ?? 0) + 1);
  }
  return counts;
}

export async function getLatestRates(): Promise<Record<string, number>> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('gold_rates')
    .select('karat, rate_per_gram, effective_from')
    .order('effective_from', { ascending: false });

  if (error) throw new Error(`Failed to load rates: ${error.message}`);

  const rates: Record<string, number> = {};
  for (const row of data ?? []) {
    if (!(row.karat in rates)) rates[row.karat] = Number(row.rate_per_gram);
  }
  return rates;
}
