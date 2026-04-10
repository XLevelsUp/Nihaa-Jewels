'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AppBar, Toolbar, Container, Box, Typography, IconButton, InputBase, Stack } from '@mui/material';
import { 
  Gem, Sparkles, Circle, CircleDashed, Activity, Crown, Star, Gift, 
  Search, MapPin, Heart, User, Phone, Menu, X, Baby, Feather
} from 'lucide-react';

import { MEGA_NAVIGATION } from '@/constants';

/* ─── Sub-Components ───────────────────────────── */

const Logo = () => (
  <Box component={Link} href="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', flexShrink: 0 }}>
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ color: '#D4AF37', filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.4))', display: 'flex', alignItems: 'center' }}>
        <Gem size={20} strokeWidth={1.5} />
      </Box>
    </Box>
    <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
      <Typography variant="h6" sx={{ color: '#D4AF37', fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-playfair-display), serif', letterSpacing: '-0.02em', textShadow: '0 0 12px rgba(212, 175, 55, 0.2)' }}>
        Nihaa
      </Typography>
      <Typography variant="caption" sx={{ color: 'rgba(250, 249, 246, 0.4)', fontSize: '0.35rem', letterSpacing: '0.5em', textTransform: 'uppercase', fontWeight: 500, mt: -0.5, ml: 0.1 }}>
        Jewels
      </Typography>
    </Box>
  </Box>
);

const RingIcon = (props: any) => (
  <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <ellipse cx="12" cy="14" rx="6" ry="4" opacity="0.8"/>
    <path d="M10 10l2-3 2 3-2 2z" />
  </svg>
);

const EarringIcon = (props: any) => (
  <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3v3" opacity="0.6"/>
    <circle cx="12" cy="6" r="1" fill="currentColor"/>
    <path d="M12 7c-2 3-3 4.5-3 7a3 3 0 0 0 6 0c0-2.5-1-4-3-7z" />
  </svg>
);

const JhumkaIcon = (props: any) => (
  <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
    <path d="M7 14c0-3 3-6 5-6s5 3 5 6" />
    <path d="M7 14h10" />
    <circle cx="8" cy="16" r="0.5" fill="currentColor" />
    <circle cx="12" cy="16" r="0.5" fill="currentColor" />
    <circle cx="16" cy="16" r="0.5" fill="currentColor" />
  </svg>
);

const StudIcon = (props: any) => (
  <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 8l2 4 4-2-2 4 2 4-4-2-2 4-2-4-4 2 2-4-4-2 2-4z" />
  </svg>
);

const HoopIcon = (props: any) => (
  <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 4v2" opacity="0.6"/>
    <circle cx="12" cy="14" r="7" />
  </svg>
);

const BraceletIcon = (props: any) => (
  <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="4" y="10" width="4" height="4" rx="1" />
    <rect x="16" y="10" width="4" height="4" rx="1" />
    <rect x="10" y="9" width="4" height="6" rx="1" />
    <path d="M8 12h2M14 12h2" opacity="0.5"/>
  </svg>
);

const CoupleBraceletIcon = (props: any) => (
  <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <ellipse cx="9" cy="12" rx="6" ry="3" />
    <ellipse cx="15" cy="15" rx="6" ry="3" opacity="0.6"/>
  </svg>
);

const BangleIcon = (props: any) => (
  <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <ellipse cx="12" cy="10" rx="8" ry="4" opacity="0.4"/>
    <ellipse cx="12" cy="14" rx="8" ry="4" />
  </svg>
);

const PendantIcon = (props: any) => (
  <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 4l6 7.5 6-7.5" opacity="0.5" />
    <path d="M12 11.5l-2.5 4h5z" />
  </svg>
);

const BridalSetIcon = (props: any) => (
  <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 5c0 6 3 11 6 11s6-5 6-11" strokeDasharray="3 2"/>
    <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
    <path d="M4 12v2" opacity="0.5"/>
    <circle cx="4" cy="15" r="1" fill="currentColor"/>
    <path d="M20 12v2" opacity="0.5"/>
    <circle cx="20" cy="15" r="1" fill="currentColor"/>
  </svg>
);

