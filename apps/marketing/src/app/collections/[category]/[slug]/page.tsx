// No offers/aggregateRating in JSON-LD: nothing is purchasable online and the price moves daily.

import type { Metadata } from 'next';
import Script from 'next/script';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Box, Container, Typography } from '@mui/material';

import Navigation from '@/components/sections/NavigationServer';
import Footer from '@/components/sections/Footer';
import PriceBreakdownTable from '@/components/catalogue/PriceBreakdownTable';
import PriceTag from '@/components/catalogue/PriceTag';
import BookAppointmentButton from '@/components/catalogue/BookAppointmentButton';
import { getProductBySlug } from '@/lib/catalogue';
import { INDICATIVE_PRICE_DISCLAIMER, isPriceOnRequest } from '@/lib/pricing';
import { productImageUrl } from '@/lib/supabase';
import { SITE_URL } from '@/constants/store';
import { JEWELLERY_TYPES, materialLabel, typeOf } from '@/constants/jewelleryTypes';

const BASE_URL = SITE_URL;

const capitalise = (s: string) => s.replace(/(^|\s)(\S)/g, (_, space: string, c: string) => space + c.toUpperCase());

function absoluteImageUrl(storagePath: string): string {
  const url = productImageUrl(storagePath);
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
}

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Product not found' };
  }

  const material = capitalise(materialLabel(product));
  const title = `${product.name} | ${material}, Coimbatore`;
  const fallback = {
    gold: `${product.name} in ${material} at Sakthi Chains, Coimbatore. BIS hallmarked and priced at today's gold rate; book a visit to see it in person.`,
    silver: `${product.name} in ${material} at Sakthi Chains, Coimbatore. Priced at today's silver rate; book a visit to see it in person.`,
    diamond: `${product.name}, certified diamonds set in gold, at Sakthi Chains, Coimbatore. Price on request; book a visit to see it and its certificate.`,
  }[typeOf(product)];
  const description = product.description?.slice(0, 155) ?? fallback;

  return {
    title,
    description,
    alternates: { canonical: `/collections/${category}/${slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      images: product.images[0] ? [{ url: productImageUrl(product.images[0].storage_path) }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { category, slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const primaryImage = product.images[0];
  const type = typeOf(product);
  const material = capitalise(materialLabel(product));
  const metalWord = product.metal === 'silver' ? 'Silver' : 'Gold';

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku,
    description: product.description ?? undefined,
    image: primaryImage ? absoluteImageUrl(primaryImage.storage_path) : undefined,
    brand: { '@type': 'Brand', name: 'Sakthi Chains' },
    material,
    category: JEWELLERY_TYPES[type].title,
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
                  bgcolor: 'var(--c-icing)',
                  border: '1px solid rgba(128, 0, 34,0.12)',
                  overflow: 'hidden',
                }}
              >
                {primaryImage ? (
                  <Image
                    src={productImageUrl(primaryImage.storage_path)}
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
                      color: 'rgba(128, 0, 34, 0.55)',
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
                        border: '1px solid rgba(128, 0, 34,0.15)',
                        overflow: 'hidden',
                      }}
                    >
                      <Image
                        src={productImageUrl(img.storage_path)}
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
                  color: 'var(--c-accent)',
                  letterSpacing: '0.2em',
                  fontSize: '0.65rem',
                  mb: 1,
                }}
              >
                {material} &middot; {product.category?.name ?? 'Jewellery'}
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

              {product.price && (
                <Box sx={{ mt: 2.5 }}>
                  <PriceTag
                    price={product.price}
                    size="lg"
                    productId={product.id}
                    productName={product.name}
                    showActions
                  />
                  {!isPriceOnRequest(product.price) && (
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.7rem', mt: 0.5 }}>Inclusive of GST &middot; indicative</Typography>
                  )}
                </Box>
              )}

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
                  borderTop: '1px solid rgba(128, 0, 34,0.12)',
                  borderBottom: '1px solid rgba(128, 0, 34,0.12)',
                }}
              >
                {[
                  {
                    label: 'Purity',
                    value:
                      product.metal === 'silver'
                        ? product.silver_purity === '999' ? '999 Fine silver' : product.silver_purity === '925' ? '925 Sterling silver' : null
                        : product.karat ? `${product.karat} gold, BIS hallmarked` : null,
                  },
                  { label: 'Gold Colour', value: product.metal === 'gold' && product.metal_colour ? `${product.metal_colour.charAt(0).toUpperCase()}${product.metal_colour.slice(1)} gold` : null },
                  { label: 'Gross Weight', value: `${product.gross_weight_g} g` },
                  { label: `Net ${metalWord} Weight`, value: `${product.net_weight_g} g` },
                  { label: 'Size / Length', value: product.size_label },
                  { label: 'Dimensions', value: product.dimensions },
                  { label: 'Closure', value: product.closure },
                  { label: 'HUID', value: product.huid },
                  { label: 'SKU', value: product.sku },
                ].filter((spec): spec is { label: string; value: string } => Boolean(spec.value)).map((spec) => (
                  <Box key={spec.label}>
                    <Box
                      component="dt"
                      sx={{
                        color: 'var(--c-accent)',
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

              {product.has_diamond && (
                <Box component="section" aria-labelledby="diamond-details" sx={{ mb: 4, p: { xs: 2, sm: 3 }, border: '1px solid rgba(128, 0, 34,0.12)', bgcolor: 'var(--c-product-card)' }}>
                  <Typography
                    id="diamond-details"
                    component="h2"
                    sx={{ color: 'var(--c-accent)', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', mb: 2 }}
                  >
                    Diamond details
                  </Typography>
                  <Box component="dl" sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, m: 0 }}>
                    {[
                      { label: 'Certificate', value: [product.certificate_lab, product.certificate_number].filter(Boolean).join(' · ') || null },
                      { label: 'Total Diamond Weight', value: product.diamond_carat != null ? `${Number(product.diamond_carat)} ct` : null },
                      { label: 'Number of Diamonds', value: product.diamond_count != null ? String(product.diamond_count) : null },
                      { label: 'Clarity', value: product.diamond_clarity },
                      { label: 'Colour', value: product.diamond_colour },
                      { label: 'Cut', value: product.diamond_cut },
                    ]
                      .filter((spec): spec is { label: string; value: string } => Boolean(spec.value))
                      .map((spec) => (
                        <Box key={spec.label} sx={{ gridColumn: spec.label === 'Certificate' ? '1 / -1' : undefined }}>
                          <Box component="dt" sx={{ color: 'text.secondary', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', mb: 0.5 }}>
                            {spec.label}
                          </Box>
                          <Box component="dd" sx={{ m: 0, color: 'text.primary', fontSize: '0.85rem', overflowWrap: 'anywhere' }}>
                            {spec.value}
                          </Box>
                        </Box>
                      ))}
                  </Box>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.78rem', mt: 2 }}>
                    The certificate is shown with the piece at our showroom.
                  </Typography>
                </Box>
              )}

              {product.care_instructions && (
                <Box sx={{ mb: 4 }}>
                  <Typography
                    sx={{ color: 'var(--c-accent)', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', mb: 1 }}
                  >
                    Care
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                    {product.care_instructions}
                  </Typography>
                </Box>
              )}

              {product.price ? (
                <Box sx={{ mb: 4 }}>
                  <PriceBreakdownTable
                    price={product.price}
                    netWeightG={product.net_weight_g}
                    productId={product.id}
                    productName={product.name}
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
                quotedPrice={isPriceOnRequest(product.price) ? null : product.price?.total ?? null}
              />
            </Box>
          </Box>
        </Container>

        <Footer />
      </Box>
    </>
  );
}
