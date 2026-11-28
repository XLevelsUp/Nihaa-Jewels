import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import RateCard from './RateCard';
import {
  getCurrentRates,
  getCurrentSilverRates,
  getRateHistory,
  getSilverRateHistory,
  KARATS,
  SILVER_PURITIES,
  formatRupees,
} from '@/lib/rates';
import { getCurrentUser } from '@/lib/supabase-auth';
import { can, deniedMessage } from '@/lib/permissions';
import { PALETTE } from '@/constants/palette';

export const dynamic = 'force-dynamic';

const SILVER_TITLES: Record<string, string> = { '925': '925 Sterling silver', '999': '999 Fine silver' };

export default async function RatesPage() {
  const [gold, silver, goldHistory, silverHistory, user] = await Promise.all([
    getCurrentRates(),
    getCurrentSilverRates(),
    getRateHistory(30),
    getSilverRateHistory(30),
    getCurrentUser(),
  ]);
  const canEdit = can(user?.role, 'rates.edit');

  const history = [
    ...goldHistory.map((r) => ({ id: r.id, when: r.effective_from, label: `${r.karat} gold`, rate: r.rate_per_gram, source: r.source, note: r.note })),
    ...silverHistory.map((r) => ({ id: r.id, when: r.effective_from, label: `${r.purity} silver`, rate: r.rate_per_gram, source: r.source, note: r.note })),
  ]
    .sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime())
    .slice(0, 40);

  const grid = { display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2.5 };
  const sectionTitle = { fontSize: '1.05rem', mb: 2 };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1">Gold &amp; Silver Rates</Typography>
        <Typography sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.9rem' }}>
          Every price on the website is calculated from these rates. Update them each morning; a change reaches the website
          within about an hour.
        </Typography>
        {!canEdit && (
          <Typography sx={{ mt: 1.5, fontSize: '0.82rem', fontWeight: 600, color: 'primary.main' }}>
            {deniedMessage('rates.edit')} You can see the current rates and their history.
          </Typography>
        )}
      </Box>

      <Typography variant="h2" sx={sectionTitle}>Gold</Typography>
      <Box sx={{ ...grid, mb: 5 }}>
        {KARATS.map((karat) => {
          const rate = gold.get(karat);
          return (
            <RateCard
              key={karat}
              metal="gold"
              purity={karat}
              title={`${karat} Gold`}
              currentRate={rate?.ratePerGram ?? null}
              source={rate?.source ?? null}
              effectiveFrom={rate?.effectiveFrom ?? null}
              canEdit={canEdit}
            />
          );
        })}
      </Box>

      <Typography variant="h2" sx={sectionTitle}>Silver</Typography>
      <Box sx={{ ...grid, mb: 5 }}>
        {SILVER_PURITIES.map((purity) => {
          const rate = silver.get(purity);
          return (
            <RateCard
              key={purity}
              metal="silver"
              purity={purity}
              title={SILVER_TITLES[purity]}
              currentRate={rate?.ratePerGram ?? null}
              source={rate?.source ?? null}
              effectiveFrom={rate?.effectiveFrom ?? null}
              canEdit={canEdit}
            />
          );
        })}
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h2" sx={{ fontSize: '1.15rem' }}>
          Rate history
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.82rem', mt: 0.5 }}>
          Past rates are never overwritten, so you can always check what was quoted on a given day.
        </Typography>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date &amp; time</TableCell>
              <TableCell>Metal &amp; purity</TableCell>
              <TableCell align="right">Rate / gram</TableCell>
              <TableCell>Set by</TableCell>
              <TableCell>Note</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  No rates recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              history.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {new Date(row.when).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.label}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {formatRupees(Number(row.rate))}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.source === 'manual' ? 'Staff' : 'Rate feed'}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.68rem',
                        bgcolor: row.source === 'manual' ? PALETTE.sageWash : PALETTE.blushWash,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                    {row.note || '—'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
