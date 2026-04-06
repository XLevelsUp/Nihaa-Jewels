'use client';

import { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { Box, Container, Typography, alpha, useTheme } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import SectionLabel from '@/components/ui/SectionLabel';
import GoldButton from '@/components/ui/GoldButton';
import { HERITAGE_CONTENT, HERITAGE_STATS } from '@/constants';
import Image from 'next/image';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeOut' } },
};

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);

export default function Heritage() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const theme = useTheme();

  return (
    <Box
      component="section"
      id="heritage"
      sx={{
        py: { xs: 15, md: 20 },
        px: 3,
        bgcolor: '#0e0e0e',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative background glow */}
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: { xs: 300, md: 500 },
          height: { xs: 300, md: 500 },
          borderRadius: '50%',
          bgcolor: alpha('#D4AF37', 0.05),
          filter: 'blur(100px)',
          pointerEvents: 'none'
        }}
      />

      <Container maxWidth="lg">
        <Grid2 container spacing={8} alignItems="center">
          {/* Left — typography */}
          <Grid2 size={{ xs: 12, lg: 6 }}>
            <MotionBox
              ref={ref}
              variants={containerVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
            >
              <MotionBox variants={itemVariants}>
                <SectionLabel>{HERITAGE_CONTENT.eyebrow}</SectionLabel>
                <Box sx={{ width: 40, height: '1px', bgcolor: alpha('#D4AF37', 0.6), mt: 2, mb: 4 }} />
              </MotionBox>

              <MotionBox variants={itemVariants}>
                <Typography
                  variant="h3"
                  component="blockquote"
                  sx={{
                    fontFamily: 'var(--font-playfair-display), serif',
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    color: '#F7E7CE',
                    fontStyle: 'italic',
                    lineHeight: 1.4,
                    mb: 4
                  }}
                >
                  {HERITAGE_CONTENT.quote}
                </Typography>
              </MotionBox>

              {HERITAGE_CONTENT.body.split('\n\n').map((paragraph, i) => (
                <MotionTypography
                  key={i}
                  variants={itemVariants}
                  variant="body2"
                  sx={{
                    color: '#d6d3ce',
                    fontWeight: 300,
                    lineHeight: 1.9,
                    maxWidth: 540,
                    fontFamily: 'var(--font-inter), sans-serif'
                  }}
                >
                  {paragraph}
                </MotionTypography>
              ))}

              <MotionTypography
                variants={itemVariants}
                sx={{
                  fontFamily: 'var(--font-playfair-display), serif',
                  color: '#D4AF37',
                  fontStyle: 'italic',
                  fontSize: '1.125rem',
                  mt: 2,
                  mb: 4
                }}
              >
                {HERITAGE_CONTENT.signature}
              </MotionTypography>

              <MotionBox variants={itemVariants}>
                <GoldButton href="#collections" variant="outline" icon id="heritage-cta">
                  View Collection
                </GoldButton>
              </MotionBox>
            </MotionBox>
          </Grid2>

          {/* Right — image + stats */}
          <Grid2 size={{ xs: 12, lg: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Image */}
              <MotionBox
                initial={{ opacity: 0, x: 40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1, delay: 0.3 }}
                sx={{
                  position: 'relative',
                  height: { xs: 300, md: 440 },
                  width: '100%',
                  overflow: 'hidden'
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=900&q=85&auto=format&fit=crop"
                  alt="Nihaa Jewels artisan crafting gold jewellery"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(14, 14, 14, 0.6), transparent)'
                  }}
                />
                {/* Gold corner accents */}
                <Box sx={{ position: 'absolute', top: 20, left: 20, width: 40, height: 40, borderTop: '1px solid rgba(212, 175, 55, 0.6)', borderLeft: '1px solid rgba(212, 175, 55, 0.6)' }} />
                <Box sx={{ position: 'absolute', bottom: 20, right: 20, width: 40, height: 40, borderBottom: '1px solid rgba(212, 175, 55, 0.6)', borderRight: '1px solid rgba(212, 175, 55, 0.6)' }} />
              </MotionBox>

              {/* Stats */}
              <MotionBox
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  border: '1px solid rgba(212, 175, 55, 0.15)'
                }}
              >
                {HERITAGE_STATS.map((stat, i) => (
                  <Box
                    key={stat.label}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      py: 3,
                      gap: 1,
                      borderRight: i < HERITAGE_STATS.length - 1 ? '1px solid rgba(212, 175, 55, 0.15)' : 'none'
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-playfair-display), serif',
                        fontSize: { xs: '1.25rem', md: '1.75rem' },
                        color: '#D4AF37',
                        fontWeight: 600
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#d6d3ce',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        textAlign: 'center',
                        fontSize: '0.6rem',
                        lineHeight: 1.2
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </MotionBox>
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
}