// No offers/aggregateRating in JSON-LD: nothing is purchasable online and the price moves daily.

import type { Metadata } from 'next';
import Script from 'next/script';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Box, Container, Typography } from '@mui/material';

import Navigation from '@/components/sections/Navigation';
import Footer from '@/components/sections/Footer';
import PriceBreakdownTable from '@/components/catalogue/PriceBreakdownTable';
import BookAppointmentButton from '@/components/catalogue/BookAppointmentButton';
import { getProductBySlug } from '@/lib/catalogue';
import { INDICATIVE_PRICE_DISCLAIMER } from '@/lib/pricing';

const BASE_URL = 'https://nihaajewels.com';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found | Nihaa Jewels' };
  }

  const title = `${product.name} | ${product.karat} Gold | Nihaa Jewels Coimbatore`;
  const description =
    product.description?.slice(0, 155) ??
    `${product.name} in ${product.karat} BIS hallmarked gold. Book an appointment to view at our Coimbatore store.`;

  return {
    title,
    description,
    alternates: { canonical: `/collections/${category}/${slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      images: product.images[0] ? [{ url: product.images[0].storage_path }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { category, slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const primaryImage = product.images[0];

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku,
    description: product.description ?? undefined,
    image: primaryImage ? `${BASE_URL}${primaryImage.storage_path}` : undefined,
    brand: { '@type': 'Brand', name: 'Nihaa Jewels' },
    material: `${product.karat} Gold`,
    weight: {
      '@type': 'QuantitativeValue',
      value: product.gross_weight_g,
      unitCode: 'GRM',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Collections', item: `${BASE_URL}/collections` },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.category?.name ?? category,
        item: `${BASE_URL}/collections/${category}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: `${BASE_URL}/collections/${category}/${slug}`,
      },
    ],
  };

  return (
    <>
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Script
        id="product-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Navigation />

        <Container component="main" maxWidth="lg" sx={{ pt: 20, pb: 12, px: 3 }}>
          <Box component="nav" aria-label="Breadcrumb" sx={{ mb: 5 }}>
            <Typography sx={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'text.secondary' }}>
              <Box component={Link} href="/collections" sx={{ color: 'inherit', textDecoration: 'none' }}>
                Collections
              </Box>
              {' / '}
              <Box
                component={Link}
                href={`/collections/${category}`}
                sx={{ color: 'inherit', textDecoration: 'none' }}
              >
                {product.category?.name ?? category}
              </Box>
              {' / '}
              <Box component="span" sx={{ color: 'primary.main' }}>
                {product.name}
              </Box>
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 5, md: 8 },
              alignItems: 'start',
            }}
          >
            <Box>
              <Box
                sx={{
                  position: 'relative',
                  aspectRatio: '1 / 1',
                  bgcolor: '#0E0E0E',
                  border: '1px solid rgba(212,175,55,0.12)',
                  overflow: 'hidden',
                }}
              >
                {primaryImage ? (
                  <Image
                    src={primaryImage.storage_path}
                    alt={primaryImage.alt_text || product.name}
                    fill
                    priority
                    sizes="(max-width: 900px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(212,175,55,0.3)',
                      fontSize: '0.7rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Photography coming soon
                  </Box>
                )}
              </Box>

              {product.images.length > 1 && (
                <Box sx={{ display: 'flex', gap: 1.5, mt: 2, flexWrap: 'wrap' }}>
                  {product.images.slice(1).map((img) => (
                    <Box
                      key={img.id}
                      sx={{
                        position: 'relative',
                        width: 72,
                        height: 72,
                        border: '1px solid rgba(212,175,55,0.15)',
                        overflow: 'hidden',
                      }}
                    >
                      <Image
                        src={img.storage_path}
                        alt={img.alt_text || product.name}
                        fill
                        sizes="72px"
                        style={{ objectFit: 'cover' }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            <Box>
              <Typography
                variant="overline"
                sx={{
                  display: 'block',
                  color: 'rgba(212,175,55,0.6)',
                  letterSpacing: '0.2em',
                  fontSize: '0.65rem',
                  mb: 1,
                }}
              >
                {product.karat} &middot; {product.category?.name ?? 'Jewellery'}
              </Typography>

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  color: 'text.primary',
                  fontFamily: 'var(--font-playfair-display), serif',
                  lineHeight: 1.2,
                }}
              >
                {product.name}
              </Typography>

              <Box sx={{ width: 56, height: 1, bgcolor: 'primary.main', mt: 3, mb: 4 }} />

              {product.description && (
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.9, mb: 4, fontSize: '0.95rem' }}>
                  {product.description}
                </Typography>
              )}

              <Box
                component="dl"
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 2,
                  m: 0,
                  mb: 4,
                  py: 3,
                  borderTop: '1px solid rgba(212,175,55,0.12)',
                  borderBottom: '1px solid rgba(212,175,55,0.12)',
                }}
              >
                {[
                  { label: 'Purity', value: `${product.karat} BIS Hallmarked` },
                  { label: 'Gross Weight', value: `${product.gross_weight_g} g` },
                  { label: 'Net Gold Weight', value: `${product.net_weight_g} g` },
                  { label: 'SKU', value: product.sku },
                ].map((spec) => (
                  <Box key={spec.label}>
                    <Box
                      component="dt"
                      sx={{
                        color: 'rgba(212,175,55,0.6)',
                        fontSize: '0.6rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        mb: 0.5,
                      }}
                    >
                      {spec.label}
                    </Box>
                    <Box component="dd" sx={{ m: 0, color: 'text.primary', fontSize: '0.85rem' }}>
                      {spec.value}
                    </Box>
                  </Box>
                ))}
              </Box>

              {product.price ? (
                <Box sx={{ mb: 4 }}>
                  <PriceBreakdownTable
                    price={product.price}
                    netWeightG={product.net_weight_g}
                    karat={product.karat}
                  />
                </Box>
              ) : (
                <Typography
                  sx={{ color: 'text.secondary', fontStyle: 'italic', mb: 4, fontSize: '0.9rem' }}
                >
                  Price available on enquiry. {INDICATIVE_PRICE_DISCLAIMER}
                </Typography>
              )}

              <BookAppointmentButton
                productId={product.id}
                productName={product.name}
                quotedPrice={product.price?.total ?? null}
              />
            </Box>
          </Box>
        </Container>

        <Footer />
      </Box>
    </>
  );
}
