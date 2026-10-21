// Admin-featured pieces as an editorial row: image, karat and weight, serif name, indicative price; each opens its page, where the only action is an appointment.

import Link from 'next/link';

import ImageSlot from '@/components/ui/ImageSlot';
import Reveal from '@/components/ui/Reveal';
import { getProducts, type PricedProduct } from '@/lib/catalogue';
import { productImageUrl } from '@/lib/supabase';
import PriceTag from '@/components/catalogue/PriceTag';
import { INDICATIVE_PRICE_DISCLAIMER } from '@/lib/pricing';

export default async function SignatureCreations() {
  let products: PricedProduct[] = [];
  try {
    products = await getProducts({ featuredOnly: true, limit: 4 });
  } catch {
    return null;
  }
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="signature-heading" className="surface-page pt-24 md:pt-36">
      <div className="container-wide">
        <Reveal className="mb-12 flex flex-col items-start gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="lux-eyebrow">Signature Creations</p>
            <h2 id="signature-heading" className="lux-display mt-4" style={{ fontSize: 'clamp(2.1rem, 4.4vw, 3.6rem)' }}>
              The pieces <em>we are known by</em>
            </h2>
          </div>
          <Link href="/collections" className="lux-link">
            View the catalogue
          </Link>
        </Reveal>

        <ul className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
          {products.map((p, i) => {
            const image = p.images[0];
            return (
              <li key={p.id}>
                <Reveal delay={i * 0.08}>
                  <Link href={`/collections/${p.category?.slug ?? 'all'}/${p.slug}`} className="group block">
                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 5' }}>
                      <ImageSlot
                        slot={{
                          file: '',
                          label: p.name,
                          alt: image?.alt_text || p.name,
                          ratio: '4:5',
                          size: '1600 × 2000',
                          brief: '',
                          hint: 'Upload in Admin, Products',
                          src: image ? productImageUrl(image.storage_path) : null,
                        }}
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
                      />
                    </div>
                    <p className="lux-eyebrow mt-5 tabular-nums" style={{ letterSpacing: '0.28em' }}>
                      {p.karat} gold &middot; {p.net_weight_g} g
                    </p>
                    <h3 className="lux-title mt-2" style={{ fontSize: 'clamp(1.15rem, 1.6vw, 1.4rem)' }}>
                      {p.name}
                    </h3>
                    <div className="mt-2">
                      {p.price ? <PriceTag price={p.price} /> : <p className="text-soft text-[0.82rem]">Price on request</p>}
                    </div>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <p className="text-soft mt-12 text-[0.72rem]">{INDICATIVE_PRICE_DISCLAIMER}</p>
      </div>
    </section>
  );
}
