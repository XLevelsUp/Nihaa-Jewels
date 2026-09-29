import type { Metadata } from 'next';
import { STORE, STORE_ADDRESS_ONE_LINE } from '@/constants/store';
import Navigation from '@/components/sections/NavigationServer';
import Footer from '@/components/sections/Footer';
import { MapPin, Phone, Clock } from 'lucide-react';
import { Box, Container, Typography, Button } from '@mui/material';
import Grid2 from "@mui/material/Grid2";


export const metadata: Metadata = {
  title: "Visit Our Store in RS Puram | Nihaa Jewels Coimbatore",
  description: "Visit the Nihaa Jewels showroom in RS Puram, Coimbatore for a personalised experience with our goldsmiths.",
};

// One store only. The Saibaba Colony branch never existed.
const stores = [
  {
    name: 'Nihaa Jewels, RS Puram',
    address: STORE_ADDRESS_ONE_LINE,
    phone: STORE.phone,
    hours: STORE.hours,
  },
];

export default function StoreLocatorPage() {
  return (
    <Box sx={{ bgcolor: 'var(--c-page)', minHeight: '100vh' }}>
      <Navigation />
      <Container component="main" maxWidth="lg" sx={{ pt: { xs: 20, md: 32 }, pb: { xs: 12, md: 20 }, px: 3 }}>
        <Box component="header" sx={{ mb: { xs: 7, md: 12 }, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography
            variant="overline"
            sx={{
              display: 'block',
              mb: 2,
              color: 'var(--c-accent)',
              letterSpacing: '0.2em'
            }}
          >
            Visit Us
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              color: '#2A2520',
              fontFamily: 'var(--font-playfair-display), serif',
              lineHeight: 1.2
            }}
          >
            Our{" "}
            <Box component="em" className="text-gradient-gold" sx={{ fontStyle: 'normal' }}>
              Showroom
            </Box>
          </Typography>
          <Box className="divider-gold" sx={{ mt: 4 }} />
        </Box>

        <Grid2 container spacing={4} justifyContent="center">
          {stores.map((store) => (
            // A single store reads as a lone half-width card against empty space, so it
            // takes a centred, readable column instead of half the grid.
            <Grid2 size={{ xs: 12, sm: 10, md: 8, lg: 7 }} key={store.name}>
              <Box
                sx={{
                  bgcolor: 'var(--c-blush)',
                  border: '1px solid rgba(95, 100, 64, 0.1)',
                  p: { xs: 3.5, sm: 5, md: 6 },
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
                    color: '#2A2520',
                    fontFamily: 'var(--font-playfair-display), serif'
                  }}
                >
                  {store.name}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                    <MapPin size={18} style={{ color: '#5F6440', flexShrink: 0, marginTop: '4px' }} />
                    <Typography variant="body2" sx={{ color: '#55524A', lineHeight: 1.6 }}>
                      {store.address}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Phone size={18} style={{ color: '#5F6440', flexShrink: 0 }} />
                    <Typography
                      component="a"
                      href={STORE.phoneHref}
                      variant="body2"
                      sx={{
                        color: '#55524A',
                        textDecoration: 'none',
                        '&:hover': { color: 'var(--c-accent)' },
                      }}
                    >
                      {store.phone}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Clock size={18} style={{ color: '#5F6440', flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: '#55524A' }}>
                      {store.hours}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  component="a"
                  href={STORE.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  fullWidth
                  sx={{
                    mt: 'auto',
                    py: 1.75,
                    borderColor: 'rgba(95, 100, 64, 0.2)',
                    color: '#5F6440',
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    borderRadius: 0,
                    '&:hover': {
                      bgcolor: '#5F6440',
                      // Ivory, not dark text: #2A2520 on sage was 2.44:1.
                      color: 'var(--c-ivory)',
                      borderColor: '#5F6440'
                    }
                  }}
                >
                  Get Directions
                </Button>
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Container>
      <Footer />
    </Box>
  );
}
