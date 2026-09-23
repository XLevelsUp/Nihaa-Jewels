'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Box, Typography, alpha, useTheme } from '@mui/material';

import { formatRupees } from '@/lib/pricing';
import type { PricedProduct } from '@/lib/catalogue';

interface ProductCardProps {
  product: PricedProduct;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const theme = useTheme();
  const image = product.images[0];
  const href = `/collections/${product.category?.slug ?? 'all'}/${product.slug}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Box
        component={Link}
        href={href}
        sx={{
          display: 'block',
          textDecoration: 'none',
          bgcolor: 'background.paper',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          overflow: 'hidden',
          height: '100%',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            borderColor: alpha(theme.palette.primary.main, 0.4),
            boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.12)}`,
          },
          '&:hover .product-image': { transform: 'scale(1.04)' },
        }}
      >
        <Box sx={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden', bgcolor: '#0E0E0E' }}>
          {image ? (
            <Image
              className="product-image"
              src={image.storage_path}
              alt={image.alt_text || product.name}
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              priority={priority}
              style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
            />
          ) : (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: alpha(theme.palette.primary.main, 0.3),
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              Image coming soon
            </Box>
          )}

          {product.is_featured && (
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                px: 1.5,
                py: 0.5,
                bgcolor: alpha(theme.palette.background.default, 0.85),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
                color: 'primary.main',
                fontSize: '0.6rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              Signature
            </Box>
          )}
        </Box>

        <Box sx={{ p: 3 }}>
          <Typography
            variant="overline"
            sx={{
              display: 'block',
              color: alpha(theme.palette.primary.main, 0.6),
              letterSpacing: '0.2em',
              fontSize: '0.6rem',
              mb: 0.5,
            }}
          >
            {product.karat} &middot; {product.category?.name ?? 'Jewellery'}
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontSize: '1.05rem',
              color: 'text.primary',
              fontFamily: 'var(--font-playfair-display), serif',
              mb: 1.5,
              lineHeight: 1.35,
            }}
          >
            {product.name}
          </Typography>

          {product.price ? (
            <>
              <Typography sx={{ color: 'primary.main', fontSize: '1.1rem', fontWeight: 600 }}>
                {formatRupees(product.price.total)}
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.65rem', opacity: 0.7, mt: 0.25 }}>
                Indicative &middot; {product.net_weight_g}g net
              </Typography>
            </>
          ) : (
            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', fontStyle: 'italic', opacity: 0.7 }}>
              Price on enquiry
            </Typography>
          )}
        </Box>
      </Box>
    </motion.article>
  );
}
