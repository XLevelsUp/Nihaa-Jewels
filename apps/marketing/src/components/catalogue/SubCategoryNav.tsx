'use client';

// Sub-categories are real pages with their own URL and SEO, unlike the filter bar
// which only narrows what is already on screen.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box } from '@mui/material';

import type { Category } from '@/types/database';

interface SubCategoryNavProps {
  parentSlug: string;
  items: Category[];
}

export default function SubCategoryNav({ parentSlug, items }: SubCategoryNavProps) {
  const pathname = usePathname();

  const links = [
    { slug: parentSlug, name: 'All' },
    ...items.map((c) => ({ slug: c.slug, name: c.name })),
  ];

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
      {links.map((l) => {
        const href = `/collections/${l.slug}`;
        const active = pathname === href;
        return (
          <Box
            key={l.slug}
            component={Link}
            href={href}
            sx={{
              px: 2.25,
              py: 0.9,
              fontSize: '0.78rem',
              textDecoration: 'none',
              border: '1px solid',
              borderColor: active ? 'var(--c-accent)' : 'var(--c-border)',
              bgcolor: active ? 'var(--c-accent)' : 'transparent',
              color: active ? 'var(--c-on-sage)' : 'var(--c-text-soft)',
              transition: 'all 0.25s ease',
              '&:hover': { borderColor: 'var(--c-accent)' },
            }}
          >
            {l.name}
          </Box>
        );
      })}
    </Box>
  );
}
