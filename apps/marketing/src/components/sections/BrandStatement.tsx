// The brand promise told in three beats: a photograph of the raw thread, the sentence in the centre, the finished chain; images stagger on desktop and sit side by side under the text on phones.

import Link from 'next/link';

import ImageSlot from '@/components/ui/ImageSlot';
import Reveal from '@/components/ui/Reveal';
import { homeSlot } from '@/lib/imageSlots';

function Plate({ slotKey, numeral, caption, ratio }: { slotKey: 'statementThread' | 'statementFinish'; numeral: string; caption: string; ratio: string }) {
  return (
    <figure>
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: ratio }}>
        <ImageSlot slot={homeSlot(slotKey)} sizes="(max-width: 1024px) 45vw, 22vw" />
      </div>
      <figcaption className="mt-4 flex items-baseline gap-3">
        <span className="lux-title text-[0.95rem]" style={{ color: 'var(--c-gold-ink)' }}>{numeral}</span>
        <span className="lux-title text-[1.05rem] italic">{caption}</span>
      </figcaption>
    </figure>
  );
}

export default function BrandStatement() {
  return (
    <section aria-labelledby="brand-statement" className="surface-page pt-24 md:pt-32">
      <div className="container-wide grid grid-cols-2 gap-x-4 gap-y-14 lg:grid-cols-12 lg:items-center lg:gap-x-8">
        <Reveal className="order-2 lg:order-1 lg:col-span-3">
          <div className="lg:-translate-y-12">
            <Plate slotKey="statementThread" numeral="I" caption="The thread" ratio="3 / 4" />
          </div>
        </Reveal>

        <div className="order-1 col-span-2 flex flex-col items-center text-center lg:order-2 lg:col-span-6">
          <Reveal>
            <p className="lux-eyebrow">The House of Sakthi</p>
          </Reveal>
          <Reveal delay={0.12}>
            <h2
              id="brand-statement"
              className="lux-display mt-8 max-w-[20ch] md:mt-10"
              style={{ fontSize: 'clamp(1.9rem, 3.6vw, 3.2rem)', lineHeight: 1.18 }}
            >
              Every piece begins as a single thread of gold, <em>shaped and finished by hand</em>, to be worn for a
              lifetime and passed on after.
            </h2>
          </Reveal>
          <Reveal delay={0.3} className="mt-10 flex items-center gap-3" aria-hidden="true">
            <span className="h-px w-12" style={{ background: 'var(--c-gold-ink)' }} />
            <span className="h-1.5 w-1.5 rotate-45" style={{ background: 'var(--c-gold-ink)' }} />
            <span className="h-px w-12" style={{ background: 'var(--c-gold-ink)' }} />
          </Reveal>
          <Reveal delay={0.4} className="mt-8">
            <Link href="/about" className="lux-link">Our story</Link>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="order-3 lg:col-span-3">
          <div className="translate-y-10 lg:translate-y-12">
            <Plate slotKey="statementFinish" numeral="II" caption="The finish" ratio="4 / 5" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
