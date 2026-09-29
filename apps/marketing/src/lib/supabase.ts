// Anon key only — the service_role key must never appear in this app.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and ' +
      'NEXT_PUBLIC_SUPABASE_ANON_KEY in apps/marketing/.env.local',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Seeded rows hold site-relative paths (/images/x.webp); admin uploads hold a storage key.
export function productImageUrl(storagePath: string): string {
  if (storagePath.startsWith('/') || storagePath.startsWith('http')) return storagePath;
  return supabase.storage.from('product-images').getPublicUrl(storagePath).data.publicUrl;
}
