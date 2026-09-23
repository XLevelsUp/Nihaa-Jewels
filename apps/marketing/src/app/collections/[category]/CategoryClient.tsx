'use client';

import { Box, Container, Typography, alpha, useTheme } from '@mui/material';

import Navigation from '@/components/sections/Navigation';
import Footer from '@/components/sections/Footer';
import ProductGrid from '@/components/catalogue/ProductGrid';
import BookAppointmentButton from '@/components/catalogue/BookAppointmentButton';
import { INDICATIVE_PRICE_DISCLAIMER } from '@/lib/pricing';
import type { PricedProduct } from '@/lib/catalogue';
import type { Category } from '@/types/database';

interface CategoryClientProps {
  category: Category;
  products: PricedProduct[];
}

export default function CategoryClient({ category, products }: CategoryClientProps) {
  const theme = useTheme();

  const words = category.name.trim().split(' ');
  const leading = words.slice(0, -1).join(' ');
  const last = words[words.length - 1];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navigation />

      <Container component="main" maxWidth="lg" sx={{ pt: 20, pb: 12, px: 3 }}>
        <Box component="header" sx={{ mb: 8 }}>
          <Typography
            variant="overline"
            sx={{
              display: 'block',
              mb: 1,
              color: alpha(theme.palette.primary.main, 0.6),
              letterSpacing: '0.2em',
            }}
          >
            {category.hero_eyebrow || 'Collection'}
          </Typography>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              color: 'text.primary',
              fontFamily: 'var(--font-playfair-display), serif',
            }}
          >
            {leading && `${leading} `}
            <Box component="em" className="text-gradient-gold" sx={{ fontStyle: 'normal' }}>
              {last}
            </Box>
          </Typography>

          <Box sx={{ width: 56, height: 1, bgcolor: 'primary.main', mt: 3 }} />

          {category.description && (
            <Typography
              sx={{ color: 'text.secondary', mt: 3, maxWidth: 640, lineHeight: 1.8, fontSize: '0.95rem' }}
            >
              {category.description}
            </Typography>
          )}

          {products.length > 0 && (
            <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', mt: 2, opacity: 0.7 }}>
              {INDICATIVE_PRICE_DISCLAIMER}
            </Typography>
          )}
        </Box>

        <ProductGrid products={products} />

        <Box
          component="section"
          sx={{
            mt: 10,
            pt: 8,
            borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.5rem', md: '1.9rem' },
              color: 'text.primary',
              fontFamily: 'var(--font-playfair-display), serif',
              mb: 2,
            }}
          >
            See them in person
          </Typography>
          <Typography
            sx={{
              color: 'text.secondary',
              maxWidth: 520,
              mx: 'auto',
              mb: 4,
              lineHeight: 1.8,
              fontSize: '0.9rem',
            }}
          >
            Gold is best judged in the hand. Book a private viewing at our Coimbatore store and our
            team will have pieces ready for you.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <BookAppointmentButton />
          </Box>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}
