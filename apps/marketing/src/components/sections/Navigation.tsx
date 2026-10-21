'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AppBar, Toolbar, Container, Box, Typography,
  IconButton, Stack
} from '@mui/material';
import {
  MapPin, Heart, User, Phone,
  Menu, X, ChevronRight, ArrowRight, CalendarCheck,
  ShieldCheck, Scale, RotateCcw, Baby, Feather
} from 'lucide-react';

import BookAppointmentDialog from '@/components/catalogue/BookAppointmentDialog';

export interface NavItem {
  label: string;
  href: string;
  badge?: string | null;
  description?: string | null;
  heroImagePath?: string | null;
  columns: { title: string; items: { label: string; href: string }[] }[];
}

/* ─── Featured showcase per category (displayed in mega-menu right panel) ── */

/* ─── Micro icons for mega-menu sub-items ─────────────────────────── */
const getItemIcon = (name: string) => {
  const s = { size: 13, strokeWidth: 1.4, style: { marginRight: 7, opacity: 0.6, flexShrink: 0 } as React.CSSProperties };
  const l = name.toLowerCase();
  if (l === 'women')                            return <User {...s} />;
  if (l === 'men' || l === 'unisex')            return <User {...s} />;
  if (l === 'kids')                             return <Baby {...s} />;
  if (l === 'couple' || l === 'couples')        return <Heart {...s} />;
  if (l.includes('light') || l.includes('everyday')) return <Feather {...s} />;
  return null;
};

/* ─── Logo ──────────────────────────────────────────────────────── */
// Mark plus wordmark; 'light' sits on the burgundy bar and the hero film, 'dark' on the white mobile drawer.
const Logo = ({ tone = 'light' }: { tone?: 'light' | 'dark' }) => (
  <Box
    component={Link}
    href="/"
    aria-label="Sakthi Chains, home"
    sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.25, md: 1.5 }, textDecoration: 'none', flexShrink: 0 }}
  >
    <Box
      component="img"
      src={tone === 'light' ? '/images/brand/logo-champagne.png' : '/images/brand/logo-amber.png'}
      alt=""
      sx={{ height: { xs: 30, md: 34 }, width: 'auto', objectFit: 'contain' }}
    />
    <Typography
      component="span"
      sx={{
        fontFamily: 'var(--font-cormorant), Georgia, serif',
        fontWeight: 700,
        fontSize: { xs: '0.98rem', md: '1.12rem' },
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        color: tone === 'light' ? 'var(--c-champagne)' : 'var(--c-burgundy)',
      }}
    >
      Sakthi Chains
    </Typography>
  </Box>
);

/* ─── Trust pills (bottom of mega-menu) ────────────────────────── */
const TRUST_ITEMS = [
  { icon: <ShieldCheck size={14} />,   text: 'BIS 916 Hallmarked' },
  { icon: <Scale size={14} />,         text: "Priced at Today's Gold Rate" },
  { icon: <RotateCcw size={14} />,     text: 'Lifetime Exchange' },
  { icon: <CalendarCheck size={14} />, text: 'By Appointment' },
];