const MangalsutraIcon = (props: any) => (
  <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 4c2 5 4 8 7 8s5-3 7-8" strokeDasharray="3 3" opacity="0.7"/>
    <circle cx="10" cy="13" r="1.5" />
    <circle cx="14" cy="13" r="1.5" />
  </svg>
);

const GoldCoinIcon = (props: any) => (
  <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="7" />
    <circle cx="12" cy="12" r="5" opacity="0.4" />
    <path d="M12 9v6" opacity="0.8"/>
  </svg>
);

const ChainIcon = (props: any) => (
  <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 5c0 6 3 12 6 12s6-6 6-12" opacity="0.3" strokeWidth="1" />
    <path d="M6 5c0 6 3 12 6 12s6-6 6-12" strokeDasharray="3 3" strokeWidth="2" />
  </svg>
);

const getItemIcon = (itemName: string) => {
  const props = { size: 14, strokeWidth: 1.5, style: { marginRight: 8, opacity: 0.6 } };
  const lower = itemName.toLowerCase();
  
  if (lower === 'men' || lower === 'unisex') return <User {...props} />;
  if (lower === 'women') return <User {...props} color="#D4AF37" />;
  if (lower === 'kids') return <Baby {...props} />;
  if (lower === 'couple' || lower === 'couples') return <Heart {...props} />;
  
  if (lower.includes('couple bracelet')) return <CoupleBraceletIcon {...props} />;
  if (lower.includes('bridal set') || lower.includes('trousseau')) return <BridalSetIcon {...props} />;
  if (lower.includes('ring')) return <RingIcon {...props} />;
  if (lower.includes('bangle')) return <BangleIcon {...props} />;
  if (lower.includes('bracelet')) return <BraceletIcon {...props} />;
  
  if (lower.includes('jhumka')) return <JhumkaIcon {...props} />;
  if (lower.includes('stud')) return <StudIcon {...props} />;
  if (lower.includes('hoop')) return <HoopIcon {...props} />;
  if (lower.includes('drop')) return <EarringIcon {...props} />;
  if (lower.includes('earring')) return <EarringIcon {...props} />;
  
  if (lower.includes('mangalsutra')) return <MangalsutraIcon {...props} />;
  if (lower.includes('chain')) return <ChainIcon {...props} />;
  if (lower.includes('pendant')) return <PendantIcon {...props} />;
  if (lower.includes('coin')) return <GoldCoinIcon {...props} />;
  if (lower.includes('light') || lower.includes('everyday')) return <Feather {...props} />;
  
  return null;
};

