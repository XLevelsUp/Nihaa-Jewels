// Gold, Silver and Diamond menu entries, shared by the server and client navigation so both menus match.

import type { NavItem } from '@/components/sections/Navigation';
import { JEWELLERY_TYPES } from '@/constants/jewelleryTypes';
import { PRICE_BANDS } from '@/constants/filters';

export function typeNavItems(categories: { slug: string; name: string }[]): NavItem[] {
  const gold = JEWELLERY_TYPES.gold;
  const silver = JEWELLERY_TYPES.silver;
  const diamond = JEWELLERY_TYPES.diamond;

  return [
    {
      label: gold.label,
      href: gold.path,
      description: gold.metaDescription,
      columns: [
        {
          title: 'Browse',
          items: [{ label: 'All gold jewellery', href: gold.path }, ...categories.map((c) => ({ label: `Gold ${c.name.toLowerCase()}`, href: `${gold.path}?category=${c.slug}` }))],
        },
        { title: 'Purity', items: ['22K', '18K', '24K'].map((k) => ({ label: `${k} gold`, href: `${gold.path}?karat=${k}` })) },
        { title: 'Price', items: PRICE_BANDS.map((b) => ({ label: b.label, href: `${gold.path}?price=${encodeURIComponent(b.label)}` })) },
      ],
    },
    {
      label: silver.label,
      href: silver.path,
      description: silver.metaDescription,
      columns: [
        { title: 'Browse', items: [{ label: 'All silver jewellery', href: silver.path }] },
        {
          title: 'Purity',
          items: [
            { label: '925 sterling silver', href: `${silver.path}?karat=925` },
            { label: '999 fine silver', href: `${silver.path}?karat=999` },
          ],
        },
      ],
    },
    {
      label: diamond.label,
      href: diamond.path,
      description: diamond.metaDescription,
      columns: [
        {
          title: 'Browse',
          items: [
            { label: 'All diamond jewellery', href: diamond.path },
            { label: 'Certificates and questions', href: `${diamond.path}#type-faq` },
          ],
        },
      ],
    },
  ];
}
