'use client';

// Horizontal scroller with a peeking next card, so it reads as scrollable without needing
// the arrows. Native scroll-snap rather than a carousel library — no JS to drag, and it
// works with a trackpad, touch and keyboard for free.

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { NavCategory } from '@/lib/catalogue';

interface DiscoverByCategoryProps {
  categories: NavCategory[];
}

export default function DiscoverByCategory({ categories }: DiscoverByCategoryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    sync();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      el.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

  const nudge = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    // One card plus its gap, so a click always lands cleanly on the next card.
    const card = el.querySelector('[data-card]') as HTMLElement | null;
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * dir, behavior: 'smooth' });
  };

  if (categories.length === 0) return null;

  return (
    <section className="surface-page section-tight">
      <div className="container-wide">

        <header className="mb-10 text-center">
          <h2 className="heading-lg text-body">Discover By Category</h2>
          <div className="mx-auto mt-5 h-px w-14 bg-[var(--c-border-firm)]" />
        </header>

        <div className="relative">
          <button
            type="button"
            onClick={() => nudge(-1)}
            disabled={atStart}
            aria-label="Previous categories"
            className="absolute left-2 top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border transition-opacity md:flex"
            style={{
              background: 'var(--c-card)',
              borderColor: 'var(--c-border)',
              color: 'var(--c-accent)',
              opacity: atStart ? 0.3 : 1,
              cursor: atStart ? 'default' : 'pointer',
              boxShadow: '0 4px 14px color-mix(in srgb, var(--c-text) 8%, transparent)',
            }}
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>

          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto pb-2"
            style={{
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {categories.map((c, i) => (
              <motion.div
                key={c.slug}
                data-card
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: Math.min(i, 4) * 0.06 }}
                className="shrink-0"
                style={{
                  scrollSnapAlign: 'start',
                  // Fractional widths leave the next card peeking, which signals scrollability.
                  width: 'clamp(180px, 22vw, 290px)',
                }}
              >
                <Link href={`/collections/${c.slug}`} className="group block">
                  <div
                    className="relative w-full overflow-hidden"
                    style={{ aspectRatio: '1 / 1', background: 'var(--c-icing)' }}
                  >
                    <Image
                      src={c.heroImagePath ?? '/images/hero-frame-3-flatlay.webp'}
                      alt={`${c.name} — Nihaa Jewels Coimbatore`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 60vw, 290px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <p
                    className="text-body mt-4 text-center transition-colors duration-300 group-hover:text-[var(--c-accent)]"
                    style={{ fontSize: '0.95rem' }}
                  >
                    {c.name}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => nudge(1)}
            disabled={atEnd}
            aria-label="More categories"
            className="absolute right-2 top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border transition-opacity md:flex"
            style={{
              background: 'var(--c-card)',
              borderColor: 'var(--c-border)',
              color: 'var(--c-accent)',
              opacity: atEnd ? 0.3 : 1,
              cursor: atEnd ? 'default' : 'pointer',
              boxShadow: '0 4px 14px color-mix(in srgb, var(--c-text) 8%, transparent)',
            }}
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>

      </div>
    </section>
  );
}