const getCategoryIcon = (iconName: string) => {
  const props = { size: 16, strokeWidth: 1.5 };
  switch (iconName) {
    case 'gem': return <Gem {...props} />;
    case 'sparkles': return <Sparkles {...props} />;
    case 'ring': return <RingIcon {...props} />;
    case 'ear': return <EarringIcon {...props} />;
    case 'bangle': return <BangleIcon {...props} />;
    case 'bracelet': return <BraceletIcon {...props} />;
    case 'wedding': return <MangalsutraIcon {...props} />;
    case 'sparkle': return <Sparkles {...props} />;
    case 'gift': return <Gift {...props} />;
    default: return <Gem {...props} />;
  }
};

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setActiveMega(null);
  }, [pathname]);

  const isHomePage = pathname === '/';

  return (
    <>
      {/* Visually hidden SEO descriptions as requested */}
      <Box sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        <Typography variant="body1">
          Nihaa Jewels is a premium gold jewellery brand established in 2026, offering elegant and timeless gold jewellery collections for bridal, daily wear, gifting, and special occasions.
        </Typography>
        <Typography variant="body2">
          Keywords: Gold Rings, Gold Bangles, Gold Bracelets, Wedding Jewellery, Daily Wear Jewellery, Gold Gifting
        </Typography>
      </Box>

      <AppBar
        position={isHomePage ? "fixed" : "sticky"}
        elevation={0}
        sx={{
          top: 0, left: 0, right: 0, zIndex: 1100,
          background: scrolled 
            ? 'rgba(18, 18, 18, 0.95)' 
            : (isHomePage ? 'linear-gradient(to bottom, rgba(5,5,5,0.8) 0%, rgba(5,5,5,0) 100%)' : '#121212'),
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled 
            ? '1px solid rgba(212, 175, 55, 0.1)' 
            : (isHomePage ? '1px solid transparent' : '1px solid rgba(255, 255, 255, 0.05)'),
          transition: 'all 0.3s ease'
        }}
        onMouseLeave={() => setActiveMega(null)}
      >
        <Container maxWidth="xl">
          {/* ================= UPPER HEADER ================= */}
          <Toolbar disableGutters sx={{ minHeight: { xs: '44px !important', md: '48px !important' }, py: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s ease' }}>
            
            {/* Left: Brand */}
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', transform: 'scale(1)', transition: 'transform 0.3s ease', transformOrigin: 'left center' }}>
              <Logo />
            </Box>

            {/* Center: Search Bar */}
            <Box sx={{ flex: 2, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <Box
                sx={{
                  display: 'flex', alignItems: 'center', width: '100%', maxWidth: 500,
                  bgcolor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: 8,
                  px: 2, py: 0.5,
                  transition: 'all 0.3s ease',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.06)', borderColor: 'rgba(212, 175, 55, 0.4)' },
                  '&:focus-within': { borderColor: '#D4AF37', boxShadow: '0 0 10px rgba(212, 175, 55, 0.1)' }
                }}
              >
                <Search size={18} color="rgba(212, 175, 55, 0.8)" />
                <InputBase
                  placeholder="Search Gold Jewellery, Rings, Bangles, Bracelets, Wedding Gifts"
                  sx={{ ml: 1.5, flex: 1, color: '#fff', fontSize: '0.85rem', fontFamily: 'var(--font-inter)' }}
                />
              </Box>
            </Box>

            {/* Right: Icons */}
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: { xs: 1, md: 3 } }}>
              <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 3.5, alignItems: 'center' }}>
                {[
                  { name: "Visit Our Store", icon: <MapPin size={22} strokeWidth={1.5} />, href: "/stores" },
                  { name: "Wishlist", icon: <Heart size={22} strokeWidth={1.5} />, href: "/wishlist" },
                  { name: "Profile", icon: <User size={22} strokeWidth={1.5} />, href: "/profile" },
                  { name: "Contact Us", icon: <Phone size={22} strokeWidth={1.5} />, href: "/contact" }
                ].map((item) => (
                  <motion.div key={item.name} whileHover={{ scale: 1.15, y: -2 }} whileTap={{ scale: 0.95 }}>
                    <Box
                      component={Link}
                      href={item.href}
                      aria-label={item.name}
                      sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
                        transition: 'color 0.3s',
                        "&:hover": { color: '#D4AF37' }
                      }}
                    >
                      {item.icon}
                    </Box>
                  </motion.div>
                ))}
              </Box>

              {/* Mobile Menu Toggle */}
              <IconButton sx={{ display: { lg: 'none' }, color: '#FAF9F6' }} onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={26} /> : <Menu size={26} />}
              </IconButton>
            </Box>
          </Toolbar>
          
          {/* ================= LOWER HEADER (CATEGORIES & MEGA MENU) ================= */}
          <Box
            component="nav"
            sx={{
              display: { xs: 'none', lg: 'flex' },
              justifyContent: 'center',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              position: 'relative'
            }}
          >
            {MEGA_NAVIGATION.map((category) => (
              <Box
                key={category.label}
                onMouseEnter={() => setActiveMega(category.label)}
                sx={{ position: 'static' }}
              >
                <Box
                  component={Link}
                  href={category.href}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    py: 0.5,
                    px: { lg: 2, xl: 3 },
                    color: activeMega === category.label ? '#D4AF37' : 'rgba(255,255,255,0.85)',
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontFamily: 'var(--font-inter)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '10%',
                      width: '80%',
                      height: '2px',
                      background: '#D4AF37',
                      transform: activeMega === category.label ? 'scaleX(1)' : 'scaleX(0)',
                      transition: 'transform 0.3s ease',
                      transformOrigin: 'center'
                    }
                  }}
                >
                  {getCategoryIcon(category.icon)}
                  {category.label}
                </Box>
                
                {/* Mega Menu Dropdown */}
                <AnimatePresence>
                  {activeMega === category.label && (
                    <Box
                      component={motion.div}
                      initial={{ opacity: 0, y: 10, scale: 0.99 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.99 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        bgcolor: '#080808',
                        borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.95)',
                        zIndex: 1000,
                        px: { lg: 6, xl: 10 },
                        py: 5,
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      {category.columns.map((col, idx) => (
                        <Box key={idx} sx={{ 
                          minWidth: 150, 
                          flex: 1, 
                          borderLeft: idx !== 0 ? '1px solid rgba(255,255,255,0.06)' : 'none', 
                          pl: idx !== 0 ? { lg: 5, xl: 8 } : 0 
                        }}>
                          <Typography
                            sx={{
                              color: '#D4AF37',
                              fontFamily: 'var(--font-playfair-display)',
                              fontSize: '1.05rem',
                              mb: 2,
                              fontWeight: 600,
                              letterSpacing: '0.06em'
                            }}
                          >
                            {col.title}
                          </Typography>
                          <Stack spacing={1.5}>
                            {col.items.map((item, itemIdx) => (
                              <motion.div key={itemIdx} whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 300 }}>
                                <Box
                                  component={Link}
                                  href={`/collections/${item.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`}
                                  sx={{
                                    color: 'rgba(255,255,255,0.55)',
                                    textDecoration: 'none',
                                    fontSize: '0.85rem',
                                    fontFamily: 'var(--font-inter)',
                                    transition: 'color 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: 'fit-content',
                                    '&:hover': { color: '#fff' }
                                  }}
                                >
                                  {getItemIcon(item)}
                                  {item}
                                </Box>
                              </motion.div>
                            ))}
                          </Stack>
                        </Box>
                      ))}
                    </Box>
                  )}
                </AnimatePresence>
              </Box>
            ))}
          </Box>
        </Container>
      </AppBar>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {menuOpen && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            sx={{
              position: 'fixed',
              inset: 0,
              zIndex: 1050,
              bgcolor: '#050505',
              pt: 12,
              px: { xs: 3, sm: 5 },
              overflowY: 'auto'
            }}
          >
            <Stack spacing={4} sx={{ pb: 8 }}>
              {MEGA_NAVIGATION.map((cat) => (
                <Box key={cat.label}>
                  <Typography
                    component={Link}
                    href={cat.href}
                    onClick={() => setMenuOpen(false)}
                    sx={{
                      fontSize: '1.8rem',
                      fontFamily: 'var(--font-playfair-display)',
                      color: '#FAF9F6',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      mb: 2,
                      borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
                      pb: 1.5,
                      transition: 'color 0.3s',
                      "&:hover": { color: '#D4AF37' }
                    }}
                  >
                    {cat.label}
                  </Typography>
                  <Stack spacing={1.5} sx={{ pl: 2 }}>
                    {cat.columns[0]?.items.map((subItem) => (
                      <Box
                        key={subItem}
                        component={Link}
                        href={`${cat.href}?filter=${encodeURIComponent(subItem)}`}
                        onClick={() => setMenuOpen(false)}
                        sx={{
                          color: 'rgba(255,255,255,0.6)',
                          textDecoration: 'none',
                          fontSize: '1rem',
                          fontFamily: 'var(--font-inter)',
                          transition: 'color 0.2s',
                          "&:hover": { color: '#D4AF37' }
                        }}
                      >
                        {subItem}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </AnimatePresence>
    </>
  );
}
