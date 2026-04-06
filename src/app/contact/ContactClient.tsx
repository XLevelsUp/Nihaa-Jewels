'use client';

import React from "react";
import { Box, Container, Typography, Button, alpha, useTheme, Grid } from "@mui/material";
import ContactForm from "@/components/sections/ContactForm";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const branches = [
  { name: "Nihaa Jewels — Flagship Store", address: "42, Jewellers Street, RS Puram, Coimbatore, Tamil Nadu 641002", phone: "+91 422 280 0000", email: "hello@nihaajewels.com", hours: "Mon–Sat: 10:00 AM – 8:00 PM" },
  { name: "Nihaa Jewels — Saibaba Colony", address: "18, Avinashi Road, Saibaba Colony, Coimbatore, Tamil Nadu 641011", phone: "+91 422 280 0001", email: "saibaba@nihaajewels.com", hours: "Mon–Sun: 10:00 AM – 9:00 PM" },
];

export default function ContactClient() {
  const theme = useTheme();
  return (
    <>
      <Box component="section" sx={{ pt: { xs: 15, md: 20 }, pb: 10, px: 3, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="overline" sx={{ display: 'block', mb: 2, color: 'primary.main', letterSpacing: '0.2em' }}>We&rsquo;re Here For You</Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: '3rem', md: '4.5rem' }, color: 'text.primary', fontFamily: 'var(--font-playfair-display), serif', lineHeight: 1.1 }}>Get in <Box component="em" className="text-gradient-gold" sx={{ fontStyle: 'normal' }}>Touch</Box></Typography>
          <Box className="divider-gold" sx={{ mx: 'auto', my: 4 }} />
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 300, maxWidth: 560, mx: 'auto', mt: 2, fontFamily: 'var(--font-inter), sans-serif', lineHeight: 1.8 }}>Whether you have a question about a piece, want to begin a bespoke journey, or simply wish to visit us — we&rsquo;d love to hear from you.</Typography>
        </Container>
      </Box>
      <Container sx={{ py: 8, px: 3, pb: 15 }}>
        <Grid container spacing={8}>
          <Grid size={{ xs: 12, lg: 6 }}><ContactForm /></Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Box><Typography variant="h3" sx={{ fontSize: '1.5rem', color: 'text.primary', fontFamily: 'var(--font-playfair-display), serif', mb: 2 }}>Our Stores</Typography><Box sx={{ width: 40, height: 1, bgcolor: 'primary.main' }} /></Box>
              {branches.map((branch) => (
                <Box key={branch.name} sx={{ bgcolor: 'background.paper', border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`, p: 4, display: 'flex', flexDirection: 'column', gap: 3, '&:hover': { borderColor: alpha(theme.palette.primary.main, 0.3) } }}>
                  <Typography variant="h5" sx={{ color: 'primary.main', fontFamily: 'var(--font-playfair-display), serif', fontSize: '1.125rem' }}>{branch.name}</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}><MapPin size={16} strokeWidth={1.5} style={{ color: alpha(theme.palette.primary.main, 0.6), marginTop: 4 }} /><Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300, lineHeight: 1.6 }}>{branch.address}</Typography></Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Phone size={16} strokeWidth={1.5} style={{ color: alpha(theme.palette.primary.main, 0.6) }} /><Typography component="a" href={`tel:${branch.phone}`} variant="body2" sx={{ color: 'text.secondary', fontWeight: 300, '&:hover': { color: 'primary.main' }, textDecoration: 'none' }}>{branch.phone}</Typography></Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Mail size={16} strokeWidth={1.5} style={{ color: alpha(theme.palette.primary.main, 0.6) }} /><Typography component="a" href={`mailto:${branch.email}`} variant="body2" sx={{ color: 'text.secondary', fontWeight: 300, '&:hover': { color: 'primary.main' }, textDecoration: 'none' }}>{branch.email}</Typography></Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Clock size={16} strokeWidth={1.5} style={{ color: alpha(theme.palette.primary.main, 0.6) }} /><Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300 }}>{branch.hours}</Typography></Box>
                  </Box>
                </Box>
              ))}
              <Button component="a" href="https://wa.me/914422800000" target="_blank" rel="noopener noreferrer" variant="outlined" sx={{ py: 2, borderColor: '#25D366', color: '#25D366', fontSize: '0.75rem', letterSpacing: '0.15em', gap: 1.5, borderRadius: 0, '&:hover': { bgcolor: '#25D366', color: '#121212', borderColor: '#25D366' } }}>
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg> Chat on WhatsApp
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
