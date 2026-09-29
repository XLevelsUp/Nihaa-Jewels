'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { createAdminClient } from '@/lib/supabase-server';
import { getCurrentUser } from '@/lib/supabase-auth';
import type { ActionResult } from './products';

const statusSchema = z.enum(['new', 'confirmed', 'completed', 'cancelled']);
export type AppointmentStatus = z.infer<typeof statusSchema>;

// Which moves are allowed from each status. Enforced here rather than only in the UI,
// so a stale page or a crafted request cannot record a visit on a cancelled booking.
const ALLOWED: Record<AppointmentStatus, AppointmentStatus[]> = {
  new: ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  // A visit that happened is a fact; it is only reversible through an explicit undo.
  completed: [],
  // The customer rang back and rebooked — reopening is a real case.
  cancelled: ['new'],
};

export async function updateAppointmentStatus(
  id: string,
  status: string,
  // Undo replays a known previous status, so it bypasses the forward-only rules.
  options?: { undo?: boolean },
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: 'Your session has expired. Please sign in again.' };

  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) return { ok: false, message: 'Unknown status.' };

  const supabase = createAdminClient();

  const { data: current, error: readError } = await supabase
    .from('appointments')
    .select('status')
    .eq('id', id)
    .single();

  if (readError || !current) {
    console.error('[updateAppointmentStatus] read', readError);
    return { ok: false, message: 'Could not find that booking.' };
  }

  const from = current.status as AppointmentStatus;
  if (from === parsed.data) return { ok: true, message: 'Already set.' };

  if (!options?.undo && !ALLOWED[from].includes(parsed.data)) {
    return {
      ok: false,
      message: `A ${from} booking cannot be marked ${parsed.data}.`,
    };
  }

  const { error } = await supabase
    .from('appointments')
    .update({ status: parsed.data })
    .eq('id', id)
    // Guards against two staff acting on the same booking at once.
    .eq('status', from);

  if (error) {
    console.error('[updateAppointmentStatus]', error);
    return { ok: false, message: 'Could not update the booking.' };
  }

  revalidatePath('/appointments');
  revalidatePath('/');

  const wording: Record<AppointmentStatus, string> = {
    new: options?.undo ? 'Change undone.' : 'Reopened as new.',
    confirmed: options?.undo ? 'Change undone.' : 'Marked as confirmed.',
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
