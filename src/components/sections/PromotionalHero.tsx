'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Container, Typography, alpha } from '@mui/material';
import GoldButton from '@/components/ui/GoldButton';

const SLIDES = [
  {
    id: 1,
    image: '/images/dailywear_image.webp',
    badge: 'New Launch',
    title: 'Elegant Gold Daily Wear Collection',
    cta: 'Explore Collection',
  },
  {
    id: 2,
    image: '/images/bridaljewel.webp',
    badge: 'Limited Offer',
    title: 'Wedding Jewellery Collection',
    cta: 'View Wedding Collection',
  },
  {
    id: 3,
    image: '/images/braceletpromo.webp',
    badge: 'Trending',
    title: 'Modern Gold Bracelets',
    cta: 'Shop Bracelets',
    // Tip: Change 'cover' to 'contain' if you want the entire bracelet visible without cropping, 
    // or adjust 'center' to 'top', 'bottom', or percentages like 'center 80%' to shift the crop!
    objectFit: 'cover' as any,
    objectPosition: 'center',
  },
  {
    id: 4,
    image: '/images/ring_promo.webp',
    badge: 'Best Seller',
    title: 'Premium Gold Rings',
    cta: 'Explore Rings',
  },
  {
    id: 5,
    image: '/images/fesitive_offer.webp',
    badge: 'Exclusive',
    title: 'Festive Jewellery Collection',
    cta: 'Shop Now',
  },
];

const AUTO_PLAY_INTERVAL = 3000;

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // true = hero section is in viewport
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Watch whether the hero section is visible on screen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 } // at least 30% of the section must be visible
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-play: only runs when section is visible AND not hovered
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (isVisible && !isHovered) {
      timerRef.current = setInterval(nextSlide, AUTO_PLAY_INTERVAL);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isVisible, isHovered, nextSlide]);

  return (
    <Box ref={sectionRef} component="section" sx={{ py: { xs: 4, md: 6 }, bgcolor: '#050505', position: 'relative' }}>
      {/* Hidden SEO elements */}
      <Box sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        <Typography variant="h1">Premium Gold Jewellery Collection</Typography>
        <Typography variant="h2">Daily Wear, Wedding and Gifting Jewellery</Typography>
      </Box>

      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Box
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{
            position: 'relative',
            width: '100%',
            height: { xs: '45vh', sm: '50vh', lg: '60vh' },
            minHeight: { xs: '450px', sm: '500px', md: '550px' },
            maxWidth: '1280px',
            mx: 'auto',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 40px rgba(212, 175, 55, 0.05)',
            border: '1px solid rgba(212, 175, 55, 0.15)',
            userSelect: 'none',
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' }}
            >
                <Image
                  src={SLIDES[currentSlide].image}
                  alt={SLIDES[currentSlide].title}
                  fill
                  priority={currentSlide === 0}
                  sizes="(max-width: 1280px) 100vw, 1280px"
                style={{
                  objectFit: SLIDES[currentSlide].objectFit || 'cover',
                  objectPosition: SLIDES[currentSlide].objectPosition || 'center',
                  transition: 'transform 5s ease-out',
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                }}
              />

              {/* Gradient overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: {
                    xs: 'linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.4) 70%, rgba(5,5,5,0.1) 100%)',
                    md: 'linear-gradient(to right, rgba(5,5,5,0.9) 0%, rgba(5,5,5,0.7) 45%, rgba(5,5,5,0.05) 100%)',
                  },
                }}
              />

              {/* Slide content */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: { xs: 'flex-end', md: 'center' },
                  justifyContent: 'flex-start',
                  p: { xs: 3, sm: 5, md: 8, lg: 10 },
                  pb: { xs: 8, sm: 10, md: 'auto' },
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
                  style={{ width: '100%' }}
                >
                  <Box sx={{ maxWidth: { xs: '100%', sm: '80%', md: '50%' }, minWidth: { xs: '260px', md: '450px' } }}>
                    <Typography
                      variant="overline"
                      sx={{
                        display: 'inline-block',
                        px: 2,
                        py: 0.5,
                        mb: 2,
                        border: '1px solid #D4AF37',
                        borderRadius: '50px',
                        color: '#D4AF37',
                        letterSpacing: '0.15em',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        bgcolor: alpha('#D4AF37', 0.1),
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      {SLIDES[currentSlide].badge}
                    </Typography>

                    <Typography
                      variant="h2"
                      component="h3"
                      sx={{
                        fontFamily: 'var(--font-playfair-display), serif',
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3.2rem', lg: '3.8rem' },
                        color: '#FAF9F6',
                        lineHeight: 1.15,
                        mb: { xs: 3, md: 5 },
                        fontWeight: 600,
                        textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                      }}
                    >
                      {SLIDES[currentSlide].title}
                    </Typography>

                    <Box
                      component={motion.div}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      sx={{ display: 'inline-block' }}
                    >
                      <GoldButton href="/collections" size="lg" icon>
                        {SLIDES[currentSlide].cta}
                      </GoldButton>
                    </Box>
                  </Box>
                </motion.div>
              </Box>
            </motion.div>
          </AnimatePresence>

          {/* Dot indicators */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '5%',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1.5,
              zIndex: 10,
            }}
          >
            {SLIDES.map((_, idx) => (
              <Box
                key={idx}
                onClick={() => goToSlide(idx)}
                role="button"
                aria-label={`Go to slide ${idx + 1}`}
                sx={{
                  width: currentSlide === idx ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: currentSlide === idx ? '#D4AF37' : 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { bgcolor: currentSlide === idx ? '#D4AF37' : '#FAF9F6' },
                }}
              />
            ))}
          </Box>

          {/* Progress bar — only animates when visible and not hovered */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '3px',
              bgcolor: 'rgba(212, 175, 55, 0.25)',
              width: '100%',
              zIndex: 10,
            }}
          >
            {isVisible && !isHovered && (
              <Box
                component={motion.div}
                key={currentSlide}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: AUTO_PLAY_INTERVAL / 1000, ease: 'linear' }}
                sx={{ height: '100%', bgcolor: '#D4AF37' }}
              />
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}