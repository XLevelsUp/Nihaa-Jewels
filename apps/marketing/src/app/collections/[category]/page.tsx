// Renders any category from the database; replaced seven hardcoded page folders.

import type { Metadata } from 'next';
import Script from 'next/script';
import { notFound } from 'next/navigation';

import CategoryClient from './CategoryClient';
import Footer from '@/components/sections/Footer';
import { getCategoryBySlug, getCategories, getCategoryWithChildren, getProducts } from '@/lib/catalogue';
import { PRICE_BANDS, OCCASIONS, titleCase } from '@/constants/filters';
import { SITE_URL } from '@/constants/store';

const BASE_URL = SITE_URL;

export const revalidate = 3600;

export const dynamicParams = true;

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return categories.map((c) => ({ category: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) return { title: 'Collection not found' };

  // The layout appends the brand, so a title names the collection plus the city searchers type; "in Coimbatore" is added unless staff already wrote it.
  const base = category.meta_title?.trim() || category.name;
  const title = /coimbatore/i.test(base) ? base : `${base} in Coimbatore`;
  const description =
    category.meta_description ??
    category.description ??
    `Explore ${category.name.toLowerCase()} at Sakthi Chains, a jewellery shop at Town Hall, Coimbatore. Weighed and priced at today's rate; book a visit to see them in person.`;

  return {
    title,
    description,
    alternates: { canonical: `/collections/${slug}` },
    openGraph: { title, description, type: 'website' },
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category: slug } = await params;
  const sp = await searchParams;

  const result = await getCategoryWithChildren(slug);
  if (!result) notFound();
  const { category, children } = result;

  const band = PRICE_BANDS.find((b) => b.label === sp.price);

  const products = await getProducts({
    categoryIds: [category.id, ...children.map((c) => c.id)],
    karat: sp.karat as never,
    gender: sp.gender,
    occasion: sp.occasion,
    minPrice: band?.min,
    maxPrice: band?.max,
  });

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Sakthi Chains ${category.name}`,
    description: category.meta_description ?? category.description ?? undefined,
    numberOfItems: products.length,
    itemListElement: products.map((product, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: product.name,
      url: `${BASE_URL}/collections/${slug}/${product.slug}`,
    })),
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
        name: category.name,
        item: `${BASE_URL}/collections/${slug}`,
      },
    ],
  };

  return (
    <>
      <Script
        id={`${slug}-itemlist-schema`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Script
        id={`${slug}-breadcrumb-schema`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CategoryClient category={category} products={products} subCategories={children} footer={<Footer />} />
    </>
  );
}
