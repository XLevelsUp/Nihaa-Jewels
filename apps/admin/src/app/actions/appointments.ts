'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { createAdminClient } from '@/lib/supabase-server';
import { getCurrentUser } from '@/lib/supabase-auth';
import type { ActionResult } from './products';

const statusSchema = z.enum(['new', 'confirmed', 'completed', 'cancelled']);

export async function updateAppointmentStatus(
  id: string,
  status: string,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: 'Your session has expired. Please sign in again.' };

  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) return { ok: false, message: 'Unknown status.' };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('appointments')
    .update({ status: parsed.data })
    .eq('id', id);

  if (error) {
    console.error('[updateAppointmentStatus]', error);
    return { ok: false, message: 'Could not update the booking.' };
  }

  revalidatePath('/appointments');
  revalidatePath('/');

  const wording: Record<string, string> = {
    new: 'Moved back to new.',
    confirmed: 'Marked as confirmed.',
    completed: 'Marked as visited.',
    cancelled: 'Marked as cancelled.',
  };
  return { ok: true, message: wording[parsed.data] };
}

export async function saveStaffNotes(id: string, notes: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: 'Your session has expired.' };

  const trimmed = notes.trim().slice(0, 2000);

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('appointments')
    .update({ staff_notes: trimmed || null })
    .eq('id', id);

  if (error) {
    console.error('[saveStaffNotes]', error);
    return { ok: false, message: 'Could not save the note.' };
  }

  revalidatePath('/appointments');
  return { ok: true, message: 'Note saved.' };
}
