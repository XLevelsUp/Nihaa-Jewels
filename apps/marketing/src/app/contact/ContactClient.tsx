'use client';

import React, { useState } from "react";
import { Box, Container, Typography, Button, alpha, useTheme } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import ContactForm from "@/components/sections/ContactForm";
import { MapPin, Phone, Mail, Clock, CalendarCheck } from "lucide-react";
import BookAppointmentDialog from "@/components/catalogue/BookAppointmentDialog";
import { STORE, STORE_ADDRESS_ONE_LINE } from "@/constants/store";

// One store only. The Saibaba Colony branch never existed.
const branches = [
  {
    name: STORE.name,
    address: STORE_ADDRESS_ONE_LINE,
    phone: STORE.phone,
    // Spaces in a tel: href are rejected by some dialers, so the link uses the raw form.
    phoneHref: STORE.phoneHref,
    email: STORE.email,
    hours: STORE.hours,
  },
];

export default function ContactClient() {
  const theme = useTheme();
  const [bookingOpen, setBookingOpen] = useState(false);
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
        <Grid2 container spacing={8}>
          <Grid2 size={{ xs: 12, lg: 6 }}>
            {/* Two different things happen here, so the page says which is which:
                a booking reserves a slot and reaches staff; a message is an open enquiry. */}
            <Box
              sx={{
                bgcolor: 'var(--c-accent)',
                color: 'var(--c-ivory)',
                p: { xs: 4, md: 5 },
                mb: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Typography variant="h3" sx={{ fontSize: '1.5rem', fontFamily: 'var(--font-playfair-display), serif', color: 'inherit' }}>
                Book an Appointment
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 300, lineHeight: 1.75, color: 'inherit', opacity: 0.92 }}>
                Choose a date and time, and we will set the pieces aside for you before you arrive.
                You will get a confirmation from our team.
              </Typography>
              <Button
                onClick={() => setBookingOpen(true)}
                variant="contained"
                sx={{
                  mt: 1,
                  alignSelf: 'flex-start',
                  py: 1.6,
                  px: 4,
                  bgcolor: 'var(--c-ivory)',
                  color: 'var(--c-accent)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  borderRadius: 0,
                  boxShadow: 'none',
                  gap: 1.2,
                  '&:hover': { bgcolor: 'var(--c-icing)', boxShadow: 'none' },
                }}
              >
                <CalendarCheck size={16} strokeWidth={1.6} />
                Choose a Time
              </Button>
            </Box>
            <ContactForm />
          </Grid2>
          <Grid2 size={{ xs: 12, lg: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Box><Typography variant="h3" sx={{ fontSize: '1.5rem', color: 'text.primary', fontFamily: 'var(--font-playfair-display), serif', mb: 2 }}>Our Stores</Typography><Box sx={{ width: 40, height: 1, bgcolor: 'primary.main' }} /></Box>
              {branches.map((branch) => (
                <Box key={branch.name} sx={{ bgcolor: 'var(--c-blush)', border: '1px solid var(--c-blush)', p: 4, display: 'flex', flexDirection: 'column', gap: 3, '&:hover': { borderColor: alpha(theme.palette.primary.main, 0.3) } }}>
                  <Typography variant="h5" sx={{ color: 'primary.main', fontFamily: 'var(--font-playfair-display), serif', fontSize: '1.125rem' }}>{branch.name}</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}><MapPin size={16} strokeWidth={1.5} style={{ color: 'var(--c-accent)', marginTop: 4 }} /><Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300, lineHeight: 1.6 }}>{branch.address}</Typography></Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Phone size={16} strokeWidth={1.5} style={{ color: 'var(--c-accent)' }} /><Typography component="a" href={branch.phoneHref} variant="body2" sx={{ color: 'text.secondary', fontWeight: 300, '&:hover': { color: 'primary.main' }, textDecoration: 'none' }}>{branch.phone}</Typography></Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Mail size={16} strokeWidth={1.5} style={{ color: 'var(--c-accent)' }} /><Typography component="a" href={`mailto:${branch.email}`} variant="body2" sx={{ color: 'text.secondary', fontWeight: 300, '&:hover': { color: 'primary.main' }, textDecoration: 'none' }}>{branch.email}</Typography></Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Clock size={16} strokeWidth={1.5} style={{ color: 'var(--c-accent)' }} /><Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300 }}>{branch.hours}</Typography></Box>
                  </Box>
                </Box>
              ))}
              <Button component="a" href={`https://wa.me/${STORE.whatsapp}`} target="_blank" rel="noopener noreferrer" variant="outlined" sx={{ py: 2, borderColor: '#25D366', color: '#25D366', fontSize: '0.75rem', letterSpacing: '0.15em', gap: 1.5, borderRadius: 0, '&:hover': { bgcolor: '#25D366', color: '#2A2520', borderColor: '#25D366' } }}>
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg> Chat on WhatsApp
              </Button>
            </Box>
          </Grid2>
        </Grid2>
      </Container>

      <BookAppointmentDialog open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}