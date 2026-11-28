'use client';

// Client tabs over featured products grouped by Gold, Silver and Diamond, hiding any empty tab.

import { useState } from 'react';
import Link from 'next/link';

import ImageSlot from '@/components/ui/ImageSlot';
import Reveal from '@/components/ui/Reveal';
import PriceTag from '@/components/catalogue/PriceTag';
import type { PricedProduct } from '@/lib/catalogue';
import { productImageUrl } from '@/lib/supabase';
import { INDICATIVE_PRICE_DISCLAIMER } from '@/lib/pricing';
import { JEWELLERY_TYPES, TYPE_ORDER, materialLabel, type JewelleryType } from '@/constants/jewelleryTypes';

interface SignatureCreationsClientProps {
  grouped: Record<JewelleryType, PricedProduct[]>;
}

export default function SignatureCreationsClient({ grouped }: SignatureCreationsClientProps) {
  const availableTabs = TYPE_ORDER.filter((t) => grouped[t].length > 0);
  const [activeTab, setActiveTab] = useState<JewelleryType>(
    availableTabs.includes('gold') ? 'gold' : availableTabs[0],
  );

  if (availableTabs.length === 0) return null;

  const current = grouped[activeTab] ?? [];

  return (
    <section aria-labelledby="signature-heading" className="surface-page pt-12 md:pt-20">
      <div className="container-wide">
        <Reveal className="mb-6 flex items-end justify-between gap-4 md:mb-10">
          <div>
            <p className="lux-eyebrow">Signature Creations</p>
            <h2 id="signature-heading" className="lux-display mt-2 md:mt-3" style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.6rem)' }}>
              The pieces <em>we are known by</em>
            </h2>
          </div>
          <div className="hidden md:block">
            <Link href="/collections" className="lux-link">
              View the catalogue
            </Link>
          </div>
        </Reveal>

        {availableTabs.length > 1 && (
          <div role="tablist" aria-label="Filter signature creations by jewellery type" className="mb-6 flex flex-wrap gap-2 md:mb-8">
            {availableTabs.map((t) => {
              const selected = activeTab === t;
              return (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveTab(t)}
                  className="min-h-11 px-5 text-[0.7rem] font-medium uppercase tracking-[0.18em] transition-colors"
                  style={{
                    background: selected ? 'var(--c-burgundy)' : 'var(--c-product-card)',
                    color: selected ? '#F7ECD9' : 'var(--c-text)',
                    border: '1px solid color-mix(in srgb, var(--c-burgundy) 24%, transparent)',
                  }}
                >
                  {JEWELLERY_TYPES[t].label}
                </button>
              );
            })}
          </div>
        )}

        <ul className="grid grid-cols-2 gap-x-3 gap-y-6 md:gap-x-6 md:gap-y-8 lg:grid-cols-4">
          {current.slice(0, 4).map((p, i) => {
            const image = p.images[0];
            return (
              <li key={p.id}>
                <Reveal delay={i * 0.08}>
                  <Link href={`/collections/${p.category?.slug ?? 'all'}/${p.slug}`} className="group block">
                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1 / 1', background: 'var(--c-icing)' }}>
                      <ImageSlot
                        slot={{
                          file: '',
                          label: p.name,
                          alt: image?.alt_text || p.name,
                          ratio: '1:1',
                          size: '1200 × 1200',
                          brief: '',
                          hint: 'Upload in Admin, Products',
                          src: image ? productImageUrl(image.storage_path) : null,
                        }}
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
                      />
                    </div>
                    <p className="lux-eyebrow mt-3 tabular-nums" style={{ letterSpacing: '0.2em' }}>
                      {materialLabel(p)} &middot; {p.net_weight_g} g
                    </p>
                    <h3 className="lux-title mt-1 line-clamp-2" style={{ fontSize: 'clamp(1rem, 1.3vw, 1.2rem)' }}>
                      {p.name}
                    </h3>
                    <div className="mt-1">
                      {p.price ? <PriceTag price={p.price} /> : <p className="text-soft text-[0.875rem]">Price on request</p>}
                    </div>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 md:mt-8">
          <p className="text-soft text-[0.75rem]">{INDICATIVE_PRICE_DISCLAIMER}</p>
          <div className="md:hidden">
            <Link href="/collections" className="lux-link">
              View the catalogue
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
