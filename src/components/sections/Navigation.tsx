'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AppBar, Toolbar, Container, Box, Typography, IconButton, Button, alpha, useTheme, Stack } from '@mui/material';
import { Menu, X, Gem, Search, Phone, ChevronDown, ArrowRight, Heart } from 'lucide-react';
import { NAV_LINKS, COLLECTIONS_SUBMENU } from '@/constants';

/* ─── Sub-Components ───────────────────────────── */

const Logo = () => (
  <Box
    component={Link}
    href="/"
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      textDecoration: 'none',
      flexShrink: 0,
      '&:hover .logo-gem': { transform: 'rotate(15deg)' }
    }}
    aria-label="Nihaa Jewels Home"
  >
    <Box sx={{ position: 'relative' }}>
      <Box
        className="logo-gem"
        sx={{
          color: '#D4AF37',
          filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.4))',
          transition: 'transform 0.3s ease',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Gem size={24} strokeWidth={1.5} />
      </Box>
    </Box>
    <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
      <Typography
        variant="h6"
        sx={{
          color: '#D4AF37',
          fontSize: '1.5rem',
          fontWeight: 700,
          tracking: '-0.02em',
          fontFamily: 'var(--font-playfair-display), serif',
          textShadow: '0 0 12px rgba(212, 175, 55, 0.2)'
        }}
      >
        Nihaa
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: 'rgba(250, 249, 246, 0.4)',
          fontSize: '0.45rem',
          tracking: '0.5em',
          textTransform: 'uppercase',
          fontWeight: 500,
          mt: -0.5,
          ml: 0.1
        }}
      >
        Jewels
      </Typography>
    </Box>
  </Box>
);

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const theme = useTheme();

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }, [pathname]);

  const activeLink = pathname;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          background: scrolled ? 'rgba(18, 18, 18, 0.85)' : '#121212',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          py: scrolled ? 1 : 2.5,
          borderBottom: scrolled ? '1px solid rgba(212, 175, 55, 0.1)' : '1px solid rgba(255, 255, 255, 0.03)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Logo />

            {/* Desktop Nav */}
            <Box
              component="nav"
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: { md: 5, lg: 8 }
              }}
            >
              {NAV_LINKS.map(link => {
                const isActive = activeLink === link.href || (link.label === 'Collections' && activeLink.startsWith('/collections'));

                if (link.label === 'Collections') {
                  return (
                    <Box
                      key="desktop-collections"
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                      sx={{ position: 'relative' }}
                    >
                      <Button
                        disableRipple
                        sx={{
                          color: isActive ? '#D4AF37' : 'rgba(214, 211, 206, 0.6)',
                          fontSize: '0.7rem',
                          fontWeight: 500,
                          textTransform: 'uppercase',
                          letterSpacing: '0.2em',
                          p: 0,
                          minWidth: 'auto',
                          '&:hover': { color: '#D4AF37', bgcolor: 'transparent' },
                          transition: 'color 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        Collections
                        <ChevronDown size={12} style={{ transition: 'transform 0.3s ease', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }} />
                      </Button>

                      <AnimatePresence>
                        {dropdownOpen && (
                          <Box
                            component={motion.div}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            sx={{
                              position: 'absolute',
                              top: '100%',
                              left: -160,
                              mt: 3,
                              width: 650,
                              bgcolor: '#1a1a1a',
                              border: '1px solid rgba(212, 175, 55, 0.15)',
                              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                              display: 'grid',
                              gridTemplateColumns: '1.2fr 1fr',
                              overflow: 'hidden',
                              zIndex: 1000
                            }}
                          >
                            <Box sx={{ p: 4, borderRight: '1px solid rgba(212, 175, 55, 0.08)' }}>
                              <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 700, mb: 3, display: 'block', textTransform: 'uppercase', letterSpacing: '0.25em' }}>
                                Categories
                              </Typography>
                              <Stack spacing={2.5}>
                                {COLLECTIONS_SUBMENU.map(item => (
                                  <Box
                                    key={item.label}
                                    component={Link}
                                    href={item.href}
                                    sx={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      textDecoration: 'none',
                                      '&:hover .cat-label': { color: '#D4AF37', transform: 'translateX(4px)' }
                                    }}
                                  >
                                    <Typography
                                      className="cat-label"
                                      sx={{
                                        color: '#FAF9F6',
                                        fontSize: '0.75rem',
                                        fontWeight: 500,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.15em',
                                        transition: 'all 0.3s ease'
                                      }}
                                    >
                                      {item.label}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(214, 211, 206, 0.3)', fontWeight: 300, mt: 0.2 }}>
                                      {item.desc}
                                    </Typography>
                                  </Box>
                                ))}
                              </Stack>
                            </Box>

                            {/* Visual Featured Area */}
                            <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: 350, '&:hover .feat-img': { transform: 'scale(1.05)' } }}>
                              <Box
                                className="feat-img"
                                sx={{
                                  position: 'absolute',
                                  inset: 0,
                                  transition: 'transform 1.2s cubic-bezier(0.2, 0, 0.2, 1)'
                                }}
                              >
                                <Image
                                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80"
                                  alt="Featured Collection"
                                  fill
                                  style={{ objectFit: 'cover' }}
                                />
                              </Box>
                              <Box
                                sx={{
                                  position: 'absolute',
                                  inset: 0,
                                  background: 'linear-gradient(to top, rgba(18, 18, 18, 0.9), transparent)',
                                  p: 4,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'end'
                                }}
                              >
                                <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 700, mb: 1, textTransform: 'uppercase', letterSpacing: '0.25em' }}>
                                  Editor&apos; Pick
                                </Typography>
                                <Typography variant="h5" sx={{ color: '#fff', mb: 2, fontFamily: 'var(--font-playfair-display), serif', lineHeight: 1.2 }}>
                                  The Heritage <br /> Gold Series
                                </Typography>
                                <Box
                                  component={Link}
                                  href="/collections/temple"
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    color: '#fff',
                                    fontSize: '0.625rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.2em',
                                    textDecoration: 'none',
                                    '&:hover': { color: '#D4AF37' },
                                    transition: 'color 0.3s ease'
                                  }}
                                >
                                  View Collection <ArrowRight size={12} />
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        )}
                      </AnimatePresence>
                    </Box>
                  );
                }

                return (
                  <Box
                    key={link.label}
                    component={Link}
                    href={link.href}
                    sx={{
                      color: isActive ? '#D4AF37' : 'rgba(214, 211, 206, 0.6)',
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      textDecoration: 'none',
                      position: 'relative',
                      py: 0.5,
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: isActive ? '100%' : '0%',
                        height: '1px',
                        background: 'linear-gradient(90deg, #D4AF37, transparent)',
                        transition: 'width 0.4s ease'
                      },
                      '&:hover': { color: '#D4AF37' },
                      '&:hover::after': { width: '100%' }
                    }}
                  >
                    {link.label}
                  </Box>
                );
              })}
            </Box>

            {/* Icons & CTA */}
            <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center">
              <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 1 }}>
                <IconButton sx={{ color: 'rgba(214, 211, 206, 0.4)', '&:hover': { color: '#D4AF37' } }}>
                  <Search size={19} strokeWidth={1.5} />
                </IconButton>
                <IconButton sx={{ color: 'rgba(214, 211, 206, 0.4)', '&:hover': { color: '#D4AF37' } }}>
                  <Heart size={19} strokeWidth={1.5} />
                </IconButton>
              </Box>

              <Button
                component={Link}
                href="/contact"
                disableElevation
                variant="contained"
                sx={{
                  bgcolor: '#D4AF37',
                  color: '#121212',
                  px: { xs: 2.5, sm: 4 },
                  py: 1,
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  borderRadius: 0,
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': { bgcolor: '#E8C84E' },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(100%)',
                    transition: 'transform 0.3s ease'
                  },
                  '&:hover::before': { transform: 'translateY(0)' }
                }}
              >
                Inquire
              </Button>

              <IconButton
                sx={{ display: { md: 'none' }, color: '#FAF9F6' }}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle Menu"
              >
                {menuOpen ? <X size={26} /> : <Menu size={26} />}
              </IconButton>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            sx={{
              position: 'fixed',
              inset: 0,
              zIndex: 1050,
              bgcolor: '#121212',
              display: 'flex',
              flexDirection: 'column',
              pt: 16,
              px: 4
            }}
          >
            <Stack spacing={4}>
              {NAV_LINKS.map((link, i) => (
                <Box
                  key={`mob-${link.label}`}
                  component={motion.div}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    style={{ textDecoration: 'none' }}
                  >
                    <Typography
                      sx={{
                        fontSize: '2.5rem',
                        fontFamily: 'var(--font-playfair-display), serif',
                        color: '#FAF9F6',
                        pb: 2,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        '&:hover': { color: '#D4AF37' },
                        transition: 'color 0.3s ease'
                      }}
                    >
                      {link.label}
                    </Typography>
                  </Link>
                </Box>
              ))}
            </Stack>

            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              sx={{ mt: 'auto', pb: 6, display: 'flex', flexDirection: 'column', gap: 3 }}
            >
              <Box
                component="a"
                href="tel:+914222800000"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  color: '#D4AF37',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em'
                }}
              >
                <Phone size={18} />
                +91 422 280 0000
              </Box>
              <Stack direction="row" spacing={4} sx={{ color: 'rgba(214, 211, 206, 0.3)' }}>
                <Search size={22} />
                <Heart size={22} />
              </Stack>
            </Box>
          </Box>
        )}
      </AnimatePresence>
    </>
  );
}
