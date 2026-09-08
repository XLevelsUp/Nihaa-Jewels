import type { Metadata } from 'next';
import Navigation from '@/components/sections/Navigation';
import Footer from '@/components/sections/Footer';
import { Box, Container, Typography, Button } from '@mui/material';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Luxury Jewellery Gifting — Nihaa Jewels",
  description: "Give a gift that lasts beyond a lifetime. Explore our curated range of fine jewellery gifts for your most precious moments.",
};

export default function GiftingPage() {
  return (
    <Box sx={{ bgcolor: '#121212', minHeight: '100vh' }}>
      <Navigation />
      <Container component="main" maxWidth="md" sx={{ pt: 32, pb: 12, px: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box component="header" sx={{ mb: 12 }}>
          <Typography
            variant="overline"
            sx={{
              display: 'block',
              mb: 2,
              color: 'rgba(212, 175, 55, 0.6)',
              letterSpacing: '0.2em'
            }}
          >
            Art of Giving
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              color: '#FAF9F6',
              fontFamily: 'var(--font-playfair-display), serif',
              lineHeight: 1.2
            }}
          >
            Curated{" "}
            <Box component="em" className="text-gradient-gold" sx={{ fontStyle: 'normal' }}>
              Gifting
            </Box>
          </Typography>
          <Box className="divider-gold" sx={{ mt: 4, mx: 'auto' }} />
          <Typography
            variant="body1"
            sx={{
              color: '#d6d3ce',
              fontWeight: 300,
              maxWidth: 600,
              mx: 'auto',
              mt: 4,
              fontFamily: 'var(--font-inter), sans-serif',
              lineHeight: 1.8
            }}
          >
            From anniversaries to life&apos;s milestones, discover the perfect gift from our signature gold and diamond collections.
          </Typography>
        </Box>

        <Box
          component="section"
          sx={{
            mt: 10,
            py: 10,
            border: '1px solid rgba(212, 175, 55, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            px: 8,
            width: '100%',
            maxWidth: '600px'
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: '1.5rem',
              color: '#FAF9F6',
              mb: 2,
              fontFamily: 'var(--font-playfair-display), serif'
            }}
          >
            Gift Catalog Coming Soon
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(214, 211, 206, 0.6)',
              fontSize: '0.875rem',
              maxWidth: 448,
              mx: 'auto'
            }}
          >
            Our digital gifting suite is currently being refined to provide the most seamless experience.
          </Typography>
          <Link href="/collections/rings" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              className="btn-gold-shimmer"
              sx={{
                mt: 8,
                px: 6,
                py: 2,
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                borderRadius: 0
              }}
            >
              Explore Collections
            </Button>
          </Link>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}