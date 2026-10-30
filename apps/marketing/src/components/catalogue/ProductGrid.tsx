// GRT-sized tiles: two columns on phones, three on tablets, four on desktop and five on very wide screens.

import ProductCard from './ProductCard';
import type { PricedProduct } from '@/lib/catalogue';

interface ProductGridProps {
  products: PricedProduct[];
  emptyMessage?: string;
  withSidebar?: boolean;
}

export default function ProductGrid({
  products,
  emptyMessage = 'This collection is being curated and will be unveiled shortly.',
  withSidebar = false,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="grid min-h-[280px] place-items-center px-6 py-16 text-center" style={{ border: '1px solid var(--c-border)' }}>
        <p className="lux-title max-w-[40ch] text-[1.2rem] italic">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:gap-x-5 md:gap-y-10 lg:grid-cols-4 ${withSidebar ? '2xl:grid-cols-5' : 'xl:grid-cols-5'}`}>
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={i < 4}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
        />
      ))}
    </div>
  );
}
