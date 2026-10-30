import 'server-only';

// service_role bypasses RLS entirely — never import this from a 'use client' file.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and ' +
      'SUPABASE_SERVICE_ROLE_KEY in apps/admin/.env.local',
  );
}

// changedBy rides along as a request header so the history trigger can credit the change without storing staff emails on public rows.
export function createAdminClient(changedBy?: string) {
  return createClient(supabaseUrl!, serviceRoleKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: changedBy ? { headers: { 'x-changed-by': changedBy } } : undefined,
  });
}
