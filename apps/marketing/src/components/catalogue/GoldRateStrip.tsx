import { Box, Typography, alpha } from '@mui/material';

import { getCurrentRates } from '@/lib/catalogue';
import { formatRupees } from '@/lib/pricing';
import type { Karat } from '@/types/database';

export default async function GoldRateStrip() {
  let rates: Record<Karat, number>;
  try {
    rates = await getCurrentRates();
  } catch {
    return null;
  }

  const entries = (['22K', '18K', '24K'] as const).filter((k) => rates[k]);
  if (entries.length === 0) return null;

  return (
    <Box
      component="aside"
      aria-label="Today's gold rate"
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: { xs: 2, md: 4 },
        py: 1.5,
        px: 3,
        bgcolor: alpha('#5F6440', 0.06),
        borderTop: `1px solid ${alpha('#5F6440', 0.15)}`,
        borderBottom: `1px solid ${alpha('#5F6440', 0.15)}`,
      }}
    >
      <Typography
        sx={{
          color: alpha('#5F6440', 0.75),
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
      >
        Today&rsquo;s Gold Rate
      </Typography>

      {entries.map((karat) => (
        <Box key={karat} sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
            {karat}
          </Typography>
          <Typography sx={{ color: 'primary.main', fontSize: '0.85rem', fontWeight: 600 }}>
            {formatRupees(rates[karat])}
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.65rem', opacity: 0.85 }}>
            /g
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
