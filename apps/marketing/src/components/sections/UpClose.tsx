// A compact macro mosaic of fixed height (large frame, tall worn frame, two small squares), each tile labelled so the craftsmanship is named as well as shown.

import Link from 'next/link';

import ImageSlot from '@/components/ui/ImageSlot';
import Reveal from '@/components/ui/Reveal';
import { homeSlot } from '@/lib/imageSlots';

const TILES = [
  { key: 'detailLarge', label: 'Temple work', className: 'col-span-2 aspect-[16/10] md:aspect-auto md:row-span-2', sizes: '(max-width: 768px) 100vw, 50vw' },
  { key: 'detailTall', label: 'As worn', className: 'row-span-2 md:aspect-auto', sizes: '(max-width: 768px) 50vw, 25vw' },
  { key: 'detailA', label: 'BIS hallmark', className: 'aspect-square md:aspect-auto', sizes: '(max-width: 768px) 50vw, 25vw' },
  { key: 'detailB', label: 'Jhumkas', className: 'aspect-square md:aspect-auto', sizes: '(max-width: 768px) 50vw, 25vw' },
] as const;

export default function UpClose() {
  return (
    <section aria-labelledby="up-close-heading" className="surface-page pt-12 md:pt-20">
      <div className="container-wide">
        <Reveal className="mb-6 flex items-end justify-between gap-4 md:mb-10">
          <div>
            <p className="lux-eyebrow">Up Close</p>
            <h2 id="up-close-heading" className="lux-display mt-2 md:mt-3" style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.6rem)' }}>
              The detail <em>is the whole point</em>
            </h2>
          </div>
          <div className="hidden md:block">
            <Link href="/collections" className="lux-link">Explore the catalogue</Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-[repeat(2,13rem)] md:gap-4 lg:grid-rows-[repeat(2,15rem)]">
          {TILES.map((t, i) => (
            <Reveal key={t.key} delay={i * 0.08} className={`relative overflow-hidden ${t.className}`}>
              <Link href="/collections" className="group absolute inset-0 block" aria-label={`${t.label}: explore the catalogue`}>
                <div className="absolute inset-0">
                  <ImageSlot
                    slot={homeSlot(t.key)}
                    sizes={t.sizes}
                    className="transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                  />
                </div>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{ background: 'linear-gradient(180deg, rgba(20, 6, 8, 0) 60%, rgba(20, 6, 8, 0.7) 100%)' }}
                />
                <span
                  className="absolute bottom-3 left-3 text-[0.62rem] font-medium uppercase tracking-[0.2em] md:bottom-4 md:left-4"
                  style={{ color: '#F7ECD9' }}
                >
                  {t.label}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 md:hidden">
          <Link href="/collections" className="lux-link">Explore the catalogue</Link>
        </div>
      </div>
    </section>
  );
}
