// The public website's address, for "View on website" links and for previewing photos that live in its public/ folder; set NEXT_PUBLIC_SITE_URL per environment.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

// Seeded rows hold site-relative paths like /images/x.webp; uploads hold a storage key in the product-images bucket.
export function imageSrc(storagePath: string): string {
  if (storagePath.startsWith('/')) return `${SITE_URL}${storagePath}`;
  return `${SUPABASE_URL}/storage/v1/object/public/product-images/${storagePath}`;
}
