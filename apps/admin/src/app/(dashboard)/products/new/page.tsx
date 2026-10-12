import Link from 'next/link';
import { Box, Button, Typography } from '@mui/material';
import { ArrowLeft } from 'lucide-react';

import ProductForm from '../ProductForm';
import { listCategories, getLatestRates } from '@/lib/catalogue';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const [categories, rates] = await Promise.all([listCategories(), getLatestRates()]);

  return (
    <Box>
      <Button
        component={Link}
        href="/products"
        startIcon={<ArrowLeft size={15} />}
        sx={{ mb: 2, ml: -1 }}
      >
        Back to products
      </Button>

      <Typography variant="h1" sx={{ mb: 3 }}>
        Add product
      </Typography>

      {categories.length === 0 ? (
        <Typography sx={{ color: 'text.secondary' }}>
          Create a collection first, under Categories.
        </Typography>
      ) : (
        <ProductForm product={null} categories={categories} rates={rates} />
      )}
    </Box>
  );
}
