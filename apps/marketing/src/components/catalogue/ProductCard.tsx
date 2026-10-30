// Image-led card in the fine-jeweller convention: a tall photograph on a soft ground, then purity and weight, the name, and the indicative price.

import Link from 'next/link';
import Image from 'next/image';

import PriceTag from './PriceTag';
import { productImageUrl } from '@/lib/supabase';
import type { PricedProduct } from '@/lib/catalogue';

interface ProductCardProps {
  product: PricedProduct;
  priority?: boolean;
  sizes?: string;
}

export default function ProductCard({ product, priority = false, sizes = '(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw' }: ProductCardProps) {
  const image = product.images[0];
  const href = `/collections/${product.category?.slug ?? 'all'}/${product.slug}`;

  return (
    <article>
      <Link href={href} className="group block">
        <div className="relative aspect-square overflow-hidden" style={{ background: 'var(--c-icing)' }}>
          {image ? (
            <Image
              src={productImageUrl(image.storage_path)}
              alt={image.alt_text || product.name}
              fill
              sizes={sizes}
              priority={priority}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <span className="text-soft absolute inset-0 grid place-items-center text-[0.62rem] uppercase tracking-[0.2em]">
              Image coming soon
            </span>
          )}
          {product.is_featured && (
            <span
              className="absolute left-3 top-3 px-2 py-1 text-[0.56rem] font-medium uppercase tracking-[0.22em]"
              style={{ background: 'rgba(253, 250, 245, 0.92)', color: 'var(--c-burgundy)' }}
            >
              Signature
            </span>
          )}
        </div>

        <div className="pt-3">
          <p className="text-soft text-[0.58rem] uppercase tracking-[0.18em] tabular-nums">
            {product.karat} gold &middot; {Number(product.net_weight_g)} g
          </p>
          <h3 className="lux-title mt-1 line-clamp-2 text-[0.98rem] leading-snug transition-colors duration-300 group-hover:text-[var(--c-burgundy)]">
            {product.name}
          </h3>
          {product.price ? (
            <div className="mt-1.5">
              <PriceTag price={product.price} />
            </div>
          ) : (
            <p className="text-soft mt-2 text-[0.85rem] italic">Price on enquiry</p>
          )}
        </div>
      </Link>
    </article>
  );
}
