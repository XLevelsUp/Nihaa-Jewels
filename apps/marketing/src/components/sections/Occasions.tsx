// Gold by occasion as a picture mosaic, one large bridal square beside four smaller moments, so the full range reads at a glance without repeating the category grid.

import Link from 'next/link';

import ImageSlot from '@/components/ui/ImageSlot';
import Reveal from '@/components/ui/Reveal';
import type { HomeSlotKey } from '@/constants/homepageImages';
import { homeSlot } from '@/lib/imageSlots';

const OCCASIONS: { key: HomeSlotKey; name: string; line: string; large?: boolean }[] = [
  { key: 'occasionBridal', name: 'Bridal', line: 'Complete trousseaux, matched piece to piece.', large: true },
  { key: 'occasionFirstGold', name: 'First Gold', line: 'Tiny bangles and naming-day gifts for the newest of the family.' },
  { key: 'occasionFestive', name: 'Festive', line: 'For Deepavali, Pongal and every lamp-lit evening.' },
  { key: 'occasionEveryday', name: 'Everyday', line: 'Light gold for the office, the school run and the rest.' },
  { key: 'occasionTemple', name: 'Temple & Heritage', line: 'Lakshmi, peacock and mango motifs, chased by hand.' },
];

export default function Occasions() {
  return (
    <section aria-labelledby="occasions-heading" className="surface-page pt-24 md:pt-36">
      <div className="container-wide">
        <Reveal className="mb-12 flex flex-col items-start gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="lux-eyebrow">Every Occasion</p>
            <h2 id="occasions-heading" className="lux-display mt-4" style={{ fontSize: 'clamp(2.1rem, 4.4vw, 3.6rem)' }}>
              Gold for every <em>moment worth keeping</em>
            </h2>
          </div>
          <Link href="/collections" className="lux-link">View the catalogue</Link>
        </Reveal>

        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {OCCASIONS.map((o, i) => (
            <li
              key={o.key}
              className={o.large ? 'col-span-2 aspect-[4/5] md:row-span-2 md:aspect-auto' : 'aspect-square'}
            >
              <Reveal delay={i * 0.06} className="h-full">
                <Link href="/collections" className="group relative block h-full overflow-hidden">
                  <ImageSlot
                    slot={homeSlot(o.key)}
                    sizes={o.large ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                    className="transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{ background: 'linear-gradient(180deg, rgba(20, 6, 8, 0) 40%, rgba(20, 6, 8, 0.85) 100%)' }}
                  />
                  <span className={`absolute inset-x-0 bottom-0 block ${o.large ? 'p-6 md:p-10' : 'p-4 md:p-6'}`}>
                    <span
                      className="lux-title block"
                      style={{
                        color: '#F7ECD9',
                        fontWeight: 600,
                        textShadow: '0 1px 12px rgba(20, 6, 8, 0.55)',
                        fontSize: o.large ? 'clamp(1.9rem, 3.2vw, 2.8rem)' : 'clamp(1.2rem, 1.8vw, 1.6rem)',
                      }}
                    >
                      {o.name}
                    </span>
                    <span
                      className={`mt-1.5 block max-w-[34ch] font-medium leading-[1.6] ${o.large ? 'text-[0.92rem]' : 'hidden text-[0.8rem] sm:block'}`}
                      style={{ color: 'var(--c-champagne)', textShadow: '0 1px 8px rgba(20, 6, 8, 0.6)' }}
                    >
                      {o.line}
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
