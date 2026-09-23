// Renders any category from the database; replaced seven hardcoded page folders.

import type { Metadata } from 'next';
import Script from 'next/script';
import { notFound } from 'next/navigation';

import CategoryClient from './CategoryClient';
import { getCategoryBySlug, getCategories, getProducts } from '@/lib/catalogue';

const BASE_URL = 'https://nihaajewels.com';

export const revalidate = 3600;

export const dynamicParams = true;

interface PageProps {
  params: Promise<{ category: string }>;
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

  if (!category) return { title: 'Collection Not Found | Nihaa Jewels' };

  const title = category.meta_title ?? `${category.name} | Nihaa Jewels Coimbatore`;
  const description =
    category.meta_description ??
    category.description ??
    `Explore our ${category.name.toLowerCase()} collection in BIS hallmarked gold. Book an appointment to view at our Coimbatore store.`;

  return {
    title,
    description,
    keywords: category.meta_keywords?.length ? category.meta_keywords : undefined,
    alternates: { canonical: `/collections/${slug}` },
    openGraph: { title, description, type: 'website' },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: slug } = await params;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProducts({ categorySlug: slug });

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Nihaa Jewels ${category.name}`,
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
      <CategoryClient category={category} products={products} />
    </>
  );
}
