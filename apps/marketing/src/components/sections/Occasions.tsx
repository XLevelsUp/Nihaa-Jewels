// Gold by occasion as a picture mosaic, one large bridal square beside four smaller moments, so the full range reads at a glance without repeating the category grid.

import Link from 'next/link';

import ImageSlot from '@/components/ui/ImageSlot';
import Reveal from '@/components/ui/Reveal';
import type { HomeSlotKey } from '@/constants/homepageImages';
import { homeSlot } from '@/lib/imageSlots';

const OCCASIONS: { key: HomeSlotKey; name: string; line: string; href: string; large?: boolean; textInImage?: boolean }[] = [
  { key: 'occasionBridal', name: 'Bridal', line: 'Complete trousseaux, matched piece to piece.', href: '/collections?occasion=wedding', large: true },
  { key: 'occasionDiamond', name: 'Engagement & anniversaries', line: 'Certified diamond rings and keepsakes set in gold.', href: '/diamond-jewellery', textInImage: true },
  { key: 'occasionFestive', name: 'Festive', line: 'For Deepavali, Pongal and every lamp-lit evening.', href: '/collections?occasion=festive' },
  { key: 'occasionEveryday', name: 'Everyday', line: 'Light gold and silver for the office, the school run and the rest.', href: '/collections?occasion=daily-wear' },
  { key: 'occasionSilver', name: 'Silver & Gifting', line: '925 sterling and 999 fine silver keepsakes for every milestone.', href: '/silver-jewellery', textInImage: true },
];

const tileClass = (o: (typeof OCCASIONS)[number]) =>
  o.large
    ? 'col-span-2 aspect-[16/10] md:row-span-2 md:aspect-auto'
    : o.textInImage
      ? 'col-span-2 aspect-[16/10] md:col-span-1 md:aspect-auto'
      : 'aspect-square md:aspect-auto';

export default function Occasions() {
  return (
    <section aria-labelledby="occasions-heading" className="surface-page pt-12 md:pt-20">
      <div className="container-wide">
        <Reveal className="mb-6 flex items-end justify-between gap-4 md:mb-10">
          <div>
            <p className="lux-eyebrow">Shop by Occasion</p>
            <h2 id="occasions-heading" className="lux-display mt-2 md:mt-3" style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.6rem)' }}>
              Jewellery for every <em>moment worth keeping</em>
            </h2>
          </div>
          <div className="hidden md:block">
            <Link href="/collections" className="lux-link">View the catalogue</Link>
          </div>
        </Reveal>

        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-[repeat(2,13rem)] md:gap-4 lg:grid-rows-[repeat(2,15rem)]">
          {OCCASIONS.map((o, i) => (
            <li key={o.key} className={tileClass(o)}>
              <Reveal delay={i * 0.06} className="h-full">
                <Link href={o.href} aria-label={o.textInImage ? o.name : undefined} className="group relative block h-full overflow-hidden">
                  <ImageSlot
                    slot={homeSlot(o.key)}
                    sizes={o.large || o.textInImage ? '(max-width: 768px) 100vw, 25vw' : '(max-width: 768px) 50vw, 25vw'}
                    className="transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
                  />
                  {!o.textInImage && (<>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{ background: 'linear-gradient(180deg, rgba(20, 6, 8, 0) 40%, rgba(20, 6, 8, 0.85) 100%)' }}
                  />
                  <span className={`absolute inset-x-0 bottom-0 block ${o.large ? 'p-4 md:p-6' : 'p-3 md:p-4'}`}>
                    <span
                      className="lux-title block"
                      style={{
                        color: '#F7ECD9',
                        fontWeight: 600,
                        textShadow: '0 1px 12px rgba(20, 6, 8, 0.55)',
                        fontSize: o.large ? 'clamp(1.5rem, 2.4vw, 2.1rem)' : 'clamp(1rem, 1.4vw, 1.25rem)',
                      }}
                    >
                      {o.name}
                    </span>
                    <span
                      className={`mt-1 block max-w-[34ch] font-medium leading-[1.5] ${o.large ? 'text-[0.82rem] md:text-[0.88rem]' : 'hidden text-[0.75rem] lg:block'}`}
                      style={{ color: 'var(--c-champagne)', textShadow: '0 1px 8px rgba(20, 6, 8, 0.6)' }}
                    >
                      {o.line}
                    </span>
                  </span>
                  </>)}
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-6 md:hidden">
          <Link href="/collections" className="lux-link">View the catalogue</Link>
        </div>
      </div>
    </section>
  );
}
