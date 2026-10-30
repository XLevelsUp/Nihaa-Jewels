// The morning view: what needs doing today first (rate, bookings, catalogue gaps), each linking straight to the screen that fixes it, then the day's visits and rates.

import Link from 'next/link';
import { Box, Button, Chip, Paper, Typography } from '@mui/material';
import { CalendarClock, CheckCircle2, ChevronRight, CircleAlert, Coins, ImageOff, Phone, ScanLine, TriangleAlert } from 'lucide-react';

import { listAppointments } from '@/lib/appointments';
import { getCatalogueHealth, countProductsByView, STALE_DRAFT_DAYS } from '@/lib/catalogue';
import { getCurrentRates, formatRupees, KARATS } from '@/lib/rates';
import { PALETTE } from '@/constants/palette';

export const dynamic = 'force-dynamic';

// The shop runs on India time, so "today" is the Kolkata calendar day, not the server's.
const istDay = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(d);
const SLOT_LABEL: Record<string, string> = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' };

interface Task {
  tone: 'urgent' | 'warn';
  icon: React.ReactNode;
  title: string;
  detail: string;
  href: string;
  action: string;
}

export default async function DashboardPage() {
  const [rates, health, counts, newBookings, confirmed] = await Promise.all([
    getCurrentRates(),
    getCatalogueHealth(),
    countProductsByView(),
    listAppointments('new'),
    listAppointments('confirmed'),
  ]);

  const today = istDay(new Date());
  const weekAhead = istDay(new Date(Date.now() + 6 * 86_400_000));
  const rateUpdatedToday = KARATS.every((k) => {
    const r = rates.get(k);
    return r && istDay(new Date(r.effectiveFrom)) === today;
  });
  const placeholderRates = [...rates.values()].some((r) => r.note?.toLowerCase().includes('placeholder'));
  const overdue = newBookings.filter((a) => a.preferred_date < today);
  const upcoming = [...newBookings, ...confirmed]
    .filter((a) => a.preferred_date >= today && a.preferred_date <= weekAhead)
    .sort((a, b) => a.preferred_date.localeCompare(b.preferred_date));

  const tasks: Task[] = [
    !rateUpdatedToday && {
      tone: 'urgent' as const,
      icon: <Coins size={18} />,
      title: "Today's gold rate is not set",
      detail: 'Website prices are still using the last rate entered.',
      href: '/gold-rates',
      action: 'Update rates',
    },
    newBookings.length > 0 && {
      tone: 'urgent' as const,
      icon: <CalendarClock size={18} />,
      title: `${newBookings.length} new booking ${newBookings.length === 1 ? 'request' : 'requests'}`,
      detail: overdue.length > 0 ? `${overdue.length} already past the requested date — call these first.` : 'Call or message to confirm the visit.',
      href: '/appointments?status=new',
      action: 'Open bookings',
    },
    health.publishedNoPhoto > 0 && {
      tone: 'urgent' as const,
      icon: <ImageOff size={18} />,
      title: `${health.publishedNoPhoto} published ${health.publishedNoPhoto === 1 ? 'product has' : 'products have'} no photo`,
      detail: 'They show a blank tile on the website.',
      href: '/products?view=published&missing=photo',
      action: 'Add photos',
    },
    health.noHuid > 0 && {
      tone: 'warn' as const,
      icon: <ScanLine size={18} />,
      title: `${health.noHuid} ${health.noHuid === 1 ? 'product is' : 'products are'} missing a HUID`,
      detail: 'Customers trust pieces they can verify in the BIS Care app.',
      href: '/products?missing=huid',
      action: 'Add HUIDs',
    },
    health.staleDrafts > 0 && {
      tone: 'warn' as const,
      icon: <CircleAlert size={18} />,
      title: `${health.staleDrafts} ${health.staleDrafts === 1 ? 'draft has' : 'drafts have'} not been touched in ${STALE_DRAFT_DAYS} days`,
      detail: 'Finish and publish them, or archive what is no longer needed.',
      href: '/products?view=draft&missing=stale-draft',
      action: 'Review drafts',
    },
  ].filter(Boolean) as Task[];

  const tiles = [
    { label: 'Published products', value: counts.published, href: '/products?view=published' },
    { label: 'Drafts', value: counts.draft, href: '/products?view=draft' },
    { label: 'Visits this week', value: upcoming.length, href: '/appointments' },
    { label: 'Awaiting response', value: newBookings.length, href: '/appointments?status=new', highlight: newBookings.length > 0 },
  ];

  const dateLabel = (iso: string) =>
    iso === today ? 'Today' : new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h1">Dashboard</Typography>
        <Typography sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.9rem' }}>
          {new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'long', day: 'numeric', month: 'long' })}
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h2" sx={{ fontSize: '1.05rem', mb: 2 }}>
          Needs attention
        </Typography>
        {tasks.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#2E7D53' }}>
            <CheckCircle2 size={20} />
            <Typography sx={{ fontSize: '0.9rem' }}>All clear. Rates are current, bookings are answered and the catalogue is complete.</Typography>
          </Box>
        ) : (
          <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            {tasks.map((t) => (
              <Box
                component="li"
                key={t.title}
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 2,
                  p: 1.75,
                  borderRadius: 1.5,
                  borderLeft: `4px solid ${t.tone === 'urgent' ? '#B3261E' : PALETTE.icingDeep}`,
                  bgcolor: t.tone === 'urgent' ? 'rgba(179, 38, 30, 0.05)' : PALETTE.icingWash,
                }}
              >
                <Box sx={{ color: t.tone === 'urgent' ? '#B3261E' : PALETTE.icingDeep, display: 'grid' }}>{t.icon}</Box>
                <Box sx={{ flex: 1, minWidth: 220 }}>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{t.title}</Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>{t.detail}</Typography>
                </Box>
                <Button component={Link} href={t.href} size="small" variant={t.tone === 'urgent' ? 'contained' : 'outlined'} endIcon={<ChevronRight size={14} />}>
                  {t.action}
                </Button>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        {tiles.map((tile) => (
          <Paper
            key={tile.label}
            variant="outlined"
            component={Link}
            href={tile.href}
            sx={{ p: 2.5, display: 'block', textDecoration: 'none', transition: 'border-color 0.2s', '&:hover': { borderColor: PALETTE.sageDeep } }}
          >
            <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', mb: 1 }}>{tile.label}</Typography>
            <Typography sx={{ fontSize: '1.9rem', fontWeight: 600, lineHeight: 1, color: tile.highlight ? 'primary.main' : 'text.primary' }}>
              {tile.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '3fr 2fr' }, gap: 3, alignItems: 'start' }}>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h2" sx={{ fontSize: '1.05rem' }}>Visits in the next 7 days</Typography>
            <Chip label="All bookings" size="small" variant="outlined" component={Link} href="/appointments" clickable />
          </Box>
          {upcoming.length === 0 ? (
            <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>No visits booked for the coming week.</Typography>
          ) : (
            <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
              {upcoming.slice(0, 8).map((a) => (
                <Box component="li" key={a.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.25, borderTop: `1px solid ${PALETTE.icing}`, '&:first-of-type': { borderTop: 'none' } }}>
                  <Box sx={{ width: 92, flexShrink: 0 }}>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: a.preferred_date === today ? 'primary.main' : 'text.primary' }}>
                      {dateLabel(a.preferred_date)}
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>{SLOT_LABEL[a.preferred_slot] ?? a.preferred_slot}</Typography>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: '0.86rem', fontWeight: 500 }} noWrap>{a.name}</Typography>
                    <Typography sx={{ fontSize: '0.74rem', color: 'text.secondary' }} noWrap>
                      {a.product ? a.product.name : 'General visit'}
                      {a.quoted_price ? ` · quoted ${formatRupees(Number(a.quoted_price))}` : ''}
                    </Typography>
                  </Box>
                  <Chip
                    label={a.status === 'new' ? 'To confirm' : 'Confirmed'}
                    size="small"
                    sx={{ height: 22, fontSize: '0.68rem', bgcolor: a.status === 'new' ? 'rgba(179,38,30,0.08)' : 'rgba(46,125,83,0.12)', color: a.status === 'new' ? '#B3261E' : '#2E7D53' }}
                  />
                  <Button component="a" href={`tel:${a.phone.replace(/\s/g, '')}`} size="small" startIcon={<Phone size={13} />} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                    Call
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h2" sx={{ fontSize: '1.05rem' }}>Gold rate</Typography>
            <Chip label="Update rates" size="small" variant="outlined" component={Link} href="/gold-rates" clickable />
          </Box>
          {rates.size === 0 ? (
            <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
              No rates set. Prices show as &ldquo;on enquiry&rdquo; until a rate exists.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              {KARATS.map((karat) => {
                const entry = rates.get(karat);
                if (!entry) return null;
                const fresh = istDay(new Date(entry.effectiveFrom)) === today;
                return (
                  <Box key={karat} sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', p: 1.5, borderRadius: 1.5, bgcolor: PALETTE.icingWash }}>
                    <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary' }}>{karat} / g</Typography>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontSize: '1.15rem', fontWeight: 600, color: 'primary.main' }}>{formatRupees(entry.ratePerGram)}</Typography>
                      <Typography sx={{ fontSize: '0.68rem', color: fresh ? '#2E7D53' : '#B3261E' }}>
                        {fresh ? 'Updated today' : `Last set ${new Date(entry.effectiveFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}

          {placeholderRates && (
            <Box sx={{ display: 'flex', gap: 1.25, mt: 2, p: 1.5, borderRadius: 1.5, bgcolor: PALETTE.icing }}>
              <TriangleAlert size={16} color={PALETTE.icingDeep} style={{ flexShrink: 0, marginTop: 2 }} />
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.6 }}>
                These are placeholder rates from setup. Enter the shop&rsquo;s real rates before launch.
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
