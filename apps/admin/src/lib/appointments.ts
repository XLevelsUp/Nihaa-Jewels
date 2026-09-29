import 'server-only';

// Readable only through service_role — appointments holds customer PII and has no anon SELECT policy.

import { createAdminClient } from './supabase-server';
import type { Appointment, AppointmentStatus } from '@/types/database';

export interface AppointmentRow extends Appointment {
  staff_notes: string | null;
  product: { id: string; name: string; slug: string } | null;
}

const SELECT = `
  *,
  product:products ( id, name, slug )
`;

function normalise(row: Record<string, unknown>): AppointmentRow {
  const product = row.product;
  return {
    ...row,
    product: Array.isArray(product) ? (product[0] ?? null) : product,
  } as AppointmentRow;
}

export async function listAppointments(status?: AppointmentStatus): Promise<AppointmentRow[]> {
  const supabase = createAdminClient();
  let query = supabase.from('appointments').select(SELECT);

  if (status) query = query.eq('status', status);

  // Soonest visit first: staff work from who is coming next, not who booked first.
  const { data, error } = await query
    .order('preferred_date', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to load appointments: ${error.message}`);
  return (data ?? []).map(normalise);
}

export async function getAppointmentCounts(): Promise<Record<AppointmentStatus | 'all', number>> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('appointments').select('status');
  if (error) throw new Error(`Failed to count appointments: ${error.message}`);

  const counts = { all: 0, new: 0, confirmed: 0, completed: 0, cancelled: 0 } as Record<
    AppointmentStatus | 'all',
    number
  >;
  for (const row of data ?? []) {
    counts.all += 1;
    counts[row.status as AppointmentStatus] += 1;
  }
  return counts;
}
