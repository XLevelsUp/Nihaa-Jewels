import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Box, Button, Typography } from '@mui/material';
import { ArrowLeft } from 'lucide-react';

import ProductForm from '../ProductForm';
import ImageManager from './ImageManager';
import { getProduct, listCategories, getLatestRates } from '@/lib/catalogue';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const [product, categories, rates] = await Promise.all([
    getProduct(id),
    listCategories(),
    getLatestRates(),
  ]);

  if (!product) notFound();

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

      <Box sx={{ mb: 3 }}>
        <Typography variant="h1">{product.name}</Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mt: 0.5 }}>
          {product.sku} · /collections/{product.category?.slug}/{product.slug}
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <ImageManager productId={product.id} images={product.images} />
      </Box>

      <ProductForm product={product} categories={categories} rates={rates} />
    </Box>
  );
}
