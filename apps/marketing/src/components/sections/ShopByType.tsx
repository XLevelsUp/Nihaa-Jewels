// Homepage strip for the three things Sakthi Chains sells, each card leading to its own page; a swipeable row on phones, three columns from tablet up.

import Link from 'next/link';

import ImageSlot from '@/components/ui/ImageSlot';
import Reveal from '@/components/ui/Reveal';
import { typeSlot } from '@/lib/imageSlots';
import { JEWELLERY_TYPES, TYPE_ORDER } from '@/constants/jewelleryTypes';

export default function ShopByType() {
  return (
    <section aria-labelledby="shop-by-type" className="surface-page pt-12 md:pt-20">
      <div className="container-wide">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="lux-eyebrow">Shop by type</p>
            <h2 id="shop-by-type" className="lux-display mt-2 md:mt-3" style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.6rem)' }}>
              Gold, silver <em>&amp; diamond</em>
            </h2>
          </div>
        </Reveal>

        <ul className="-mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:mt-8 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
          {TYPE_ORDER.map((t, i) => {
            const spec = JEWELLERY_TYPES[t];
            return (
              <li key={t} className="w-[44%] shrink-0 snap-start sm:w-[36%] md:w-auto">
                <Reveal delay={i * 0.08}>
                  <Link href={spec.path} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden" style={{ background: 'var(--c-icing)' }}>
                      <ImageSlot
                        slot={typeSlot(spec.card)}
                        sizes="(max-width: 768px) 44vw, 33vw"
                        className="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                      />
                    </div>
                    <span className="mt-2 block md:mt-4">
                      <span className="lux-title block text-[1.05rem] md:text-[1.35rem]">{spec.title}</span>
                      <span className="text-soft mt-1 block text-[0.75rem] md:text-[0.8rem]">{spec.eyebrow}</span>
                    </span>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
