import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Alert, Box, Breadcrumbs, Button, Chip, Typography } from '@mui/material';
import { ExternalLink } from 'lucide-react';

import ProductForm from '../ProductForm';
import ImageManager from './ImageManager';
import ProductHistory from './ProductHistory';
import { getProduct, getProductHistory, listCategories, getLatestRates } from '@/lib/catalogue';
import { SITE_URL } from '@/lib/site';
import { getCurrentUser } from '@/lib/supabase-auth';
import { can } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}

const STATUS_CHIP = {
  published: { label: 'Published', bg: 'rgba(46, 125, 83, 0.12)', fg: '#2E7D53' },
  draft: { label: 'Draft', bg: 'rgba(90, 74, 66, 0.1)', fg: '#5A4A42' },
  archived: { label: 'Archived', bg: 'rgba(90, 74, 66, 0.1)', fg: '#5A4A42' },
} as const;

export default async function EditProductPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { created } = await searchParams;
  const [product, categories, rates, history, user] = await Promise.all([
    getProduct(id),
    listCategories(),
    getLatestRates(),
    getProductHistory(id),
    getCurrentUser(),
  ]);
  const perms = { canPublish: can(user?.role, 'products.publish'), canDiscount: can(user?.role, 'discounts.edit') };

  if (!product) notFound();

  const chip = STATUS_CHIP[product.status];
  const live = product.status === 'published' && !product.deleted_at;
  const publicUrl = `${SITE_URL}/collections/${product.category?.slug ?? 'all'}/${product.slug}`;

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 1.5, fontSize: '0.82rem' }}>
        <Box component={Link} href="/products" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
          Products
        </Box>
        {product.category && (
          <Box
            component={Link}
            href={`/products?category=${product.category.id}`}
            sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            {product.category.name}
          </Box>
        )}
        <Typography sx={{ fontSize: '0.82rem', color: 'text.primary' }}>{product.name}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Typography variant="h1">{product.name}</Typography>
            <Chip label={product.deleted_at ? 'Deleted' : chip.label} size="small" sx={{ fontWeight: 600, bgcolor: chip.bg, color: chip.fg }} />
          </Box>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mt: 0.5 }}>
            {product.sku}
            {product.huid && ` · HUID ${product.huid}`} · /collections/{product.category?.slug}/{product.slug}
          </Typography>
        </Box>
        {live ? (
          <Button component="a" href={publicUrl} target="_blank" rel="noopener noreferrer" variant="outlined" startIcon={<ExternalLink size={15} />}>
            View on website
          </Button>
        ) : (
          <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', alignSelf: 'center' }}>Not visible on the website yet</Typography>
        )}
      </Box>

      {created && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Product created as a draft. Now add its photos below, then publish it from the Status section.
        </Alert>
      )}

      {product.deleted_at && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          This product is deleted and hidden from the website. Restore it from the Deleted tab on the Products page.
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <ImageManager productId={product.id} images={product.images} />
      </Box>

      <ProductForm product={product} categories={categories} rates={rates} perms={perms} />

      <ProductHistory entries={history} canUndoDelete={can(user?.role, 'products.delete')} />
    </Box>
  );
}
