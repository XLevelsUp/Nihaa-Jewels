'use client';

import Link from 'next/link';
import { Box, Container, Typography, alpha, useTheme } from '@mui/material';

import Navigation from '@/components/sections/Navigation';
import Footer from '@/components/sections/Footer';
import GoldButton from '@/components/ui/GoldButton';
import type { Category } from '@/types/database';

interface NotFoundClientProps {
  categories: Pick<Category, 'id' | 'slug' | 'name'>[];
}

export default function NotFoundClient({ categories }: NotFoundClientProps) {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navigation />

      <Container component="main" maxWidth="md" sx={{ pt: 22, pb: 14, px: 3, textAlign: 'center' }}>
        <Typography
          variant="overline"
          sx={{
            display: 'block',
            color: alpha(theme.palette.primary.main, 0.6),
            letterSpacing: '0.25em',
            fontSize: '0.7rem',
            mb: 2,
          }}
        >
          Error 404
        </Typography>

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.25rem', md: '3.25rem' },
            color: 'text.primary',
            fontFamily: 'var(--font-playfair-display), serif',
            lineHeight: 1.2,
          }}
        >
          This piece has{' '}
          <Box component="em" className="text-gradient-gold" sx={{ fontStyle: 'normal' }}>
            slipped away
          </Box>
        </Typography>

        <Box sx={{ width: 56, height: 1, bgcolor: 'primary.main', mx: 'auto', mt: 4, mb: 4 }} />

        <Typography
          sx={{
            color: 'text.secondary',
            maxWidth: 480,
            mx: 'auto',
            lineHeight: 1.9,
            fontSize: '0.95rem',
            mb: 5,
          }}
        >
          The page you were looking for is no longer here. It may have been moved, or the address
          mistyped. Our collections are waiting below.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            flexWrap: 'wrap',
            mb: categories.length > 0 ? 8 : 0,
          }}
        >
          <GoldButton href="/collections" icon>
            View Collections
          </GoldButton>
          <GoldButton href="/" variant="outline">
            Return Home
          </GoldButton>
        </Box>

        {categories.length > 0 && (
          <Box
            component="section"
            sx={{ pt: 7, borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.12)}` }}
          >
            <Typography
              variant="overline"
              sx={{
                display: 'block',
                color: alpha(theme.palette.primary.main, 0.6),
                letterSpacing: '0.2em',
                fontSize: '0.65rem',
                mb: 3,
              }}
            >
              Explore Instead
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
              {categories.map((category) => (
                <Box
                  key={category.id}
                  component={Link}
                  href={`/collections/${category.slug}`}
                  sx={{
                    px: 2.5,
                    py: 1.25,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    color: 'text.secondary',
                    fontSize: '0.8rem',
                    letterSpacing: '0.05em',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  {category.name}
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Container>

      <Footer />
    </Box>
  );
}
