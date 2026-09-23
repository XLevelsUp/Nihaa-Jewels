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
import { getCurrentRates, getRateHistory, KARATS, formatRupees } from '@/lib/rates';
import { PALETTE } from '@/constants/palette';

export const dynamic = 'force-dynamic';

export default async function GoldRatesPage() {
  const [current, history] = await Promise.all([getCurrentRates(), getRateHistory(30)]);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1">Gold Rates</Typography>
        <Typography sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.9rem' }}>
          Every price on the website is calculated from these rates. A change appears on the site
          within seconds.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 2.5,
          mb: 5,
        }}
      >
        {KARATS.map((karat) => {
          const rate = current.get(karat);
          return (
            <RateCard
              key={karat}
              karat={karat}
              currentRate={rate?.ratePerGram ?? null}
              source={rate?.source ?? null}
              effectiveFrom={rate?.effectiveFrom ?? null}
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
              <TableCell>Purity</TableCell>
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
                    {new Date(row.effective_from).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>{row.karat}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {formatRupees(Number(row.rate_per_gram))}
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
