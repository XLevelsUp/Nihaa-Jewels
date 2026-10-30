import { Box, Typography } from '@mui/material';

import AppointmentList, { type When } from './AppointmentList';
import { listAppointments, getAppointmentCounts } from '@/lib/appointments';
import type { AppointmentStatus } from '@/types/database';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ status?: string; when?: string; q?: string }>;
}

const VALID: AppointmentStatus[] = ['new', 'confirmed', 'completed', 'cancelled'];
const istDay = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(d);

export default async function AppointmentsPage({ searchParams }: PageProps) {
  const { status, when: rawWhen, q } = await searchParams;
  const active = VALID.includes(status as AppointmentStatus) ? (status as AppointmentStatus) : undefined;
  const when: When = rawWhen === 'today' || rawWhen === 'week' ? rawWhen : 'all';

  const [all, counts] = await Promise.all([listAppointments(active), getAppointmentCounts()]);

  // Bookings are few, so date and search narrowing happen here on the fetched list.
  const today = istDay(new Date());
  const weekEnd = istDay(new Date(Date.now() + 6 * 86_400_000));
  const term = (q ?? '').trim().toLowerCase();
  const digits = term.replace(/\D/g, '');
  const appointments = all.filter((a) => {
    if (when === 'today' && a.preferred_date !== today) return false;
    if (when === 'week' && (a.preferred_date < today || a.preferred_date > weekEnd)) return false;
    if (term && !a.name.toLowerCase().includes(term) && !(digits.length >= 4 && a.phone.replace(/\D/g, '').includes(digits))) return false;
    return true;
  });

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h1">Appointments</Typography>
        <Typography sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.9rem' }}>
          Customers who asked to visit the store. Call or WhatsApp them to confirm a time.
        </Typography>
      </Box>

      <AppointmentList appointments={appointments} counts={counts} activeStatus={active ?? 'all'} when={when} search={q ?? ''} />
    </Box>
  );
}
