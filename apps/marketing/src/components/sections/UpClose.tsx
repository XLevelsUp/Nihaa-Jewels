// A macro mosaic, one large square beside a tall worn frame and two stacked small squares, so the craftsmanship is shown rather than described.

import Link from 'next/link';

import ImageSlot from '@/components/ui/ImageSlot';
import Reveal from '@/components/ui/Reveal';
import { homeSlot } from '@/lib/imageSlots';

export default function UpClose() {
  return (
    <section aria-labelledby="up-close-heading" className="surface-page pt-24 md:pt-36">
      <div className="container-wide">
        <Reveal className="mb-12 flex flex-col items-start gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="lux-eyebrow">Up Close</p>
            <h2 id="up-close-heading" className="lux-display mt-4" style={{ fontSize: 'clamp(2.1rem, 4.4vw, 3.6rem)' }}>
              The detail <em>is the whole point</em>
            </h2>
          </div>
          <Link href="/collections" className="lux-link">Explore the catalogue</Link>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <Reveal className="relative col-span-2 aspect-square overflow-hidden md:row-span-2 md:aspect-auto">
            <ImageSlot slot={homeSlot('detailLarge')} sizes="(max-width: 768px) 100vw, 50vw" />
          </Reveal>
          <Reveal delay={0.1} className="relative row-span-2 overflow-hidden">
            <ImageSlot slot={homeSlot('detailTall')} sizes="(max-width: 768px) 50vw, 25vw" />
          </Reveal>
          <Reveal delay={0.18} className="relative aspect-square overflow-hidden">
            <ImageSlot slot={homeSlot('detailA')} sizes="(max-width: 768px) 50vw, 25vw" />
          </Reveal>
          <Reveal delay={0.26} className="relative aspect-square overflow-hidden">
            <ImageSlot slot={homeSlot('detailB')} sizes="(max-width: 768px) 50vw, 25vw" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
