import { Box, Typography } from '@mui/material';

import AppointmentList from './AppointmentList';
import { listAppointments, getAppointmentCounts } from '@/lib/appointments';
import type { AppointmentStatus } from '@/types/database';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

const VALID: AppointmentStatus[] = ['new', 'confirmed', 'completed', 'cancelled'];

export default async function AppointmentsPage({ searchParams }: PageProps) {
  const { status } = await searchParams;
  const active = VALID.includes(status as AppointmentStatus)
    ? (status as AppointmentStatus)
    : undefined;

  const [appointments, counts] = await Promise.all([
    listAppointments(active),
    getAppointmentCounts(),
  ]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h1">Appointments</Typography>
        <Typography sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.9rem' }}>
          Customers who asked to visit the store. Call them to confirm a time.
        </Typography>
      </Box>

      <AppointmentList appointments={appointments} counts={counts} activeStatus={active ?? 'all'} />
    </Box>
  );
}