/* ═══════════════════════════════════════════════════════════════════
   NAVIGATION COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function Navigation({ items }: { items: NavItem[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  /* scroll listener */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* close on route change */
  useEffect(() => {
    setMenuOpen(false);
    setActiveMega(null);
    setMobileExpanded(null);
  }, [pathname]);

  const isHome = pathname === '/';
  const overHero = isHome && !scrolled && !activeMega;

  /* debounced mouse leave to prevent flicker */
  const handleBarLeave = () => {
    leaveTimer.current = setTimeout(() => setActiveMega(null), 180);
  };
  const handleBarEnter = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  };

  /* ─────────────────────────── render ─────────────────────────── */
  return (
    <>
      {/* SEO hidden text */}
      <Box sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        <Typography variant="body1">
          Sakthi Chains, fine BIS hallmarked gold jewellery made by hand. Chains, bridal, daily wear, gifting and bespoke commissions, by appointment.
        </Typography>
      </Box>

      {/* ============================================================
          APP BAR
          ============================================================ */}
      <AppBar
        position={isHome ? 'fixed' : 'sticky'}
        elevation={0}
        onMouseLeave={handleBarLeave}
        onMouseEnter={handleBarEnter}
        sx={{
          top: 0,
          zIndex: 1100,
          bgcolor: overHero ? 'transparent' : scrolled ? 'rgba(128, 0, 34, 0.95)' : 'var(--c-chrome)',
          isolation: 'isolate',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            zIndex: -1,
            pointerEvents: 'none',
            backgroundImage: "url('/images/texture/damask-burgundy.webp')",
            backgroundSize: '430px auto',
            opacity: overHero ? 0 : 0.24,
            mixBlendMode: 'overlay',
            transition: 'opacity 0.6s',
          },
          backdropFilter: scrolled ? 'blur(16px) saturate(1.3)' : 'none',
          borderBottom: `1px solid ${overHero ? 'rgba(232, 214, 179, 0.12)' : 'rgba(232, 214, 179, 0.18)'}`,
          boxShadow: scrolled ? '0 4px 24px rgba(36, 16, 18,0.18)' : 'none',
          transition: 'background 0.6s, border-color 0.6s, box-shadow 0.6s',
          color: 'var(--c-on-chrome)',
        }}
      >
        {/* ─── ROW 1 — Brand · Search · Actions ─────────────────── */}
        <Container maxWidth={false} disableGutters className="container-page">
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: '54px !important', md: '56px !important' },
              gap: 2,
            }}
          >
            {/* Logo alone on the left; quiet links, the one action and the mobile menu share the right. */}
            <Logo />

            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3.5 }}>
              {[
                { label: 'Collections', href: '/collections' },
                { label: 'Our Showroom', href: '/stores' },
                { label: 'Contact', href: '/contact' },
              ].map((a) => (
                <Box
                  key={a.label}
                  component={Link}
                  href={a.href}
                  sx={{
                    display: { xs: 'none', lg: 'inline-flex' },
                    alignItems: 'center',
                    minHeight: 44,
                    fontSize: '0.66rem',
                    fontWeight: 500,
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-inter)',
                    color: 'var(--c-on-chrome)',
                    opacity: 0.85,
                    textDecoration: 'none',
                    transition: 'opacity 0.3s',
                    '&:hover': { opacity: 1 },
                  }}
                >
                  {a.label}
                </Box>
              ))}
              {/* The site's primary action, so it reads as a button rather than a
                  third icon. Opens the booking dialog with no product attached. */}
              <Box
                component="button"
                type="button"
                onClick={() => setBookingOpen(true)}
                sx={{
                  display: { xs: 'none', lg: 'inline-flex' },
                  alignItems: 'center',
                  gap: 1.2,
                  minHeight: 36,
                  px: 2.2,
                  border: '1px solid rgba(232, 214, 179, 0.55)',
                  cursor: 'pointer',
                  bgcolor: 'transparent',
                  color: 'var(--c-on-chrome)',
                  fontSize: '0.64rem',
                  fontWeight: 500,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-inter)',
                  whiteSpace: 'nowrap',
                  transition: 'background 0.3s, border-color 0.3s, transform 0.1s',
                  '&:hover': { bgcolor: 'rgba(232, 214, 179, 0.12)', borderColor: 'var(--c-on-chrome)' },
                  '&:active': { transform: 'scale(0.98)' },
                  '&:focus-visible': { outline: '2px solid var(--c-on-chrome)', outlineOffset: '3px' },
                }}
              >
                <CalendarCheck size={14} strokeWidth={1.5} />
                Book an Appointment
              </Box>

              <IconButton
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                sx={{
                  display: { lg: 'none' },
                  width: 44,
                  height: 44,
                  color: 'var(--c-on-chrome)',
                  borderRadius: '8px',
                }}
              >
                {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
              </IconButton>
            </Box>
          </Toolbar>
        </Container>

        {/* ─── ROW 2 — Category links (desktop only) ────────────── */}
        <Box
          component="nav"
          aria-label="Product categories"
          sx={{
            display: { xs: 'none', lg: 'block' },
            borderTop: '1px solid rgba(232, 214, 179, 0.15)',
          }}
        >
          <Container maxWidth={false} disableGutters className="container-page">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                position: 'relative',       /* mega-menu anchor */
              }}
            >
              {items.map((cat) => {
                const open = activeMega === cat.label;
                return (
                  <Box
                    key={cat.label}
                    onMouseEnter={() => setActiveMega(cat.label)}
                    sx={{ position: 'static' }}
                  >
                    {/* category link */}
                    <Box
                      component={Link}
                      href={cat.href}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        px: { lg: 1.8, xl: 2.4 },
                        py: 0.75,
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        letterSpacing: '0.11em',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-inter)',
                        color: open ? '#FFFFFF' : 'var(--c-on-chrome)',
                        textDecoration: 'none',
                        position: 'relative',
                        transition: 'color 0.2s',
                        '&:hover': { color: '#FFFFFF' },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: '20%',
                          width: '60%',
                          height: '2px',
                          bgcolor: 'var(--c-on-chrome)',
                          borderRadius: 1,
                          transform: open ? 'scaleX(1)' : 'scaleX(0)',
                          transition: 'transform 0.25s cubic-bezier(.4,0,.2,1)',
                          transformOrigin: 'center',
                        },
                      }}
                    >
                      {cat.label}
                    </Box>

                    {/* ── MEGA MENU ───────────────────────────────── */}
                    <AnimatePresence>
                      {open && (
                        <Box
                          component={motion.div}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
                          sx={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            bgcolor: '#FFFFFF',
                            borderTop: '2px solid var(--c-accent)',
                            boxShadow: '0 20px 50px -12px rgba(36, 16, 18,0.13)',
                            zIndex: 999,
                          }}
                        >
                          <Container maxWidth="xl">
                            <Box sx={{ display: 'flex', py: 4.5, gap: { lg: 4, xl: 6 } }}>

                              {/* columns */}
                              <Box sx={{ flex: 1, display: 'flex', gap: { lg: 0 } }}>
                                {cat.columns.map((col, ci) => (
                                  <Box
                                    key={ci}
                                    sx={{
                                      flex: 1,
                                      px: { lg: 3, xl: 4 },
                                      borderLeft: ci ? '1px solid rgba(128, 0, 34,0.08)' : 'none',
                                    }}
                                  >
                                    {/* column heading */}
                                    <Typography
                                      sx={{
                                        fontSize: '0.68rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.14em',
                                        textTransform: 'uppercase',
                                        color: 'var(--c-accent)',
                                        mb: 1.6,
                                        fontFamily: 'var(--font-inter)',
                                      }}
                                    >
                                      {col.title}
                                    </Typography>

                                    {/* items */}
                                    <Stack spacing={0.9}>
                                      {col.items.map((item, ii) => (
                                        <Box
                                          key={ii}
                                          component={Link}
                                          href={item.href}
                                          sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            fontSize: '0.84rem',
                                            color: 'var(--c-text)',
                                            textDecoration: 'none',
                                            fontFamily: 'var(--font-inter)',
                                            py: '2px',
                                            transition: 'color 0.15s, transform 0.15s',
                                            '&:hover': { color: 'var(--c-accent)', transform: 'translateX(3px)' },
                                          }}
                                        >
                                          {getItemIcon(item.label)}
                                          {item.label}
                                        </Box>
                                      ))}
                                    </Stack>
                                  </Box>
                                ))}
                              </Box>

                              {/* featured card */}
                              {(() => {
                                const f = { image: cat.heroImagePath ?? "", title: cat.label, desc: cat.description ?? "", badge: cat.badge ?? "", href: cat.href };
                                return (
                                  <Box
                                    sx={{
                                      width: { lg: 280, xl: 310 },
                                      flexShrink: 0,
                                      borderLeft: '1px solid rgba(128, 0, 34,0.08)',
                                      pl: { lg: 3, xl: 4 },
                                    }}
                                  >
                                    <Box
                                      component={Link}
                                      href={f.href}
                                      sx={{
                                        display: 'block',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        border: '1px solid rgba(128, 0, 34,0.1)',
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        transition: 'box-shadow 0.3s, border-color 0.3s',
                                        '&:hover': {
                                          borderColor: 'var(--c-accent)',
                                          boxShadow: '0 8px 24px -6px rgba(36, 16, 18,0.12)',
                                          '& .featured-img': { transform: 'scale(1.04)' },
                                        },
                                      }}
                                    >
                                      <Box sx={{ position: 'relative', height: 150, overflow: 'hidden', bgcolor: 'var(--c-ivory)' }}>
                                        <Box
                                          className="featured-img"
                                          component="img"
                                          src={f.image}
                                          alt={f.title}
                                          sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.5s cubic-bezier(.25,1,.5,1)',
                                          }}
                                        />
                                        {/* badge */}
                                        <Box
                                          sx={{
                                            position: 'absolute',
                                            top: 8,
                                            left: 8,
                                            fontSize: '0.58rem',
                                            fontWeight: 700,
                                            letterSpacing: '0.08em',
                                            color: 'var(--c-accent)',
                                            bgcolor: 'rgba(255,255,255,0.88)',
                                            backdropFilter: 'blur(6px)',
                                            border: '1px solid rgba(128, 0, 34,0.15)',
                                            borderRadius: '3px',
                                            px: 0.8,
                                            py: '2px',
                                          }}
                                        >
                                          {f.badge}
                                        </Box>
                                      </Box>
                                      <Box sx={{ p: 2 }}>
                                        <Typography sx={{ fontFamily: 'var(--font-playfair-display)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--c-text)', mb: 0.3 }}>
                                          {f.title}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.76rem', color: 'var(--c-text-soft)', lineHeight: 1.5, mb: 1.2, fontFamily: 'var(--font-inter)' }}>
                                          {f.desc}
                                        </Typography>
                                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontSize: '0.76rem', fontWeight: 600, color: 'var(--c-accent)', fontFamily: 'var(--font-inter)' }}>
                                          Explore <ArrowRight size={12} />
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>
                                );
                              })()}
                            </Box>
                          </Container>

                          {/* trust bar */}
                          <Box sx={{ bgcolor: 'rgba(128, 0, 34,0.03)', borderTop: '1px solid rgba(128, 0, 34,0.06)', py: 1.1 }}>
                            <Container maxWidth="xl">
                              <Box sx={{ display: 'flex', justifyContent: 'center', gap: { lg: 5, xl: 8 }, flexWrap: 'wrap' }}>
                                {TRUST_ITEMS.map((t, i) => (
                                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.7, color: 'var(--c-text-soft)' }}>
                                    <Box sx={{ color: 'var(--c-accent)', display: 'flex' }}>{t.icon}</Box>
                                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, fontFamily: 'var(--font-inter)', letterSpacing: '0.02em' }}>
                                      {t.text}
                                    </Typography>
                                  </Box>
                                ))}
                              </Box>
                            </Container>
                          </Box>
                        </Box>
                      )}
                    </AnimatePresence>
                  </Box>
                );
              })}
            </Box>
          </Container>
        </Box>
      </AppBar>

      {/* ============================================================
          MOBILE DRAWER
          ============================================================ */}
      <AnimatePresence>
        {menuOpen && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 260 }}
            sx={{
              position: 'fixed',
              inset: 0,
              zIndex: 1200,
              bgcolor: 'var(--c-ivory)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            {/* top bar */}
            <Box sx={{ px: 2.5, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(128, 0, 34,0.1)', bgcolor: '#fff' }}>
              <Logo tone="dark" />
              <IconButton onClick={() => setMenuOpen(false)} aria-label="Close" sx={{ color: 'var(--c-text)', borderRadius: '8px', bgcolor: 'rgba(128, 0, 34,0.06)' }}>
                <X size={20} />
              </IconButton>
            </Box>

            {/* accordion categories */}
            <Box sx={{ px: 2.5, py: 2, flex: 1 }}>
              <Stack spacing={1}>
                <Box
                  component={Link}
                  href="/collections"
                  onClick={() => setMenuOpen(false)}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: 48,
                    px: 2,
                    borderRadius: '8px',
                    bgcolor: 'var(--c-accent)',
                    color: 'var(--c-on-sage)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-playfair-display)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  }}
                >
                  All Collections
                  <ArrowRight size={16} />
                </Box>
                {items.map((cat) => {
                  const open = mobileExpanded === cat.label;
                  return (
                    <Box
                      key={cat.label}
                      sx={{
                        borderRadius: '8px',
                        border: '1px solid rgba(128, 0, 34,0.1)',
                        bgcolor: '#fff',
                        overflow: 'hidden',
                      }}
                    >
                      {/* trigger */}
                      <Box
                        onClick={() => setMobileExpanded(open ? null : cat.label)}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          px: 2,
                          py: 1.4,
                          cursor: 'pointer',
                          '&:active': { bgcolor: 'rgba(128, 0, 34,0.04)' },
                        }}
                      >
                        <Typography sx={{ fontFamily: 'var(--font-playfair-display)', fontWeight: 600, fontSize: '0.95rem', color: open ? 'var(--c-accent)' : 'var(--c-text)' }}>
                          {cat.label}
                        </Typography>
                        <ChevronRight
                          size={16}
                          color="var(--c-accent)"
                          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
                        />
                      </Box>

                      {/* children */}
                      <AnimatePresence>
                        {open && (
                          <Box
                            component={motion.div}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            sx={{ borderTop: '1px dashed rgba(128, 0, 34,0.1)', bgcolor: 'var(--c-ivory)', px: 2.5, pb: 2 }}
                          >
                            <Box
                              component={Link}
                              href={cat.href}
                              onClick={() => setMenuOpen(false)}
                              sx={{
                                display: 'inline-flex', alignItems: 'center', gap: 0.5,
                                mt: 1.5, mb: 1,
                                fontSize: '0.78rem', fontWeight: 600, color: 'var(--c-accent)', textDecoration: 'none',
                              }}
                            >
                              View All <ArrowRight size={11} />
                            </Box>
                            <Stack spacing={0.6}>
                              {cat.columns[0]?.items.map((sub) => (
                                <Box
                                  key={sub.href}
                                  component={Link}
                                  href={sub.href}
                                  onClick={() => setMenuOpen(false)}
                                  sx={{
                                    fontSize: '0.84rem',
                                    color: 'var(--c-text)',
                                    textDecoration: 'none',
                                    fontFamily: 'var(--font-inter)',
                                    py: '3px',
                                    display: 'flex', alignItems: 'center',
                                    '&:hover': { color: 'var(--c-accent)' },
                                  }}
                                >
                                  {getItemIcon(sub.label)}
                                  {sub.label}
                                </Box>
                              ))}
                            </Stack>
                          </Box>
                        )}
                      </AnimatePresence>
                    </Box>
                  );
                })}
              </Stack>
            </Box>

            {/* bottom bar */}
            <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid rgba(128, 0, 34,0.1)', bgcolor: '#fff' }}>
              <Box
                component="button"
                type="button"
                onClick={() => { setMenuOpen(false); setBookingOpen(true); }}
                sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                  width: '100%', mb: 1.2, py: 1.5, border: 'none', cursor: 'pointer',
                  borderRadius: '8px',
                  bgcolor: 'var(--c-accent)', color: 'var(--c-ivory)',
                  fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em',
                  textTransform: 'uppercase', fontFamily: 'var(--font-inter)',
                }}
              >
                <CalendarCheck size={16} strokeWidth={1.6} />
                Book Appointment
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.2, mb: 1.5 }}>
                {[
                  { label: 'Our Stores', icon: <MapPin size={15} />, href: '/stores' },
                  { label: 'Call Stylist', icon: <Phone size={15} />, href: '/contact' },
                ].map((b) => (
                  <Box
                    key={b.label}
                    component={Link}
                    href={b.href}
                    onClick={() => setMenuOpen(false)}
                    sx={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.8,
                      py: 1.1, borderRadius: '8px',
                      border: '1px solid rgba(128, 0, 34,0.15)',
                      color: 'var(--c-text)', textDecoration: 'none',
                      fontSize: '0.78rem', fontWeight: 500,
                      '& svg': { color: 'var(--c-accent)' },
                    }}
                  >
                    {b.icon} {b.label}
                  </Box>
                ))}
              </Box>
              <Typography sx={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--c-text-soft)', letterSpacing: '0.06em' }}>
                BIS 916 Hallmarked · Fine Gold · By Appointment
              </Typography>
            </Box>
          </Box>
        )}
      </AnimatePresence>

      <BookAppointmentDialog open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}
