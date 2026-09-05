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

export default function CareGuidePage() {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navigation />
      
      <Container 
        component="main" 
        maxWidth="md" 
        sx={{ pt: 20, pb: 12, px: 3 }}
      >
        <Box component="header" sx={{ mb: 10, textAlign: 'center' }}>
          <Typography 
            variant="overline" 
            sx={{ 
              display: 'block',
              mb: 1, 
              color: alpha(theme.palette.primary.main, 0.6),
              letterSpacing: '0.2em'
            }}
          >
            Preserving Beauty
          </Typography>
          
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem' }, 
              color: 'text.primary',
              fontFamily: 'var(--font-playfair-display), serif'
            }}
          >
            Care{" "}
            <Box component="em" className="text-gradient-gold" sx={{ fontStyle: 'normal' }}>
              Guide
            </Box>
          </Typography>
          
          <Box className="divider-gold" sx={{ mx: 'auto', my: 4 }} />
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary', 
              fontWeight: 300, 
              mt: 4, 
              lineHeight: 1.8, 
              maxWidth: 640, 
              mx: 'auto' 
            }}
          >
            Fine jewellery is an investment in beauty. Proper care and regular maintenance will ensure your Nihaa Jewels pieces remain as radiant as the day they were crafted.
          </Typography>
        </Box>

        <Box component="article" sx={{ display: 'flex', flexDirection: 'column', gap: 10, mt: 8 }}>
          <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                color: 'text.primary', 
                fontWeight: 600,
                fontSize: '1.5rem',
                fontFamily: 'var(--font-playfair-display), serif'
              }}
            >
              Gold Jewellery Care
            </Typography>
            <Box sx={{ width: 40, height: 1, bgcolor: alpha(theme.palette.primary.main, 0.4) }} />
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: '0.95rem' }}>
              Avoid contact with household chemicals like bleach or ammonia. For light cleaning, use lukewarm water and a mild dish soap with a soft-bristled brush. Store your pieces individually in the provided Nihaa Jewels pouch to prevent scratching.
            </Typography>
          </Box>

          <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                color: 'text.primary', 
                fontWeight: 600,
                fontSize: '1.5rem',
                fontFamily: 'var(--font-playfair-display), serif'
              }}
            >
              Diamond Maintenance
            </Typography>
            <Box sx={{ width: 40, height: 1, bgcolor: alpha(theme.palette.primary.main, 0.4) }} />
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: '0.95rem' }}>
              Diamonds are incredibly durable but can lose their brilliance if coated in oils or dirt. Clean regularly using an ammonia-free solution specifically designed for fine jewellery. We offer complimentary professional cleaning for all Nihaa Jewels pieces at our showrooms.
            </Typography>
          </Box>

          <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                color: 'text.primary', 
                fontWeight: 600,
                fontSize: '1.5rem',
                fontFamily: 'var(--font-playfair-display), serif'
              }}
            >
              Regular Inspections
            </Typography>
            <Box sx={{ width: 40, height: 1, bgcolor: alpha(theme.palette.primary.main, 0.4) }} />
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: '0.95rem' }}>
              We recommend bringing your bridal and heavy sets for a professional inspection every 12 months to check stone settings and clasps.
            </Typography>
          </Box>
        </Box>
      </Container>
      
      <Footer />
    </Box>
  );
}
