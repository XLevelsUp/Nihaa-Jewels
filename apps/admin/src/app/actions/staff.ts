'use server';

// Staff accounts are created here rather than in the Supabase dashboard, so the Admin never needs a second login; there is always at least one Admin.

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { createAdminClient } from '@/lib/supabase-server';
import { authorize } from '@/lib/supabase-auth';
import type { Role } from '@/lib/permissions';
import type { ActionResult } from './products';

export interface StaffMember {
  user_id: string;
  email: string;
  role: Role;
  created_at: string;
}

const addSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'The temporary password must be at least 8 characters'),
  role: z.enum(['admin', 'manager']),
});

async function adminCount(supabase: ReturnType<typeof createAdminClient>) {
  const { count } = await supabase.from('staff').select('user_id', { count: 'exact', head: true }).eq('role', 'admin');
  return count ?? 0;
}

export async function addStaff(formData: FormData): Promise<ActionResult> {
  const auth = await authorize('staff.manage');
  if (!auth.user) return { ok: false, message: auth.error };

  const parsed = addSchema.safeParse({
    email: ((formData.get('email') as string) ?? '').trim().toLowerCase(),
    password: (formData.get('password') as string) ?? '',
    role: formData.get('role'),
  });
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, message: issue?.message ?? 'Check the details.', fieldErrors: { [String(issue?.path[0])]: issue?.message ?? '' } };
  }
  const { email, password, role } = parsed.data;

  const supabase = createAdminClient();
  const { data: created, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
  if (error || !created.user) {
    const exists = error?.message.toLowerCase().includes('already');
    return { ok: false, message: exists ? 'Someone with this email already has a login.' : 'Could not create the login. Please try again.', fieldErrors: exists ? { email: 'Already registered' } : undefined };
  }

  const { error: staffError } = await supabase.from('staff').insert({ user_id: created.user.id, email, role });
  if (staffError) {
    // Without a staff row the login would be useless, so the half-made account is removed.
    await supabase.auth.admin.deleteUser(created.user.id);
    console.error('[addStaff]', staffError);
    return { ok: false, message: 'Could not add this person. Please try again.' };
  }

  revalidatePath('/staff');
  return { ok: true, message: `${email} can now sign in as ${role === 'admin' ? 'an Admin' : 'a Manager'}. Share the temporary password with them privately.` };
}

export async function changeStaffRole(userId: string, role: Role): Promise<ActionResult> {
  const auth = await authorize('staff.manage');
  if (!auth.user) return { ok: false, message: auth.error };
  if (userId === auth.user.id) return { ok: false, message: 'You cannot change your own role. Ask another Admin.' };

  const supabase = createAdminClient();
  if (role === 'manager') {
    const { data: target } = await supabase.from('staff').select('role').eq('user_id', userId).maybeSingle();
    if (target?.role === 'admin' && (await adminCount(supabase)) <= 1) {
      return { ok: false, message: 'There must always be at least one Admin.' };
    }
  }

  const { error } = await supabase.from('staff').update({ role }).eq('user_id', userId);
  if (error) {
    console.error('[changeStaffRole]', error);
    return { ok: false, message: 'Could not change the role.' };
  }

  revalidatePath('/staff');
  return { ok: true, message: `Role changed to ${role === 'admin' ? 'Admin' : 'Manager'}. It applies from their next click.` };
}

export async function removeStaff(userId: string): Promise<ActionResult> {
  const auth = await authorize('staff.manage');
  if (!auth.user) return { ok: false, message: auth.error };
  if (userId === auth.user.id) return { ok: false, message: 'You cannot remove yourself. Ask another Admin.' };

  const supabase = createAdminClient();
  const { data: target } = await supabase.from('staff').select('role, email').eq('user_id', userId).maybeSingle();
  if (!target) return { ok: false, message: 'That person is no longer on the staff list.' };
  if (target.role === 'admin' && (await adminCount(supabase)) <= 1) {
    return { ok: false, message: 'There must always be at least one Admin.' };
  }

  // Deleting the login also removes the staff row (on delete cascade), so access ends at once.
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) {
    console.error('[removeStaff]', error);
    return { ok: false, message: 'Could not remove this person.' };
  }

  revalidatePath('/staff');
  return { ok: true, message: `${target.email} has been removed and can no longer sign in.` };
}
