// Reuses ProductCard so pricing, images and the "on enquiry" fallback stay in one place.

import Link from 'next/link';

import ProductCard from '@/components/catalogue/ProductCard';
import { getProducts } from '@/lib/catalogue';
import { INDICATIVE_PRICE_DISCLAIMER } from '@/lib/pricing';

export default async function FeaturedPieces() {
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  try {
    products = await getProducts({ featuredOnly: true, limit: 4 });
  } catch {
    // The homepage should not fail because one section could not load.
  }

  if (products.length === 0) return null;

  return (
    <section className="surface-page section">
      <div className="container-page">

        <header className="mb-10 text-center">
          <span className="eyebrow mb-3">Handpicked</span>
          <h2 className="heading-lg text-body">Signature Pieces</h2>
          <p className="text-soft mx-auto mt-4 max-w-md" style={{ fontSize: '0.9rem', lineHeight: 1.8 }}>
            A few of the pieces our goldsmiths are proudest of.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/collections"
            className="text-body inline-block no-underline transition-colors duration-300 hover:text-[var(--c-accent)]"
            style={{
              fontSize: '0.78rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              borderBottom: '1px solid currentColor',
              paddingBottom: 3,
            }}
          >
            View All Collections
          </Link>
          <p className="text-soft mt-6" style={{ fontSize: '0.72rem' }}>
            {INDICATIVE_PRICE_DISCLAIMER}
          </p>
        </div>

      </div>
    </section>
  );
}
