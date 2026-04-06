'use client';

import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Box, Container, Typography, alpha, useTheme } from '@mui/material';
import { ArrowUpRight } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import { SHOWCASE_ITEMS } from '@/constants';

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);

export default function ShowcaseGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <Box
      component="section"
      id="collections"
      sx={{
        py: { xs: 12, md: 16 },
        px: 3,
        bgcolor: '#121212'
      }}
    >
      {/* Header */}
      <Container maxWidth="lg">
        <MotionBox
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          sx={{
            textAlign: 'center',
            mb: { xs: 8, md: 12 }
          }}
          ref={ref}
        >
          <SectionLabel centered>Curated Collections</SectionLabel>
          <Box className="divider-gold" sx={{ mb: 4 }} />
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'var(--font-playfair-display), serif',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              color: '#FAF9F6',
              mt: 2,
              mb: 3,
              lineHeight: 1.2
            }}
          >
            The Edit
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(214, 211, 206, 0.6)',
              fontSize: '0.875rem',
              fontWeight: 300,
              maxWidth: '448px',
              mx: 'auto',
              lineHeight: 1.8,
              fontFamily: 'var(--font-inter), sans-serif'
            }}
          >
            Four categories. Infinite expressions. Each piece designed to outlast
            the moment it was made for.
          </Typography>
        </MotionBox>

        {/* Asymmetrical grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 2,
            gridAutoRows: { xs: '280px', lg: '320px' }
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
  item: (typeof SHOWCASE_ITEMS)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  // Layout: first card is tall (spans 2 rows) on large screens
  const isTall = index === 0;

  return (
    <MotionBox
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: 'easeOut' }}
      sx={{
        gridColumn: isTall ? 'span 1' : 'span 1',
        gridRow: {
          xs: isTall ? 'span 2' : 'span 1',
          lg: isTall ? 'span 2' : 'span 1'
        },
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',
        '&:hover .showcase-img': { transform: 'scale(1.08)' },
        '&:hover .showcase-overlay': { bgcolor: 'rgba(18, 18, 18, 0.4)' },
        '&:hover .showcase-arrow': { borderColor: alpha('#D4AF37', 0.6), bgcolor: alpha('#D4AF37', 0.1) },
        '&:hover .showcase-arrow-icon': { opacity: 1 },
        '&:hover .showcase-desc': { opacity: 1 }
      }}
      id={`showcase-${item.id}`}
      role="button"
      tabIndex={0}
      aria-label={`Explore ${item.label} collection`}
    >
      {/* Image */}
      <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        <Box
          className="showcase-img"
          sx={{
            position: 'absolute',
            inset: 0,
            transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          <Image
            src={item.image}
            alt={`${item.label} — Nihaa Jewels`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        </Box>

        {/* Gradient overlay */}
        <Box
          className="showcase-overlay"
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(14, 14, 14, 0.9), transparent)',
            transition: 'background-color 0.4s ease'
          }}
        />

        {/* Content */}
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: 3, zIndex: 10 }}>
          <Box sx={{ transform: 'translateY(8px)', pb: 1, '&:hover': { transform: 'translateY(0)' }, transition: 'transform 0.4s ease' }}>
            <Typography
              variant="caption"
              sx={{
                color: '#D4AF37',
                fontSize: '0.6rem',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                mb: 0.5,
                fontWeight: 500,
                display: 'block',
                fontFamily: 'var(--font-inter), sans-serif'
              }}
            >
              {item.subtitle}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontFamily: 'var(--font-playfair-display), serif',
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                color: '#FAF9F6',
                mb: 1
              }}
            >
              {item.label}
            </Typography>
            <Typography
              variant="caption"
              className="showcase-desc"
              sx={{
                color: alpha('#d6d3ce', 0.8),
                fontSize: '0.7rem',
                lineHeight: 1.5,
                fontWeight: 300,
                opacity: 0,
                transition: 'opacity 0.4s ease',
                maxWidth: '180px',
                display: 'block',
                fontFamily: 'var(--font-inter), sans-serif'
              }}
            >
              {item.description}
            </Typography>
          </Box>

          {/* Arrow */}
          <Box
            className="showcase-arrow"
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 36,
              height: 36,
              border: `1px solid ${alpha('#D4AF37', 0)}`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.4s ease'
            }}
          >
            <ArrowUpRight
              size={14}
              strokeWidth={1.5}
              className="showcase-arrow-icon"
              style={{ color: '#D4AF37', opacity: 0, transition: 'opacity 0.4s ease' }}
            />
          </Box>
        </Box>
      </Box>
    </MotionBox>
  );
}
