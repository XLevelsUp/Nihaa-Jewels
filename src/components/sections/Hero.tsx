'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Box, Container, Typography, Stack, useTheme, alpha } from '@mui/material';
import GoldButton from '@/components/ui/GoldButton';
import { ChevronDown } from 'lucide-react';

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <Box
      id="hero"
      ref={containerRef}
      component="section"
      sx={{
        position: 'relative',
        height: '100vh',
        minHeight: '700px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        bgcolor: '#121212'
      }}
    >
      {/* Parallax background */}
      <MotionBox
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0
        }}
        style={{ y, scale }}
      >
        <Image
          src="https://images.unsplash.com/photo-1573408301185-9519f94cc340?w=1920&q=90&auto=format&fit=crop"
          alt="Luxury jewellery collection — Nihaa Jewels hero"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(18, 18, 18, 0.8), rgba(18, 18, 18, 0.5), rgba(18, 18, 18, 1))'
          }}
        />
      </MotionBox>

      {/* Ambient gold glow */}
      <Box
        sx={{
          position: 'absolute',
          top: '33.33%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '300px', md: '600px' },
          height: { xs: '300px', md: '600px' },
          borderRadius: '50%',
          bgcolor: alpha('#D4AF37', 0.08),
          filter: 'blur(120px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
        <MotionBox
          style={{ opacity }}
          sx={{
            textAlign: 'center',
            px: 3,
            maxWidth: '800px',
            mx: 'auto'
          }}
        >
          {/* Eyebrow */}
          <MotionTypography
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            variant="overline"
            sx={{
              display: 'block',
              mb: 3,
              color: '#D4AF37',
              letterSpacing: '0.3em',
              fontWeight: 500,
              fontFamily: 'var(--font-inter), sans-serif'
            }}
          >
            Est. 1986 · Coimbatore, India
          </MotionTypography>

          {/* Main headline */}
          <MotionTypography
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            variant="h1"
            sx={{
              fontFamily: 'var(--font-playfair-display), serif',
              fontSize: { xs: '2.75rem', sm: '3.75rem', md: '4.5rem', lg: '5.5rem' },
              color: '#FAF9F6',
              lineHeight: 1.1,
              mb: 3,
              fontWeight: 700
            }}
          >
            Crafted for{' '}
            <Box component="em" className="text-gradient-gold" sx={{ fontStyle: 'normal' }}>
              Eternity
            </Box>
          </MotionTypography>

          {/* Divider */}
          <MotionBox
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="divider-gold"
            sx={{ mb: 4 }}
          />

          {/* Subtitle */}
          <MotionTypography
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            variant="body1"
            sx={{
              color: 'rgba(214, 211, 206, 0.7)',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 300,
              tracking: '0.05em',
              maxWidth: '540px',
              mx: 'auto',
              mb: 6,
              lineHeight: 1.8,
              fontFamily: 'var(--font-inter), sans-serif'
            }}
          >
            Four generations of master goldsmiths, crafting heirlooms that speak
            the language of timeless elegance.
          </MotionTypography>

          {/* CTAs */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              justifyContent="center"
              alignItems="center"
            >
              <GoldButton href="#collections" size="lg" icon id="hero-cta-primary">
                Explore Collection
              </GoldButton>
              <GoldButton href="#heritage" size="lg" variant="outline" id="hero-cta-heritage">
                Our Heritage
              </GoldButton>
            </Stack>
          </MotionBox>
        </MotionBox>
      </Container>

      {/* Floating jewelry accent image */}
      <MotionBox
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 1.4, ease: 'easeOut' }}
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: { lg: '10%', xl: '15%' },
          zIndex: 10,
          display: { xs: 'none', lg: 'block' }
        }}
      >
        <Box className="animate-float" sx={{ position: 'relative' }}>
          <Box
            sx={{
              width: 144,
              height: 144,
              borderRadius: '50%',
              overflow: 'hidden',
              border: `1px solid ${alpha('#D4AF37', 0.4)}`,
              boxShadow: `0 0 60px ${alpha('#D4AF37', 0.25)}`
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80&auto=format&fit=crop"
              alt="Featured ring"
              width={144}
              height={144}
              style={{ objectFit: 'cover', transform: 'scale(1.1)' }}
            />
          </Box>
          <Box
            sx={{
              position: 'absolute',
              bottom: -4,
              right: -4,
              width: 24,
              height: 24,
              borderRadius: '50%',
              bgcolor: '#D4AF37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="caption" sx={{ color: '#121212', fontSize: '0.45rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              New
            </Typography>
          </Box>
        </Box>
      </MotionBox>

      {/* Scroll indicator */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        sx={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: alpha('#D4AF37', 0.6),
            fontSize: '0.6rem',
            textTransform: 'uppercase',
            letterSpacing: '0.3em'
          }}
        >
          Scroll
        </Typography>
        <MotionBox
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <ChevronDown size={16} strokeWidth={1.5} color={alpha('#D4AF37', 0.6)} />
        </MotionBox>
      </MotionBox>
    </Box>
  );
}
