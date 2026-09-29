// Reads categories from the database so the strip cannot advertise one that does not exist.

import DiscoverByCategory from './DiscoverByCategory';
import { getNavCategories } from '@/lib/catalogue';

export default async function DiscoverByCategoryServer() {
  try {
    const categories = await getNavCategories();
    return <DiscoverByCategory categories={categories} />;
  } catch {
    return null;
  }
}
