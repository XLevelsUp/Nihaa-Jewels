// Homepage browse-by-price with live design counts per band: a compact tappable list on phones, four cards with a burgundy hover from tablet up.

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import Reveal from '@/components/ui/Reveal';
import { PRICE_BANDS } from '@/constants/filters';
import { getProducts } from '@/lib/catalogue';
import { isPriceOnRequest } from '@/lib/pricing';

const BAND_SUBTITLES: Record<string, string> = {
  'Below ₹25K': 'Silver pieces, everyday studs and first gifts',
  '₹25K – ₹50K': 'Light gold chains, rings and daily-wear pairs',
  '₹50K – ₹1L': 'Classic chains, bangles and festive sets',
  '₹1L & Above': 'Bridal harams, heavy chains and heirloom work',
};

async function countsByBand(): Promise<Record<string, number>> {
  try {
    const products = await getProducts();
    const totals = products.flatMap((p) => (p.price && !isPriceOnRequest(p.price) ? [p.price.total] : []));
    return Object.fromEntries(
      PRICE_BANDS.map((b) => [b.label, totals.filter((t) => (b.min == null || t >= b.min) && (b.max == null || t <= b.max)).length]),
    );
  } catch {
    return {};
  }
}

export default async function ShopByPrice() {
  const counts = await countsByBand();
  const countText = (label: string) => {
    const n = counts[label];
    return n ? `${n} ${n === 1 ? 'design' : 'designs'}` : 'Explore';
  };

  return (
    <section
      aria-labelledby="shop-by-price"
      className="surface-page pt-12 md:pt-20"
      style={{ '--line': 'color-mix(in srgb, var(--c-burgundy) 14%, transparent)' } as React.CSSProperties}
    >
      <div className="container-wide">
        <Reveal className="flex items-end justify-between gap-4">
          <div>
            <p className="lux-eyebrow">Shop by price</p>
            <h2 id="shop-by-price" className="lux-display mt-2 md:mt-3" style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.6rem)' }}>
              Pieces for <em>every budget</em>
            </h2>
          </div>
          <Link
            href="/collections"
            className="group inline-flex min-h-11 shrink-0 items-center gap-1.5 text-[0.68rem] font-medium uppercase tracking-[0.18em]"
            style={{ color: 'var(--c-burgundy)' }}
          >
            All pieces
            <ArrowRight size={13} strokeWidth={1.6} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <ul className="mt-6 border-t border-[var(--line)] md:hidden">
          {PRICE_BANDS.map((band, i) => (
            <li key={band.label}>
              <Link
                href={`/collections?price=${encodeURIComponent(band.label)}`}
                className="group grid min-h-16 grid-cols-[28px_1fr_auto] items-center gap-3 border-b border-[var(--line)] py-3"
              >
                <span className="lux-eyebrow tabular-nums" style={{ color: 'var(--c-gold-ink)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0">
                  <span className="lux-title block text-[1.15rem]" style={{ color: 'var(--c-burgundy)' }}>{band.label}</span>
                  <span className="text-soft mt-0.5 block truncate text-[0.8rem]">{BAND_SUBTITLES[band.label]}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[0.66rem] font-medium tabular-nums" style={{ color: 'var(--c-burgundy)' }}>
                  {counts[band.label] ? counts[band.label] : ''}
                  <ArrowRight size={15} strokeWidth={1.6} aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <ul className="mt-10 hidden grid-cols-4 gap-4 md:grid lg:gap-6">
          {PRICE_BANDS.map((band, i) => (
            <li key={band.label}>
              <Reveal delay={i * 0.06} className="h-full">
                <Link
                  href={`/collections?price=${encodeURIComponent(band.label)}`}
                  className="group relative flex h-full min-h-56 flex-col overflow-hidden border border-[var(--line)] bg-[var(--c-product-card)] p-6 transition-colors duration-500 hover:border-[var(--c-burgundy)] hover:bg-[var(--c-burgundy)] lg:p-8"
                >
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5" style={{ background: 'linear-gradient(90deg, var(--c-gold-ink), transparent)' }} />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-6 -right-2 select-none text-[7.5rem] leading-none text-[var(--c-burgundy)] opacity-[0.07] transition-[color,opacity] duration-500 group-hover:text-[var(--c-champagne)] group-hover:opacity-[0.16]"
                    style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}
                  >
                    ₹
                  </span>

                  <span className="text-[0.62rem] font-medium uppercase tracking-[0.42em] tabular-nums text-[var(--c-gold-ink)] transition-colors duration-500 group-hover:text-[var(--c-champagne)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="mt-4 block text-[1.6rem] leading-tight text-[var(--c-burgundy)] transition-colors duration-500 group-hover:text-[#F7ECD9]"
                    style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}
                  >
                    {band.label}
                  </span>
                  <span className="mt-2 block text-[0.85rem] leading-relaxed text-[var(--c-text-soft)] transition-colors duration-500 group-hover:text-[#E9D9BC]">
                    {BAND_SUBTITLES[band.label]}
                  </span>
                  <span className="mt-auto flex items-center justify-between pt-6 text-[0.66rem] font-medium uppercase tracking-[0.18em] text-[var(--c-burgundy)] transition-colors duration-500 group-hover:text-[#F7ECD9]">
                    {countText(band.label)}
                    <ArrowRight size={15} strokeWidth={1.6} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
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
