// Craftsmanship told in three numbered principles beside one gold-only photograph; copy is placeholder until the client confirms each claim.

import Link from 'next/link';

import ImageSlot from '@/components/ui/ImageSlot';
import Reveal from '@/components/ui/Reveal';
import { homeSlot } from '@/lib/imageSlots';

const PRINCIPLES = [
  {
    numeral: 'I',
    title: 'Pure by measure',
    body: 'Every piece is BIS hallmarked for its karat, so its purity can be checked by anyone, anywhere.',
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
    <section aria-labelledby="atelier-heading" className="surface-page pt-24 md:pt-36">
      <div className="container-page grid grid-cols-1 items-center gap-14 md:grid-cols-12 md:gap-10">
        <div className="relative pb-[18%] pr-[18%] md:col-span-6">
          <Reveal className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 5' }}>
            <ImageSlot slot={homeSlot('atelierBench')} sizes="(max-width: 768px) 82vw, 40vw" />
          </Reveal>
          <Reveal
            delay={0.2}
            y={36}
            className="absolute bottom-0 right-0 w-[48%] overflow-hidden"
            style={{ aspectRatio: '4 / 5', outline: '10px solid var(--c-page)' }}
          >
            <ImageSlot slot={homeSlot('atelierDetail')} sizes="(max-width: 768px) 40vw, 20vw" />
          </Reveal>
        </div>

        <div className="md:col-span-6 lg:col-span-5 lg:col-start-8">
          <Reveal>
            <p className="lux-eyebrow">The Atelier</p>
            <h2 id="atelier-heading" className="lux-display mt-4" style={{ fontSize: 'clamp(2.1rem, 4.2vw, 3.4rem)' }}>
              Gold, <em>shaped slowly</em>
            </h2>
            <p className="lux-body mt-6">
              Sakthi began with chains, and the same patience now goes into every necklace, bangle and earring. Each
              piece passes through the same few pairs of hands from the first thread of gold to the final polish.
            </p>
          </Reveal>

          <ol className="mt-12">
            {PRINCIPLES.map((p, i) => (
              <li key={p.numeral}>
                <Reveal delay={0.1 + i * 0.1} className="grid grid-cols-[3rem_1fr] gap-4 py-6" style={{ borderTop: '1px solid color-mix(in srgb, var(--c-gold-ink) 22%, transparent)' }}>
                  <span aria-hidden="true" className="lux-title pt-0.5 text-[1.1rem]" style={{ color: 'var(--c-gold-ink)' }}>
                    {p.numeral}
                  </span>
                  <div>
                    <h3 className="lux-title text-[1.35rem]">{p.title}</h3>
                    <p className="lux-body mt-2 text-[0.9rem]">{p.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          <Reveal delay={0.4} className="mt-6">
            <Link href="/custom-design" className="lux-link">
              Commission a piece
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
