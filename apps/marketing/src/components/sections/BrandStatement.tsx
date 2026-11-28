// Compact brand statement: the words on the left and three level Gold, Silver and Diamond plates on the right, each linking to its page; on phones the plates sit as three small squares in one row.

import Link from 'next/link';

import ImageSlot from '@/components/ui/ImageSlot';
import Reveal from '@/components/ui/Reveal';
import { homeSlot } from '@/lib/imageSlots';

const PLATES = [
  { key: 'statementThread', numeral: 'I', type: 'Gold', caption: 'The thread', href: '/gold-jewellery' },
  { key: 'statementSilver', numeral: 'II', type: 'Silver', caption: 'The shine', href: '/silver-jewellery' },
  { key: 'statementDiamond', numeral: 'III', type: 'Diamond', caption: 'The setting', href: '/diamond-jewellery' },
] as const;

export default function BrandStatement() {
  return (
    <section aria-labelledby="brand-statement" className="surface-page pt-12 md:pt-20">
      <div className="container-wide grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center lg:gap-12">
        <Reveal className="lg:col-span-5">
          <p className="lux-eyebrow">The House of Sakthi</p>
          <h2
            id="brand-statement"
            className="lux-display mt-4 max-w-[20ch]"
            style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', lineHeight: 1.2 }}
          >
            Gold, silver &amp; diamond, <em>made with care</em> to be worn for a lifetime.
          </h2>
          <div className="mt-6 hidden items-center gap-3 lg:flex" aria-hidden="true">
            <span className="h-px w-12" style={{ background: 'var(--c-gold-ink)' }} />
            <span className="h-1.5 w-1.5 rotate-45" style={{ background: 'var(--c-gold-ink)' }} />
            <span className="h-px w-12" style={{ background: 'var(--c-gold-ink)' }} />
          </div>
          <div className="mt-6 hidden lg:block">
            <Link href="/about" className="lux-link">
              Our story
            </Link>
          </div>
        </Reveal>

        <ul className="grid grid-cols-3 gap-3 sm:gap-4 lg:col-span-7 lg:gap-4">
          {PLATES.map((plate, i) => (
            <li key={plate.key}>
              <Reveal delay={i * 0.08}>
                <Link href={plate.href} className="group block" aria-label={`${plate.type} jewellery: ${plate.caption}`}>
                  <div className="relative aspect-square overflow-hidden sm:aspect-[4/5]" style={{ background: 'var(--c-icing)' }}>
                    <ImageSlot
                      slot={homeSlot(plate.key)}
                      sizes="(max-width: 1024px) 33vw, 20vw"
                      className="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                    />
                  </div>
                  <p className="mt-2 flex items-baseline gap-2 sm:mt-3">
                    <span className="hidden text-[0.8rem] sm:inline" style={{ color: 'var(--c-gold-ink)' }}>{plate.numeral}</span>
                    <span className="text-[0.72rem] font-medium uppercase tracking-[0.16em] transition-colors group-hover:text-[var(--c-burgundy)] sm:text-[0.7rem]">
                      {plate.type}
                    </span>
                    <span className="lux-title hidden text-[0.95rem] italic sm:inline">{plate.caption}</span>
                  </p>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="lg:hidden">
          <Link href="/about" className="lux-link">
            Our story
          </Link>
        </div>
      </div>
    </section>
  );
}
