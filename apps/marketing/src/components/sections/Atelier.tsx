// Craftsmanship told in three numbered principles beside one gold-only photograph; copy is placeholder until the client confirms each claim.

import Link from 'next/link';

import ImageSlot from '@/components/ui/ImageSlot';
import Reveal from '@/components/ui/Reveal';
import { homeSlot } from '@/lib/imageSlots';

const PRINCIPLES = [
  {
    numeral: 'I',
    title: 'Pure by measure',
    body: 'Gold pieces are BIS hallmarked for their karat, silver is offered in 925 sterling and 999 fine, and every diamond comes with a certificate.',
  },
  {
    numeral: 'II',
    title: 'Shaped by hand',
    body: 'Necklaces, bangles, earrings and chains are drawn, chased and soldered at the bench, never stamped from a mould.',
  },
  {
    numeral: 'III',
    title: 'Finished for a lifetime',
    body: 'Bring any Sakthi piece back to be cleaned, polished and checked, for as long as you wear it.',
  },
];

export default function Atelier() {
  return (
    <section aria-labelledby="atelier-heading" className="surface-page pt-12 md:pt-20">
      <div className="container-page grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12">
        <div className="relative mx-auto w-full max-w-[22rem] pb-[16%] pr-[16%] md:col-span-5 md:max-w-[26rem]">
          <Reveal className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 5' }}>
            <ImageSlot slot={homeSlot('atelierBench')} sizes="(max-width: 768px) 70vw, 26rem" />
          </Reveal>
          <Reveal
            delay={0.2}
            y={24}
            className="absolute bottom-0 right-0 w-[44%] overflow-hidden"
            style={{ aspectRatio: '4 / 5', outline: '8px solid var(--c-page)' }}
          >
            <ImageSlot slot={homeSlot('atelierDetail')} sizes="(max-width: 768px) 32vw, 12rem" />
          </Reveal>
        </div>

        <div className="md:col-span-7">
          <Reveal>
            <p className="lux-eyebrow">The Atelier</p>
            <h2 id="atelier-heading" className="lux-display mt-2 md:mt-3" style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.6rem)' }}>
              Gold, silver &amp; diamond, <em>crafted slowly</em>
            </h2>
            <p className="lux-body mt-4">
              Sakthi began with chains, and the same patience now goes into every gold, silver and diamond piece. Each
              one is checked, weighed and finished with care before it reaches the counter.
            </p>
          </Reveal>

          <ol className="mt-6">
            {PRINCIPLES.map((p, i) => (
              <li key={p.numeral}>
                <Reveal delay={0.1 + i * 0.1} className="grid grid-cols-[2.5rem_1fr] gap-3 py-4" style={{ borderTop: '1px solid color-mix(in srgb, var(--c-gold-ink) 22%, transparent)' }}>
                  <span aria-hidden="true" className="lux-title pt-0.5 text-[1rem]" style={{ color: 'var(--c-gold-ink)' }}>
                    {p.numeral}
                  </span>
                  <div>
                    <h3 className="lux-title text-[1.15rem] md:text-[1.25rem]">{p.title}</h3>
                    <p className="lux-body mt-1 text-[0.85rem]">{p.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          <Reveal delay={0.4} className="mt-4">
            <Link href="/custom-design" className="lux-link">
              Commission a piece
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
