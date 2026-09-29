'use client';

// For pages that are themselves client components and so cannot render the server
// wrapper. Fetches the same rows; the menu renders empty for one frame, then fills.

import { useEffect, useState } from 'react';

import Navigation, { type NavItem } from './Navigation';
import { PRICE_BANDS, OCCASIONS, titleCase } from '@/constants/filters';
import { supabase } from '@/lib/supabase';



export default function NavigationClient() {
  const [items, setItems] = useState<NavItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from('categories')
      .select('id, slug, name, description, badge, hero_image_path, parent_id, display_order')
      .eq('is_active', true)
      .order('display_order')
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;

        const parents = data.filter((c) => !c.parent_id && c.slug);

        setItems(
          parents.map((c) => {
            const base = `/collections/${c.slug}`;
            const children = data.filter((s) => s.parent_id === c.id);

            return {
              label: c.name,
              href: base,
              badge: c.badge,
              description: c.description,
              heroImagePath: c.hero_image_path,
              columns: [
                {
                  title: 'Browse',
                  items: [
                    { label: `All ${c.name}`, href: base },
                    ...children.map((s) => ({
                      label: s.name,
                      href: `/collections/${s.slug}`,
                    })),
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
                  items: OCCASIONS.map((o) => ({
                    label: titleCase(o),
                    href: `${base}?occasion=${o}`,
                  })),
                },
              ],
            };
          }),
        );
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <Navigation items={items} />;
}
