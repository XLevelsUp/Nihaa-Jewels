'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const AUDIENCES = [
  {
    label: 'For Women',
    href: '/collections?gender=women',
    src: '/images/audience-women.webp',
    alt: 'Woman in a green silk saree wearing temple gold jewellery',
  },
  {
    label: 'For Men',
    href: '/collections?gender=men',
    src: '/images/audience-men.webp',
    alt: 'Man in a cream kurta wearing a gold chain and bracelet',
  },
  {
    label: 'For Kids',
    href: '/collections?gender=kids',
    src: '/images/audience-kids.webp',
    alt: 'Young girl wearing a fine gold chain and bangles',
  },
];

export default function ShopByGender() {
  return (
    <section className="surface-alt section">
      <div className="container-page">

        <header className="mb-10 text-center">
          <span className="eyebrow mb-3">Shop By</span>
          <h2 className="heading-lg text-body">Who it&rsquo;s for</h2>
        </header>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {AUDIENCES.map((a, i) => (
            <motion.div
              key={a.href}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <Link href={a.href} className="card group block">
                <div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: '3 / 4', background: 'var(--c-icing)' }}
                >
                  <Image
                    src={a.src}
                    alt={a.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ objectPosition: '50% 20%' }}
                  />
                </div>
                <div className="flex items-center justify-between p-4">
                  <span className="text-body text-[0.95rem] font-medium">{a.label}</span>
                  <span className="text-accent text-[0.7rem] uppercase tracking-[0.15em]">
                    Browse
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
