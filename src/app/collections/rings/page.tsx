'use client';

import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  alpha, 
  useTheme 
} from '@mui/material';
import Navigation from '@/components/sections/Navigation';
import Footer from '@/components/sections/Footer';

// Metadata (Note: Will be ignored in 'use client' by Next.js, but user said not to fix other things)
// export const metadata = { ... };

export default function RingsPage() {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navigation />
      <Container component="main" maxWidth="lg" sx={{ pt: 20, pb: 12, px: 3 }}>
        <Box component="header" sx={{ mb: 10 }}>
          <Typography 
            variant="overline" 
            sx={{ 
              display: 'block',
              mb: 1, 
              color: alpha(theme.palette.primary.main, 0.6),
              letterSpacing: '0.2em'
            }}
          >
            Collection
          </Typography>
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem' }, 
              color: 'text.primary',
              fontFamily: 'var(--font-playfair-display), serif'
            }}
          >
            Signature{" "}
            <Box component="em" className="text-gradient-gold" sx={{ fontStyle: 'normal' }}>
              Rings
            </Box>
          </Typography>
          <Box sx={{ width: 56, height: 1, bgcolor: 'primary.main', mt: 3 }} />
        </Box>

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
            minHeight: '300px'
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary', 
              fontFamily: 'var(--font-playfair-display), serif',
              fontStyle: 'italic',
              fontSize: '1.25rem',
              opacity: 0.5
            }}
          >
            The full collection is being curated and will be unveiled shortly.
          </Typography>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}
