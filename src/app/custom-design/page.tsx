import type { Metadata } from 'next';
import Navigation from '@/components/sections/Navigation';
import Footer from '@/components/sections/Footer';
import { Box, Container, Typography } from '@mui/material';
import GoldButton from '@/components/ui/GoldButton';

export const metadata: Metadata = {
  title: "Bespoke Jewellery Design | Digital Atelier",
  description: "Start your custom jewellery journey with Coimbatore's master goldsmiths. From CAD previews to hand-forged reality.",
};

export default function CustomDesignPage() {
  return (
    <Box sx={{ bgcolor: '#121212', minHeight: '100vh' }}>
      <Navigation />
      <Container component="main" maxWidth="md" sx={{ pt: 32, pb: 12, px: 3 }}>
        <Box component="header" sx={{ mb: 12, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography 
            variant="overline" 
            sx={{ 
              display: 'block',
              mb: 2, 
              color: 'rgba(212, 175, 55, 0.6)', // Using gold with opacity
              letterSpacing: '0.2em'
            }}
          >
            Bespoke Atelier
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
            Your Vision,{" "}
            <Box component="em" className="text-gradient-gold" sx={{ fontStyle: 'normal' }}>
              Our Craft
            </Box>
          </Typography>
          <Box className="divider-gold" sx={{ mt: 4 }} />
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
            Every great piece of jewellery begins with a story. Our bespoke service allows you to work directly with our master artisans to bring your unique vision to life.
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
            px: 4
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
            Digital Consultations Coming Soon
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
            We are currently integrating our CAD preview system. Please visit our physical atelier in RS Puram for design consultations.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <GoldButton href="/contact">
              Book a Visit
            </GoldButton>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}
