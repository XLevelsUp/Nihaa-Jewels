import type { Metadata } from 'next';
import Navigation from '@/components/sections/Navigation';
import Footer from '@/components/sections/Footer';
import { MapPin, Phone, Clock } from 'lucide-react';
import { Box, Container, Typography, Grid, Button } from '@mui/material';

export const metadata: Metadata = {
  title: "Nihaa Jewels Store Locator | Coimbatore Showrooms",
  description: "Find a Nihaa Jewels showroom near you. Visit our flagship stores in RS Puram and Saibaba Colony, Coimbatore for a personalized luxury experience.",
};

const stores = [
  {
    name: "RS Puram Flagship",
    address: "42, Jewellers Street, RS Puram, Coimbatore, TN 641002",
    phone: "+91 422 280 0000",
    hours: "10:00 AM – 8:00 PM"
  },
  {
    name: "Saibaba Colony Boutique",
    address: "18, Avinashi Road, Saibaba Colony, Coimbatore, TN 641011",
    phone: "+91 422 280 0001",
    hours: "10:00 AM – 9:00 PM"
  }
];

export default function StoreLocatorPage() {
  return (
    <Box sx={{ bgcolor: '#121212', minHeight: '100vh' }}>
      <Navigation />
      <Container component="main" maxWidth="lg" sx={{ pt: 32, pb: 20, px: 3 }}>
        <Box component="header" sx={{ mb: 12, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography
            variant="overline"
            sx={{
              display: 'block',
              mb: 2,
              color: 'rgba(212, 175, 55, 0.6)',
              letterSpacing: '0.2em'
            }}
          >
            Visit Us
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
            Store{" "}
            <Box component="em" className="text-gradient-gold" sx={{ fontStyle: 'normal' }}>
              Locator
            </Box>
          </Typography>
          <Box className="divider-gold" sx={{ mt: 4 }} />
        </Box>

        <Grid container spacing={4}>
          {stores.map((store) => (
            <Grid item xs={12} md={6} key={store.name}>
              <Box
                sx={{
                  bgcolor: '#1a1a1a',
                  border: '1px solid rgba(212, 175, 55, 0.1)',
                  p: 6,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: '1.75rem',
                    color: '#FAF9F6',
                    fontFamily: 'var(--font-playfair-display), serif'
                  }}
                >
                  {store.name}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                    <MapPin size={18} style={{ color: '#D4AF37', flexShrink: 0, marginTop: '4px' }} />
                    <Typography variant="body2" sx={{ color: '#d6d3ce', lineHeight: 1.6 }}>
                      {store.address}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Phone size={18} style={{ color: '#D4AF37', flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: '#d6d3ce' }}>
                      {store.phone}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Clock size={18} style={{ color: '#D4AF37', flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: '#d6d3ce' }}>
                      {store.hours}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    mt: 'auto',
                    py: 1.5,
                    borderColor: 'rgba(212, 175, 55, 0.2)',
                    color: '#D4AF37',
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    borderRadius: 0,
                    '&:hover': {
                      bgcolor: '#D4AF37',
                      color: '#121212',
                      borderColor: '#D4AF37'
                    }
                  }}
                >
                  Get Directions
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
}