import Link from 'next/link';
import { Box, Button, Typography } from '@mui/material';
import { Plus } from 'lucide-react';

import ProductTable, { type ProductTableFilters } from './ProductTable';
import { getCurrentUser } from '@/lib/supabase-auth';
import { can } from '@/lib/permissions';
import { countProductsByView, getLatestRates, listCategories, listProducts, type ProductView } from '@/lib/catalogue';

export const dynamic = 'force-dynamic';

const VIEWS: ProductView[] = ['all', 'draft', 'published', 'archived', 'deleted'];
const COLOURS = ['yellow', 'rose', 'white', 'none'] as const;
const KARATS = ['18K', '22K', '24K'];

type Params = { q?: string; view?: string; category?: string; colour?: string; karat?: string; discount?: string; missing?: string };
const MISSING = ['photo', 'huid', 'stale-draft'] as const;

interface PageProps {
  searchParams: Promise<Params>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const requested: ProductView = VIEWS.includes(sp.view as ProductView) ? (sp.view as ProductView) : 'all';
  const viewer = await getCurrentUser();
  // The Deleted tab is hidden from roles that cannot restore, and a typed URL does not bring it back.
  const view: ProductView = requested === 'deleted' && !can(viewer?.role, 'products.delete') ? 'all' : requested;

  // Only known values reach the query; anything else in the URL is ignored rather than erroring.
  const filters: ProductTableFilters = {
    category: sp.category ?? '',
    colour: (COLOURS as readonly string[]).includes(sp.colour ?? '') ? (sp.colour as ProductTableFilters['colour']) : '',
    karat: KARATS.includes(sp.karat ?? '') ? sp.karat! : '',
    discount: sp.discount === 'with' || sp.discount === 'without' ? sp.discount : '',
    missing: (MISSING as readonly string[]).includes(sp.missing ?? '') ? (sp.missing as ProductTableFilters['missing']) : '',
  };

  const categories = await listCategories();
  const selected = categories.find((c) => c.id === filters.category);
  const categoryIds = selected ? [selected.id, ...categories.filter((c) => c.parent_id === selected.id).map((c) => c.id)] : undefined;

  const [products, counts, rates, user] = await Promise.all([
    listProducts({
      search: sp.q,
      view,
      categoryIds,
      colour: filters.colour || undefined,
      karat: filters.karat || undefined,
      discount: filters.discount || undefined,
      missing: filters.missing || undefined,
    }),
    countProductsByView(),
    getLatestRates(),
    getCurrentUser(),
  ]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h1">Products</Typography>
          <Typography sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.9rem' }}>
            {counts.published} published of {counts.all} in the catalogue. Prices are calculated from today&rsquo;s gold rate.
          </Typography>
        </Box>
        <Button component={Link} href="/products/new" variant="contained" startIcon={<Plus size={16} />}>
          Add product
        </Button>
      </Box>

      <ProductTable
        products={products}
        rates={rates}
        initialSearch={sp.q ?? ''}
        view={view}
        counts={counts}
        filters={filters}
        categories={categories.map((c) => ({ id: c.id, name: c.name, isChild: Boolean(c.parent_id) }))}
        perms={{ canDelete: can(user?.role, 'products.delete'), canPublish: can(user?.role, 'products.publish') }}
      />
    </Box>
  );
}
