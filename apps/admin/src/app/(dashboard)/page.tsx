import Link from 'next/link';
import { Box, Chip, Paper, Typography } from '@mui/material';
import { TriangleAlert } from 'lucide-react';

import { createAdminClient } from '@/lib/supabase-server';
import { PALETTE } from '@/constants/palette';

export const dynamic = 'force-dynamic';

function formatRupees(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

async function getStats() {
  const supabase = createAdminClient();

  const [products, categories, appointments, newAppointments, rates] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('categories').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('appointments').select('*', { count: 'exact', head: true }),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase
      .from('gold_rates')
      .select('karat, rate_per_gram, source, effective_from')
      .order('effective_from', { ascending: false }),
  ]);

  const latestByKarat = new Map<string, { rate: number; source: string; effective: string }>();
  for (const row of rates.data ?? []) {
    if (!latestByKarat.has(row.karat)) {
      latestByKarat.set(row.karat, {
        rate: Number(row.rate_per_gram),
        source: row.source,
        effective: row.effective_from,
      });
    }
  }

  return {
    products: products.count ?? 0,
    categories: categories.count ?? 0,
    appointments: appointments.count ?? 0,
    newAppointments: newAppointments.count ?? 0,
    rates: latestByKarat,
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const tiles = [
    { label: 'Active products', value: stats.products },
    { label: 'Collections', value: stats.categories },
    { label: 'Booking requests', value: stats.appointments },
    { label: 'Awaiting response', value: stats.newAppointments, highlight: stats.newAppointments > 0 },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1">Dashboard</Typography>
        <Typography sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.9rem' }}>
          Overview of the catalogue and today&rsquo;s gold rate.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
          mb: 4,
        }}
      >
        {tiles.map((tile) => (
          <Paper key={tile.label} variant="outlined" sx={{ p: 2.5 }}>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', mb: 1 }}>
              {tile.label}
            </Typography>
            <Typography
              sx={{
                fontSize: '1.9rem',
                fontWeight: 600,
                lineHeight: 1,
                color: tile.highlight ? 'primary.main' : 'text.primary',
              }}
            >
              {tile.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h2" sx={{ fontSize: '1.05rem' }}>
            Today&rsquo;s gold rate
          </Typography>
          <Chip
            label="Update rates"
            size="small"
            variant="outlined"
            component={Link}
            href="/gold-rates"
            clickable
          />
        </Box>

        {stats.rates.size === 0 ? (
          <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            No rates set. Prices will show as &ldquo;on enquiry&rdquo; until a rate exists.
          </Typography>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
            {['22K', '18K', '24K'].map((karat) => {
              const entry = stats.rates.get(karat);
              if (!entry) return null;
              return (
                <Box key={karat} sx={{ p: 2, borderRadius: 1.5, bgcolor: PALETTE.icingWash, border: `1px solid ${PALETTE.icing}` }}>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.5 }}>
                    {karat} per gram
                  </Typography>
                  <Typography sx={{ fontSize: '1.3rem', fontWeight: 600, color: 'primary.main' }}>
                    {formatRupees(entry.rate)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mt: 0.5 }}>
                    {entry.source === 'manual' ? 'Set by staff' : 'From rate feed'} &middot;{' '}
                    {new Date(entry.effective).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          pl: 3.5,
          bgcolor: PALETTE.icing,
          borderColor: PALETTE.icingDeep,
          borderLeft: `5px solid ${PALETTE.icingDeep}`,
          display: 'flex',
          gap: 2,
          alignItems: 'flex-start',
        }}
      >
        <TriangleAlert size={20} color={PALETTE.icingDeep} style={{ flexShrink: 0, marginTop: 2 }} />
        <Box>
          <Typography variant="h3" sx={{ fontSize: '0.95rem', mb: 1 }}>
            Seeded prices are placeholders
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', lineHeight: 1.75 }}>
            The gold rates and product weights currently in the catalogue are sample values, not real
            ones. They are already driving the prices shown on the public site, so replace them with
            the shop&rsquo;s actual figures before launch.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
