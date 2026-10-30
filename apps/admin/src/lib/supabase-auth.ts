import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { can, deniedMessage, type Permission, type Role } from './permissions';
import { createAdminClient } from './supabase-server';

// Anon key + the user's session cookie — this is what proves who is logged in.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function createAuthClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component, where cookies are read-only; middleware refreshes them instead.
        }
      },
    },
  });
}

export interface StaffUser {
  id: string;
  email: string;
  role: Role;
}

/** Whoever holds a valid session, staff or not. */
export async function getSessionUser(): Promise<{ id: string; email: string } | null> {
  const supabase = await createAuthClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email ?? '' };
}

/** A signed-in person who is also on the staff list; anyone else gets null, so every action refuses them. */
export async function getCurrentUser(): Promise<StaffUser | null> {
  const session = await getSessionUser();
  if (!session) return null;

  const { data } = await createAdminClient().from('staff').select('role').eq('user_id', session.id).maybeSingle();
  if (!data) return null;
  return { ...session, role: data.role as Role };
}

export type Authorized = { user: StaffUser; error?: undefined } | { user?: undefined; error: string };

/** The single gate every server action passes: signed in, on the staff list, and allowed this permission. */
export async function authorize(permission: Permission): Promise<Authorized> {
  const user = await getCurrentUser();
  if (!user) return { error: 'Your session has expired or your access was removed. Please sign in again.' };
  if (!can(user.role, permission)) return { error: deniedMessage(permission) };
  return { user };
}
