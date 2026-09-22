'use client';

import { Box, Typography, alpha, useTheme } from '@mui/material';

import ProductCard from './ProductCard';
import type { PricedProduct } from '@/lib/catalogue';

interface ProductGridProps {
  products: PricedProduct[];
  emptyMessage?: string;
}

export default function ProductGrid({
  products,
  emptyMessage = 'This collection is being curated and will be unveiled shortly.',
}: ProductGridProps) {
  const theme = useTheme();

  if (products.length === 0) {
    return (
      <Box
        component="section"
        sx={{
          py: 10,
          px: 3,
          textAlign: 'center',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 300,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontFamily: 'var(--font-playfair-display), serif',
            fontStyle: 'italic',
            fontSize: '1.25rem',
            opacity: 0.5,
          }}
        >
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: { xs: 3, md: 4 },
      }}
    >
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} priority={i < 3} />
      ))}
    </Box>
  );
}
