'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { Phone, Mail, Calendar, Gem, StickyNote } from 'lucide-react';

import { updateAppointmentStatus, saveStaffNotes } from '@/app/actions/appointments';
import { PALETTE } from '@/constants/palette';
import type { AppointmentRow } from '@/lib/appointments';
import type { AppointmentStatus } from '@/types/database';

interface AppointmentListProps {
  appointments: AppointmentRow[];
  counts: Record<AppointmentStatus | 'all', number>;
  activeStatus: AppointmentStatus | 'all';
}

const TABS: { value: AppointmentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Visited' },
  { value: 'cancelled', label: 'Cancelled' },
];

const STATUS_STYLE: Record<AppointmentStatus, { label: string; bg: string; color: string }> = {
  new: { label: 'New', bg: PALETTE.icing, color: PALETTE.icingDeep },
  confirmed: { label: 'Confirmed', bg: PALETTE.sageWash, color: PALETTE.sageDeep },
  completed: { label: 'Visited', bg: 'rgba(46,125,83,0.14)', color: '#2E7D53' },
  cancelled: { label: 'Cancelled', bg: PALETTE.blushWash, color: PALETTE.blushDeep },
};

const SLOT_LABEL: Record<string, string> = {
  morning: 'Morning (10am–1pm)',
  afternoon: 'Afternoon (1pm–5pm)',
  evening: 'Evening (5pm–8pm)',
};

function formatRupees(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function isPast(dateStr: string): boolean {
  const d = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

export default function AppointmentList({ appointments, counts, activeStatus }: AppointmentListProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ ok: boolean; message: string } | null>(null);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  const run = (fn: () => Promise<{ ok: boolean; message: string }>) => {
    startTransition(async () => {
      setToast(await fn());
      router.refresh();
    });
  };

  const changeTab = (value: AppointmentStatus | 'all') => {
    router.push(value === 'all' ? '/appointments' : `/appointments?status=${value}`);
  };

  return (
    <>
      <Tabs
        value={activeStatus}
        onChange={(_, v) => changeTab(v)}
        sx={{ mb: 3, borderBottom: `1px solid ${PALETTE.icing}`, minHeight: 40 }}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            sx={{ minHeight: 40, textTransform: 'none', fontSize: '0.85rem' }}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                {tab.label}
                <Chip
                  label={counts[tab.value]}
                  size="small"
                  sx={{ height: 18, fontSize: '0.65rem', bgcolor: PALETTE.icingWash }}
                />
              </Box>
            }
          />
        ))}
      </Tabs>

      {appointments.length === 0 ? (
        <Paper variant="outlined" sx={{ py: 6, textAlign: 'center' }}>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
            {activeStatus === 'all'
              ? 'No booking requests yet.'
              : `No ${activeStatus} bookings.`}
          </Typography>
          {activeStatus === 'all' && (
            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', mt: 1 }}>
              They appear here when a customer books through the website.
            </Typography>
          )}
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {appointments.map((a) => {
            const style = STATUS_STYLE[a.status];
            const overdue = a.status === 'new' && isPast(a.preferred_date);

            return (
              <Paper
                key={a.id}
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderLeft: `5px solid ${overdue ? PALETTE.blushDeep : style.color}`,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 1.5,
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 600 }}>{a.name}</Typography>
                      <Chip
                        label={style.label}
                        size="small"
                        sx={{ height: 20, fontSize: '0.68rem', bgcolor: style.bg, color: style.color }}
                      />
                      {overdue && (
                        <Chip
                          label="Date passed"
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.68rem',
                            bgcolor: PALETTE.blushWash,
                            color: PALETTE.blushDeep,
                          }}
                        />
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, color: 'text.secondary' }}>
                      <Box
                        component="a"
                        href={`tel:${a.phone.replace(/\s/g, '')}`}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          fontSize: '0.82rem',
                          color: 'primary.main',
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        <Phone size={13} /> {a.phone}
                      </Box>
                      {a.email && (
                        <Box
                          component="a"
                          href={`mailto:${a.email}`}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            fontSize: '0.82rem',
                            color: 'text.secondary',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          <Mail size={13} /> {a.email}
                        </Box>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ textAlign: { sm: 'right' } }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        fontSize: '0.85rem',
                        fontWeight: 500,
                      }}
                    >
                      <Calendar size={13} /> {formatDate(a.preferred_date)}
                    </Box>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      {SLOT_LABEL[a.preferred_slot] ?? a.preferred_slot}
                    </Typography>
                  </Box>
                </Box>

                {(a.product || a.quoted_price) && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 2,
                      alignItems: 'center',
                      p: 1.5,
                      mb: 1.5,
                      borderRadius: 1,
                      bgcolor: PALETTE.icingWash,
                    }}
                  >
                    {a.product && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: '0.82rem' }}>
                        <Gem size={13} /> {a.product.name}
                      </Box>
                    )}
                    {a.quoted_price && (
                      <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                        Price shown when booking:{' '}
                        <strong>{formatRupees(Number(a.quoted_price))}</strong>
                      </Typography>
                    )}
                  </Box>
                )}

                {a.notes && (
                  <Box sx={{ mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mb: 0.25 }}>
                      Customer&rsquo;s message
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', lineHeight: 1.7 }}>{a.notes}</Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                  {a.status !== 'confirmed' && (
                    <Button
                      size="small"
                      variant="contained"
                      disabled={pending}
                      onClick={() => run(() => updateAppointmentStatus(a.id, 'confirmed'))}
                    >
                      Confirm
                    </Button>
                  )}
                  {a.status !== 'completed' && (
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={pending}
                      onClick={() => run(() => updateAppointmentStatus(a.id, 'completed'))}
                    >
                      Mark visited
                    </Button>
                  )}
                  {a.status !== 'cancelled' && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      disabled={pending}
                      onClick={() => run(() => updateAppointmentStatus(a.id, 'cancelled'))}
                    >
                      Cancel
                    </Button>
                  )}
                  {a.status !== 'new' && (
                    <Button
                      size="small"
                      disabled={pending}
                      onClick={() => run(() => updateAppointmentStatus(a.id, 'new'))}
                    >
                      Move back to new
                    </Button>
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <StickyNote size={14} style={{ marginTop: 10, flexShrink: 0, opacity: 0.5 }} />
                  <TextField
                    fullWidth
                    multiline
                    size="small"
                    placeholder="Staff note — what was agreed on the call"
                    value={noteDrafts[a.id] ?? a.staff_notes ?? ''}
                    onChange={(e) => setNoteDrafts((p) => ({ ...p, [a.id]: e.target.value }))}
                  />
                  <Button
                    size="small"
                    disabled={pending || (noteDrafts[a.id] ?? a.staff_notes ?? '') === (a.staff_notes ?? '')}
                    onClick={() => run(() => saveStaffNotes(a.id, noteDrafts[a.id] ?? ''))}
                    sx={{ mt: 0.5 }}
                  >
                    {pending ? <CircularProgress size={16} /> : 'Save'}
                  </Button>
                </Box>
              </Paper>
            );
          })}
        </Box>
      )}

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast?.ok ? 'success' : 'error'} onClose={() => setToast(null)}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </>
  );
}
