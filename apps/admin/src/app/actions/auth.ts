'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

import { createAuthClient } from '@/lib/supabase-auth';

// No signup action by design — staff accounts are created in the Supabase dashboard.

const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
});

export interface LoginResult {
  ok: boolean;
  message: string;
}

export async function login(formData: FormData): Promise<LoginResult> {
  const parsed = loginSchema.safeParse({
    email: (formData.get('email') as string) ?? '',
    password: (formData.get('password') as string) ?? '',
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check your details.' };
  }

  const supabase = await createAuthClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    // Deliberately vague: distinguishing "no such user" from "wrong password" lets someone enumerate staff accounts.
    return { ok: false, message: 'Incorrect email or password.' };
  }

  return { ok: true, message: 'Signed in.' };
}

export async function logout() {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect('/login');
}
