// Generated from the database so a category added in admin appears without a code change.

import { MetadataRoute } from 'next';

import { getCategories, getProducts } from '@/lib/catalogue';

const BASE_URL = 'https://nihaajewels.com';

export const revalidate = 3600;

const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/collections', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/custom-design', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/gifting', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/stores', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/care-guide', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms-and-conditions', changeFrequency: 'yearly', priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  try {
    const [categories, products] = await Promise.all([getCategories(), getProducts()]);

    const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${BASE_URL}/collections/${category.slug}`,
      lastModified: new Date(category.updated_at),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const productEntries: MetadataRoute.Sitemap = products
      .filter((product) => product.category?.slug)
      .map((product) => ({
        url: `${BASE_URL}/collections/${product.category!.slug}/${product.slug}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: 'weekly',
        priority: product.is_featured ? 0.75 : 0.65,
      }));

    return [...staticEntries, ...categoryEntries, ...productEntries];
  } catch (error) {
    console.error('[sitemap] Falling back to static routes:', error);
    return staticEntries;
  }
}
