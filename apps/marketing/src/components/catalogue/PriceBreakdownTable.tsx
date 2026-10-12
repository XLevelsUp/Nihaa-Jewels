'use client';

import { Box, Typography, alpha, useTheme } from '@mui/material';

import { formatRupees, INDICATIVE_PRICE_DISCLAIMER, type PriceBreakdown } from '@/lib/pricing';

interface PriceBreakdownTableProps {
  price: PriceBreakdown;
  netWeightG: number;
  karat: string;
}

export default function PriceBreakdownTable({
  price,
  netWeightG,
  karat,
}: PriceBreakdownTableProps) {
  const theme = useTheme();

  const rows: { label: string; value: number; hint?: string }[] = [
    {
      label: `Gold (${karat})`,
      value: price.metalCost,
      hint: `${netWeightG}g × ${formatRupees(price.ratePerGram)}/g`,
    },
    { label: 'Wastage', value: price.wastageCost },
    { label: 'Making charges', value: price.makingCharges },
  ];

  if (price.stoneCharges > 0) rows.push({ label: 'Stones', value: price.stoneCharges });
  if (price.hallmarkCharges > 0) rows.push({ label: 'Hallmarking', value: price.hallmarkCharges });

  const line = `1px solid ${alpha(theme.palette.primary.main, 0.12)}`;

  return (
    <Box
      sx={{
        border: line,
        bgcolor: alpha(theme.palette.primary.main, 0.02),
        p: { xs: 2.5, md: 3 },
      }}
    >
      <Typography
        variant="overline"
        sx={{
          display: 'block',
          color: alpha(theme.palette.primary.main, 0.7),
          letterSpacing: '0.2em',
          fontSize: '0.6rem',
          mb: 2,
        }}
      >
        Price Breakdown
      </Typography>

      <Box component="dl" sx={{ m: 0, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        {rows.map((row) => (
          <Box
            key={row.label}
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 2 }}
          >
            <Box component="dt" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
              {row.label}
              {row.hint && (
                <Typography
                  component="span"
                  sx={{ display: 'block', fontSize: '0.65rem', opacity: 0.55, mt: 0.25 }}
                >
                  {row.hint}
                </Typography>
              )}
            </Box>
            <Box
              component="dd"
              sx={{ m: 0, color: 'text.primary', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
            >
              {formatRupees(row.value)}
            </Box>
          </Box>
        ))}

        <Box sx={{ borderTop: line, pt: 1.25, display: 'flex', justifyContent: 'space-between' }}>
          <Box component="dt" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
            Subtotal
          </Box>
          <Box component="dd" sx={{ m: 0, color: 'text.primary', fontSize: '0.85rem' }}>
            {formatRupees(price.subtotal)}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box component="dt" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
            GST (3%)
          </Box>
          <Box component="dd" sx={{ m: 0, color: 'text.primary', fontSize: '0.85rem' }}>
            {formatRupees(price.gst)}
          </Box>
        </Box>

        <Box
          sx={{
            borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            pt: 1.5,
            mt: 0.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <Box
            component="dt"
            sx={{
              color: 'primary.main',
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Total
          </Box>
          <Box
            component="dd"
            sx={{ m: 0, color: 'primary.main', fontSize: '1.35rem', fontWeight: 600 }}
          >
            {formatRupees(price.total)}
          </Box>
        </Box>
      </Box>

      <Typography
        sx={{
          mt: 2,
          pt: 2,
          borderTop: line,
          color: 'text.secondary',
          fontSize: '0.65rem',
          lineHeight: 1.6,
          opacity: 0.7,
        }}
      >
        {INDICATIVE_PRICE_DISCLAIMER}
      </Typography>
    </Box>
  );
}
