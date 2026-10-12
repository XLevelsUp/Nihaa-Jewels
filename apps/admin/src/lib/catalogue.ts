import 'server-only';

// Admin reads include inactive rows, unlike the public site which sees only is_active.

import { createAdminClient } from './supabase-server';
import type { Category, Product, ProductImage } from '@/types/database';

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

export async function listProducts(search?: string): Promise<ProductRow[]> {
  const supabase = createAdminClient();
  let query = supabase.from('products').select(PRODUCT_SELECT);

  if (search?.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(`name.ilike.${term},sku.ilike.${term}`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw new Error(`Failed to load products: ${error.message}`);
  return (data ?? []).map(normalise);
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
  const { data, error } = await supabase.from('products').select('category_id');
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
