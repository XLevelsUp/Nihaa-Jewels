// Menu items carry their own href. Navigation used to build one by slugifying the
// label, which turned "Below ₹25K" into /collections/below-₹25k — a 404.

import Navigation, { type NavItem } from './Navigation';
import { getNavCategories, getSubCategories, getCategoryOccasions } from '@/lib/catalogue';
import { PRICE_BANDS, OCCASIONS, titleCase } from '@/constants/filters';



export default async function NavigationServer() {
  const [categories, subs, occasionsByCategory] = await Promise.all([
    getNavCategories(),
    getSubCategories(),
    getCategoryOccasions(),
  ]);

  const items: NavItem[] = categories.map((c) => {
    const base = `/collections/${c.slug}`;
    const children = subs.filter((s) => s.parentSlug === c.slug);

    return {
      label: c.name,
      href: base,
      badge: c.badge,
      description: c.description,
      heroImagePath: c.heroImagePath,
      columns: ([
        {
          title: 'Browse',
          items: [
            { label: `All ${c.name}`, href: base },
            ...children.map((s) => ({ label: s.name, href: `/collections/${s.slug}` })),
          ],
        },
        {
          title: 'Price',
          items: PRICE_BANDS.map((b) => ({
            label: b.label,
            href: `${base}?price=${encodeURIComponent(b.label)}`,
          })),
        },
        {
          title: 'Occasion',
          // Only what this category actually has, or the menu offers filters
          // that return nothing.
          items: (occasionsByCategory[c.slug] ?? []).map((o) => ({
            label: titleCase(o),
            href: `${base}?occasion=${o}`,
          })),
        },
      ] as NavItem['columns']).filter((col) => col.items.length > 0),
    };
  });

  return <Navigation items={items} />;
}
