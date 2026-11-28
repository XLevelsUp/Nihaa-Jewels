// Three compact portraits that open the catalogue filtered by wearer, in a centred row on desktop and a swipeable strip on phones.

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import ImageSlot from '@/components/ui/ImageSlot';
import Reveal from '@/components/ui/Reveal';
import { homeSlot } from '@/lib/imageSlots';

const PORTRAITS: { key: 'wornHer' | 'wornHim' | 'wornKids'; label: string; note: string; href: string }[] = [
  { key: 'wornHer', label: 'For Her', note: 'Necklaces, jhumkas & bangles', href: '/collections?gender=women' },
  { key: 'wornHim', label: 'For Him', note: 'Chains, rings & bracelets', href: '/collections?gender=men' },
  { key: 'wornKids', label: 'For the Little Ones', note: 'Gold & silver keepsakes', href: '/collections?gender=kids' },
];

export default function WornBy() {
  return (
    <section aria-labelledby="worn-by-heading" className="surface-page pt-12 md:pt-20">
      <div className="container-wide">
        <Reveal className="mb-6 text-center md:mb-10">
          <p className="lux-eyebrow">Worn By</p>
          <h2 id="worn-by-heading" className="lux-display mt-2 md:mt-3" style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.6rem)' }}>
            Jewellery for <em>everyone you love</em>
          </h2>
        </Reveal>

        <ul className="-mx-[var(--gutter)] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--gutter)] [scrollbar-width:none] md:mx-auto md:grid md:max-w-5xl md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
          {PORTRAITS.map((p, i) => (
            <li key={p.key} className="w-[62%] shrink-0 snap-start sm:w-[44%] md:w-auto">
              <Reveal delay={i * 0.08}>
                <Link href={p.href} className="group relative block aspect-[4/5] overflow-hidden">
                  <div className="absolute inset-0">
                    <ImageSlot
                      slot={homeSlot(p.key)}
                      sizes="(max-width: 768px) 62vw, 330px"
                      className="transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                    />
                  </div>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{ background: 'linear-gradient(180deg, rgba(20, 6, 8, 0) 45%, rgba(20, 6, 8, 0.82) 100%)' }}
                  />
                  <span className="absolute inset-x-0 bottom-0 block p-4 md:p-6">
                    <span className="lux-title block text-[1.2rem] leading-tight md:text-[1.5rem]" style={{ color: '#F7ECD9' }}>
                      {p.label}
                    </span>
                    <span className="mt-1 block text-[0.75rem] md:text-[0.8rem]" style={{ color: 'var(--c-champagne)' }}>
                      {p.note}
                    </span>
                    <span
                      className="mt-3 inline-flex items-center gap-1.5 text-[0.62rem] font-medium uppercase tracking-[0.2em]"
                      style={{ color: '#F7ECD9' }}
                    >
                      Explore
                      <ArrowRight size={12} strokeWidth={1.6} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
