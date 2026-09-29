import Link from 'next/link';
import { Box, Button, Typography } from '@mui/material';
import { Plus } from 'lucide-react';

import ProductTable from './ProductTable';
import { listProducts, getLatestRates } from '@/lib/catalogue';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const [products, rates] = await Promise.all([listProducts(q), getLatestRates()]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h1">Products</Typography>
          <Typography sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.9rem' }}>
            {products.length} item{products.length === 1 ? '' : 's'} in the catalogue. Prices are
            calculated from today&rsquo;s gold rate.
          </Typography>
        </Box>
        <Button
          component={Link}
          href="/products/new"
          variant="contained"
          startIcon={<Plus size={16} />}
        >
          Add product
        </Button>
      </Box>

      <ProductTable products={products} rates={rates} initialSearch={q ?? ''} />
    </Box>
  );
}
