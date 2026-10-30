// Three tall portraits that open the catalogue filtered by wearer; the name sits on the photograph so the image carries the section.

import Link from 'next/link';

import ImageSlot from '@/components/ui/ImageSlot';
import Reveal from '@/components/ui/Reveal';
import { homeSlot } from '@/lib/imageSlots';

const PORTRAITS = [
  { key: 'wornHer', label: 'For Her', href: '/collections?gender=women' },
  { key: 'wornHim', label: 'For Him', href: '/collections?gender=men' },
  { key: 'wornKids', label: 'For the Little Ones', href: '/collections?gender=kids' },
] as const;

export default function WornBy() {
  return (
    <section aria-labelledby="worn-by-heading" className="surface-page pt-24 md:pt-36">
      <div className="container-wide">
        <Reveal className="mb-12 text-center md:mb-16">
          <p className="lux-eyebrow">Worn By</p>
          <h2 id="worn-by-heading" className="lux-display mt-4" style={{ fontSize: 'clamp(2.1rem, 4.4vw, 3.6rem)' }}>
            Gold for <em>everyone you love</em>
          </h2>
        </Reveal>

        <ul className="-mx-[var(--gutter)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
          {PORTRAITS.map((p, i) => (
            <li key={p.key} className="w-[78%] shrink-0 snap-start md:w-auto">
              <Reveal delay={i * 0.1}>
                <Link href={p.href} className="group relative block overflow-hidden" style={{ aspectRatio: '2 / 3' }}>
                  <ImageSlot
                    slot={homeSlot(p.key)}
                    sizes="(max-width: 768px) 78vw, 33vw"
                    className="transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{ background: 'linear-gradient(180deg, rgba(20, 6, 8, 0) 60%, rgba(20, 6, 8, 0.66) 100%)' }}
                  />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
                    <span className="lux-title text-[clamp(1.4rem,2.2vw,1.9rem)]" style={{ color: '#F7ECD9' }}>
                      {p.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="mb-3 h-px w-8 transition-[width] duration-700 ease-out group-hover:w-14"
                      style={{ background: '#F7ECD9' }}
                    />
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
