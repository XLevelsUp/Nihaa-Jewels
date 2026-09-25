import type { Metadata } from 'next';

import NotFoundClient from './NotFoundClient';
import { getCategories } from '@/lib/catalogue';

export const metadata: Metadata = {
  title: 'Page Not Found | Nihaa Jewels',
  description: 'The page you are looking for could not be found. Explore our gold and diamond jewellery collections in Coimbatore.',
  robots: { index: false, follow: true },
};

export default async function NotFound() {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  try {
    categories = await getCategories();
  } catch {
    // A lost visitor should still get a usable page if the database is unreachable.
  }

  return <NotFoundClient categories={categories.slice(0, 6)} />;
}
