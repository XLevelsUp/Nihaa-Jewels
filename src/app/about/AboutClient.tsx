'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Container, Typography, Button, useTheme, alpha } from "@mui/material";
import Grid2 from "@mui/material/Grid2";

const milestones = [
  { year: "1986", title: "The Beginning", desc: "Founded in a small workshop in Coimbatore by master goldsmith A. Krishnamurthy." },
  { year: "1997", title: "The Second Generation", desc: "Expanded into diamond jewellery and introduced BIS hallmarking." },
  { year: "2008", title: "Bridal Collections", desc: "Launched the iconic Bridal Edit — traditional South Indian motifs with contemporary design." },
  { year: "2018", title: "Bespoke Atelier", desc: "Opened a dedicated bespoke studio offering fully custom design consultations." },
  { year: "2024", title: "The Digital Chapter", desc: "Bringing the Nihaa Jewels experience online for a new generation." },
];

export default function AboutClient() {
  const theme = useTheme();
  return (
    <>
      <Box component="section" sx={{ position: 'relative', height: { xs: '60vh', md: '70vh' }, minHeight: '520px', display: 'flex', alignItems: 'end', justifyContent: 'center', overflow: 'hidden' }}>
        <Image src="https://images.unsplash.com/photo-1599643478524-fb506461a4fb?w=1600&q=85&auto=format&fit=crop" alt="Artisan goldsmith" fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #121212, rgba(18, 18, 18, 0.4), transparent)' }} />
        <Box sx={{ position: 'relative', zIndex: 10, textAlign: 'center', pb: 12, px: 2 }}>
          <Typography variant="overline" sx={{ display: 'block', mb: 2, color: 'primary.main', fontWeight: 500, letterSpacing: '0.28em', fontSize: '0.75rem' }}>Est. 1986 · Coimbatore, India</Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.75rem', md: '5rem' }, color: 'text.primary', lineHeight: 1.1, fontFamily: 'var(--font-playfair-display), serif' }}>A Legacy Written <Box component="em" className="text-gradient-gold" sx={{ fontStyle: 'normal' }}>in Gold</Box></Typography>
        </Box>
      </Box>
      <Container component="section" maxWidth="lg" sx={{ py: { xs: 10, md: 15 }, px: 3 }}>
        <Grid2 container spacing={8} alignItems="center">
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.22em' }}>Our Story</Typography>
              <Typography variant="h2" sx={{ color: 'text.primary', fontFamily: 'var(--font-playfair-display), serif', fontSize: { xs: '2.25rem', md: '3rem' } }}>Mastery Passed Through Generations</Typography>
              <Box sx={{ width: 64, height: 1, bgcolor: 'primary.main' }} />
              <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 300, lineHeight: 1.8 }}>Every piece is a testament to the skill of our master artisans. Rooted in tradition but looking towards the future.</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 300, lineHeight: 1.8 }}>We draw inspiration from royal courts and ancient temples — ensuring each piece is unique.</Typography>
            </Box>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box sx={{ position: 'relative', height: { xs: 400, md: 600 }, width: '100%', overflow: 'hidden' }}>
              <Image src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=900&q=85&auto=format&fit=crop" alt="Craftsmanship" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
              <Box sx={{ position: 'absolute', inset: 0, border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`, m: 2 }} />
            </Box>
          </Grid2>
        </Grid2>
      </Container>
      <Box component="section" sx={{ py: { xs: 10, md: 15 }, px: 3, bgcolor: '#0d0d0d' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.2em' }}>Responsibility</Typography>
            <Typography variant="h2" sx={{ color: 'primary.main', fontFamily: 'var(--font-playfair-display), serif', fontSize: { xs: '2rem', md: '2.5rem' } }}>Ethical Sourcing & Sustainability</Typography>
            <Box className="divider-gold" sx={{ mx: 'auto' }} />
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 300, fontSize: '1.2rem', lineHeight: 1.8 }}>Certified conflict-free diamonds and fair-wage artisan workshops.</Typography>
            <Grid2 container spacing={4} sx={{ pt: 8, mt: 4, borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
              {[{ stat: "100%", label: "Conflict-Free" }, { stat: "Fair Wage", label: "Workshops" }, { stat: "BIS", label: "Hallmarked" }].map((item) => (
                <Grid2 key={item.stat} size={{ xs: 12, md: 4 }}><Box sx={{ textAlign: 'center' }}><Typography variant="h4" sx={{ color: 'primary.main', mb: 1, fontFamily: 'var(--font-playfair-display), serif' }}>{item.stat}</Typography><Typography variant="caption" sx={{ color: alpha(theme.palette.text.secondary, 0.6), textTransform: 'uppercase', letterSpacing: '0.15em' }}>{item.label}</Typography></Box></Grid2>
              ))}
            </Grid2>
          </Box>
        </Container>
      </Box>
      <Container component="section" maxWidth="md" sx={{ py: 15, px: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 10 }}><Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.2em' }}>Our Journey</Typography><Typography variant="h2" sx={{ color: 'text.primary', mt: 2, fontFamily: 'var(--font-playfair-display), serif', fontSize: { xs: '2.25rem', md: '3rem' } }}>Four Decades of Excellence</Typography><Box className="divider-gold" sx={{ mx: 'auto' }} /></Box>
        <Box component="ol" sx={{ listStyle: 'none', p: 0, m: 0, position: 'relative', borderLeft: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`, ml: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {milestones.map((m) => (
            <Box component="li" key={m.year} sx={{ pl: 6, position: 'relative' }}>
              <Box sx={{ position: 'absolute', left: -11, top: 4, width: 21, height: 21, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: 'background.default' }} /></Box>
              <Typography variant="caption" sx={{ color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.18em', display: 'block', mb: 1 }}>{m.year}</Typography>
              <Typography variant="h5" sx={{ color: 'text.primary', mb: 1.5, fontFamily: 'var(--font-playfair-display), serif', fontSize: '1.5rem' }}>{m.title}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300, lineHeight: 1.8 }}>{m.desc}</Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </>
  );
}