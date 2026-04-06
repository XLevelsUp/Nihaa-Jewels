'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Box, Container, Typography, alpha, useTheme, Grid } from '@mui/material';
import { Gem, Globe, Phone, MapPin, Mail, ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';
import { FOOTER_LINKS, SOCIAL_LINKS } from '@/constants';

export default function Footer() {
  const year = new Date().getFullYear();
  const theme = useTheme();

  return (
    <Box
      component="footer"
      id="footer"
      sx={{
        bg: '#0a0a0a',
        borderTop: '1px solid rgba(212, 175, 55, 0.1)',
        pt: 12,
        pb: 4,
        px: 3,
        bgcolor: '#0a0a0a'
      }}
    >
      <Container maxWidth="lg">
        {/* ─── Trust Badges ─── */}
        <Grid container spacing={4} sx={{ pb: 8, mb: 8, borderBottom: '1px solid rgba(212, 175, 55, 0.05)' }}>
          {[
            { icon: <Award size={24} />, title: 'BIS Hallmarked', desc: '100% Purity Guaranteed' },
            { icon: <ShieldCheck size={24} />, title: 'IGI Certified', desc: 'Authentic Diamonds' },
            { icon: <RotateCcw size={24} />, title: 'Lifetime Exchange', desc: 'Buyback & Exchange' },
            { icon: <Truck size={24} />, title: 'Insured Shipping', desc: 'Complimentary & Secure' }
          ].map((item, i) => (
            <Grid key={i} size={{ xs: 6, md: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1 }}>
                <Box sx={{ color: 'rgba(212, 175, 55, 0.6)', transition: '0.5s', '&:hover': { color: '#D4AF37' } }}>
                  {item.icon}
                </Box>
                <Typography variant="caption" sx={{ color: '#FAF9F6', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                  {item.title}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(214, 211, 206, 0.4)', fontSize: '0.55rem', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  {item.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* ─── Main Footer Content ─── */}
        <Grid container spacing={8} sx={{ mb: 10 }}>
          {/* Brand & Story */}
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box component={Link} href="/" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none' }}>
                <Box sx={{ color: '#D4AF37' }}>
                  <Gem size={22} strokeWidth={1.5} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 700, fontFamily: 'var(--font-playfair-display), serif', lineHeight: 1 }}>
                    Nihaa
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(250, 249, 246, 0.4)', fontSize: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.5em', fontWeight: 500, display: 'block' }}>
                    Jewels
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(214, 211, 206, 0.6)', fontSize: '0.75rem', fontWeight: 300, lineHeight: 1.8, maxWidth: 320 }}>
                Crafting heirlooms for four generations. Our pieces blend the sacred traditions of Coimbatore with modern silhouettes, ensuring every jewel tells a story of elegance and devotion.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {SOCIAL_LINKS.map((social) => (
                  <Box
                    key={social.label}
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      width: 36,
                      height: 36,
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(214, 211, 206, 0.3)',
                      transition: '0.5s',
                      '&:hover': { color: '#D4AF37', borderColor: 'rgba(212, 175, 55, 0.3)', transform: 'translateY(-3px)' }
                    }}
                  >
                    <Globe size={16} strokeWidth={1.5} />
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Links columns */}
          {FOOTER_LINKS.map((column) => (
            <Grid key={column.heading} size={{ xs: 6, md: 3, lg: 2 }}>
              <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 700, display: 'block', mb: 4, textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                {column.heading}
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {column.links.map((link) => (
                  <Box component="li" key={link.label}>
                    <Box
                      component={Link}
                      href={link.href}
                      sx={{
                        color: 'rgba(214, 211, 206, 0.4)',
                        fontSize: '0.75rem',
                        fontWeight: 300,
                        textDecoration: 'none',
                        transition: '0.3s',
                        letterSpacing: '0.05em',
                        '&:hover': { color: '#FAF9F6' }
                      }}
                    >
                      {link.label}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}

          {/* Contact Section */}
          <Grid size={{ xs: 12, md: 6, lg: 2 }}>
            <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 700, display: 'block', mb: 4, textTransform: 'uppercase', letterSpacing: '0.3em' }}>
              The Atelier
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                <MapPin size={14} style={{ color: 'rgba(212, 175, 55, 0.6)', marginTop: '4px', flexShrink: 0 }} />
                <Typography variant="caption" sx={{ color: 'rgba(214, 211, 206, 0.5)', fontWeight: 300, lineHeight: 1.6 }}>
                  42, Jewellers Street, RS Puram,<br />Coimbatore, TN 641002
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Phone size={14} style={{ color: 'rgba(212, 175, 55, 0.6)', flexShrink: 0 }} />
                <Typography variant="caption" sx={{ color: 'rgba(214, 211, 206, 0.5)', fontWeight: 300 }}>
                  +91 422 280 0000
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Mail size={14} style={{ color: 'rgba(212, 175, 55, 0.6)', flexShrink: 0 }} />
                <Typography variant="caption" sx={{ color: 'rgba(214, 211, 206, 0.5)', fontWeight: 300 }}>
                  concierge@nihaajewels.com
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* ─── Bottom copyright bar ─── */}
        <Box sx={{ pt: 5, borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 4 }, flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ color: 'rgba(214, 211, 206, 0.2)', textTransform: 'uppercase', letterSpacing: '0.25em', fontWeight: 500 }}>
              © {year} Nihaa Jewels. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              {['Privacy', 'Terms', 'Gifts'].map((item) => (
                <Typography
                  key={item}
                  component={Link}
                  href="#"
                  variant="caption"
                  sx={{ color: 'rgba(214, 211, 206, 0.2)', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 500, textDecoration: 'none', '&:hover': { color: '#D4AF37' } }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography
              variant="caption"
              sx={{ color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Box component="span" sx={{ opacity: 0.6, fontWeight: 300, fontStyle: 'italic' }}>Built with</Box>
              <Box component="span" className="text-[#FF3B30] text-sm leading-none animate-pulse">❤️</Box>
              <Box component="span" sx={{ opacity: 0.6, fontWeight: 300, fontStyle: 'italic' }}>by</Box>
              <Box
                component="a"
                href="https://xlevelsup.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: '#fff', textDecoration: 'underline', textUnderlineOffset: 4, textDecorationColor: 'rgba(255, 255, 255, 0.1)', '&:hover': { color: '#D4AF37', textDecorationColor: 'rgba(212, 175, 55, 0.5)' }, transition: '0.5s' }}
              >
                XLevelsUp
              </Box>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}