import { Box, Typography } from '@mui/material';

import CategoryManager from './CategoryManager';
import { listCategories, getProductCountByCategory } from '@/lib/catalogue';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const [categories, counts] = await Promise.all([
    listCategories(),
    getProductCountByCategory(),
  ]);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1">Collections</Typography>
        <Typography sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.9rem' }}>
          Each collection has its own page on the website. Add one and its page appears
          straight away.
        </Typography>
      </Box>

      <CategoryManager
        categories={categories}
        productCounts={Object.fromEntries(counts)}
      />
    </Box>
  );
}
