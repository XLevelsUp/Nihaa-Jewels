'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { SHOWCASE_ITEMS } from '@/constants';

const MotionBox = motion.create(Box);

export default function NewLaunch() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <Box
      component="section"
      id="new-launch"
      sx={{
        py: { xs: 12, md: 16 },
        px: 3,
        bgcolor: '#121212'
      }}
    >
      {/* Header */}
      <Container maxWidth="lg">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          sx={{
            textAlign: 'center',
            mb: { xs: 8, md: 12 }
          }}
          ref={ref}
        >
          <Box className="section-label" sx={{ mb: 2, display: 'inline-block' }}>
            NEW ARRIVAL
          </Box>
          <Box className="divider-gold" sx={{ mb: 4, mx: 'auto' }} />
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'var(--font-playfair-display), serif',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              color: 'var(--color-ivory-warm, #FAF9F6)',
              mt: 2,
              mb: 3,
              lineHeight: 1.2
            }}
          >
            Nihaa Collections
          </Typography>
        </MotionBox>

        {/* Strict 3-column grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { 
              xs: 'minmax(250px, 360px)', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)' 
            },
            justifyContent: 'center',
            gap: { xs: 4, md: 3 },
            gridAutoRows: { xs: '380px', md: '450px' }
          }}
        >
          {SHOWCASE_ITEMS.map((item, i) => (
            <ShowcaseCard key={item.id} item={item} index={i} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}

function ShowcaseCard({
  item,
  index,
}: {
  item: (typeof SHOWCASE_ITEMS)[0] & { badge?: string };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <Box
      component={Link}
      href={item.href}
      sx={{ textDecoration: 'none', display: 'block', height: '100%' }}
    >
      <MotionBox
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: index * 0.15, ease: 'easeOut' }}
        sx={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
          borderRadius: '8px',
          '&:hover .showcase-img': { transform: 'scale(1.1)' },
        }}
        className="showcase-card metallic-shimmer"
        aria-label={`Explore ${item.label} collection`}
      >
        {/* Image */}
        <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          <Box
            className="showcase-img"
            sx={{
              position: 'absolute',
              inset: 0,
              transition: 'transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            <Image
              src={item.image}
              alt={`${item.label} — Nihaa Jewels`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
          </Box>

          {/* Gradient overlay */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(18, 18, 18, 0.8) 0%, transparent 60%)',
              pointerEvents: 'none'
            }}
          />

          {/* Floating Gold Badge */}
          {item.badge && (
            <Box
              className="btn-gold-shimmer"
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                px: 2,
                py: 0.5,
                borderRadius: '20px',
                backgroundColor: '#D4AF37',
                color: '#121212',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                zIndex: 10,
                fontFamily: 'var(--font-inter), sans-serif',
                pointerEvents: 'none'
              }}
            >
              {item.badge}
            </Box>
          )}

          {/* Title Text with nav-glass */}
          <Box 
            className="nav-glass"
            sx={{ 
              position: 'absolute', 
              bottom: 16, 
              left: 16, 
              right: 16, 
              p: 2.5, 
              borderRadius: '12px',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
              pointerEvents: 'none'
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontFamily: 'var(--font-playfair-display), serif',
                fontSize: '1.5rem',
                color: 'var(--color-ivory-warm, #FAF9F6)',
                margin: 0
              }}
            >
              {item.label}
            </Typography>
            <Typography
              className="showcase-desc"
              sx={{
                color: 'var(--color-ivory-warm, #FAF9F6)',
                opacity: 0.9,
                fontSize: '0.85rem',
                fontWeight: 300,
                fontFamily: 'var(--font-inter), sans-serif',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                margin: 0
              }}
            >
              {item.description}
            </Typography>
          </Box>
        </Box>
      </MotionBox>
    </Box>
  );
}
