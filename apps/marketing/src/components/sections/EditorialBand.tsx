// A full-bleed campaign photograph that breaks the page between catalogue sections, with one serif line set low over a soft scrim.

import Link from 'next/link';

import ImageSlot from '@/components/ui/ImageSlot';
import Reveal from '@/components/ui/Reveal';
import { homeSlot } from '@/lib/imageSlots';

export default function EditorialBand() {
  return (
    <section aria-labelledby="editorial-heading" className="relative isolate mt-24 h-[88svh] min-h-[520px] w-full overflow-hidden md:mt-36">
      <div className="absolute inset-0 -z-20">
        <ImageSlot slot={homeSlot('bandHeirloom')} sizes="100vw" className="object-[50%_30%]" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'linear-gradient(180deg, rgba(20, 6, 8, 0) 45%, rgba(20, 6, 8, 0.74) 100%)' }}
      />
      <Reveal className="container-page absolute inset-x-0 bottom-0 pb-16 md:pb-24">
        <p className="lux-eyebrow" style={{ color: 'var(--c-champagne)' }}>Heirloom Gold</p>
        <h2
          id="editorial-heading"
          className="lux-display mt-4 max-w-[16ch]"
          style={{ fontSize: 'clamp(2.4rem, 5.6vw, 4.8rem)', color: '#F7ECD9' }}
        >
          Given once, <em style={{ color: 'var(--c-champagne)' }}>kept for generations</em>
        </h2>
        <Link href="/collections" className="lux-link mt-6" style={{ color: '#F7ECD9' }}>
          Discover the collection
        </Link>
      </Reveal>
    </section>
  );
}
