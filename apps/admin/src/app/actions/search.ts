'use server';

// Backs the Ctrl+K search: products by name, SKU or HUID and bookings by customer name or phone, a few of each.

import { createAdminClient } from '@/lib/supabase-server';
import { getCurrentUser } from '@/lib/supabase-auth';

export interface SearchHit {
  kind: 'product' | 'booking';
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

export async function globalSearch(raw: string): Promise<SearchHit[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  // PostgREST filter syntax treats commas and brackets as separators, so they are stripped from the term.
  const q = raw.trim().replace(/[,()*%]/g, ' ').trim();
  if (q.length < 2) return [];
  const term = `%${q}%`;
  const digits = q.replace(/\D/g, '');

  const supabase = createAdminClient();
  const [products, bookings] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, sku, huid, status, category:categories ( name )')
      .is('deleted_at', null)
      .or(`name.ilike.${term},sku.ilike.${term},huid.ilike.${term}`)
      .order('updated_at', { ascending: false })
      .limit(6),
    supabase
      .from('appointments')
      .select('id, name, phone, preferred_date, status')
      .or(digits.length >= 4 ? `name.ilike.${term},phone.ilike.%${digits}%` : `name.ilike.${term}`)
      .order('preferred_date', { ascending: false })
      .limit(5),
  ]);

  const productHits: SearchHit[] = (products.data ?? []).map((p) => {
    const category = Array.isArray(p.category) ? p.category[0] : p.category;
    return {
      kind: 'product',
      id: p.id,
      title: p.name,
      subtitle: [p.sku, p.huid && `HUID ${p.huid}`, (category as { name?: string } | null)?.name, p.status].filter(Boolean).join(' · '),
      href: `/products/${p.id}`,
    };
  });

  const bookingHits: SearchHit[] = (bookings.data ?? []).map((b) => ({
    kind: 'booking',
    id: b.id,
    title: b.name,
    subtitle: `${b.phone} · ${new Date(`${b.preferred_date}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · ${b.status}`,
    href: `/appointments?q=${encodeURIComponent(b.phone)}`,
  }));

  return [...productHits, ...bookingHits];
}
