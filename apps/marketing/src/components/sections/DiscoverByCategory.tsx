'use client';

// Collections strip: up to five admin-managed categories as one row of equal square tiles, each opening its collection.

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

import ImageSlot from '@/components/ui/ImageSlot';
import type { NavCategory } from '@/lib/catalogue';

const EASE = [0.22, 0.61, 0.36, 1] as const;
const MAX_TILES = 5;

interface DiscoverByCategoryProps {
  categories: NavCategory[];
}

// Tailwind needs whole class names, so the column count is looked up rather than built from a number.
const LG_COLS: Record<number, string> = { 1: 'lg:grid-cols-3', 2: 'lg:grid-cols-3', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5' };

export default function DiscoverByCategory({ categories }: DiscoverByCategoryProps) {
  const reduceMotion = useReducedMotion();
  const tiles = categories.slice(0, MAX_TILES);
  const count = tiles.length;

  if (count === 0) return null;

  const reveal = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-10% 0px' },
          transition: { duration: 1.2, delay, ease: EASE },
        };

  return (
    <section aria-labelledby="collections-heading" className="surface-page pt-24 md:pt-36">
      <div className="container-wide">
        <motion.header {...reveal(0)} className="mb-12 flex flex-col items-start gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="lux-eyebrow">The Collections</p>
            <h2
              id="collections-heading"
              className="mt-4"
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontWeight: 300,
                fontSize: 'clamp(2.1rem, 4.4vw, 3.6rem)',
                lineHeight: 1.05,
                color: 'var(--c-text)',
              }}
            >
              Gold, <em style={{ color: 'var(--c-burgundy)' }}>for every moment</em>
            </h2>
          </div>

          <Link
            href="/collections"
            className="group inline-flex min-h-11 items-center gap-4 text-[0.66rem] font-medium uppercase tracking-[0.32em]"
            style={{ color: 'var(--c-burgundy)' }}
          >
            View all collections
            <span aria-hidden="true" className="h-px w-10 transition-[width] duration-700 ease-out group-hover:w-16" style={{ background: 'currentColor' }} />
          </Link>
        </motion.header>

        {/* One row of equal square tiles: a quick way into each collection, not a gallery that fills the screen. */}
        <div className={`grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:gap-x-5 ${LG_COLS[count] ?? 'lg:grid-cols-5'}`}>
          {tiles.map((c, i) => (
            <motion.div key={c.slug} {...reveal(Math.min(i, 4) * 0.08)}>
              <Link href={`/collections/${c.slug}`} className="group block">
                <div className="relative aspect-square w-full overflow-hidden" style={{ background: 'var(--c-icing)' }}>
                  <ImageSlot
                    slot={{
                      file: '',
                      label: `${c.name} collection`,
                      alt: `${c.name} collection, Sakthi Chains`,
                      ratio: '1:1',
                      size: '1000 × 1000',
                      brief: '',
                      hint: 'Set in Admin, Categories',
                      src: c.heroImagePath,
                    }}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
                    className="transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
                  />
                </div>

                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <h3
                    style={{
                      fontFamily: 'var(--font-cormorant), Georgia, serif',
                      fontWeight: 600,
                      fontSize: 'clamp(1.05rem, 1.4vw, 1.3rem)',
                      lineHeight: 1.15,
                      color: 'var(--c-text)',
                    }}
                  >
                    {c.name}
                  </h3>
                  <span aria-hidden="true" className="text-[0.85rem] transition-transform duration-300 group-hover:translate-x-1" style={{ color: 'var(--c-burgundy)' }}>
                    →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
