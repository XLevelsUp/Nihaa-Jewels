'use client';

// Two revenue lines that had pages but no route in from the homepage.

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const PANELS = [
  {
    eyebrow: 'Made For You',
    title: 'Bespoke Design',
    body: 'Bring us a sketch, an heirloom, or just an idea. Our goldsmiths will draw it, quote it and make it in our own workshop.',
    cta: 'Commission a Piece',
    href: '/custom-design',
    image: '/images/hero-frame-2-craft.webp',
    block: 'block-sage',
  },
  {
    eyebrow: 'For Someone Else',
    title: 'Gifting',
    body: 'Birthdays, anniversaries, the first gold of a new marriage. We will help you choose, and wrap it properly.',
    cta: 'Explore Gifting',
    href: '/gifting',
    image: '/images/hero-frame-3-flatlay.webp',
    block: 'block-blush',
  },
];

export default function ServicesPanels() {
  return (
    <section className="surface-page section-tight">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {PANELS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={p.href} className="group block h-full no-underline">
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 10' }}>
                  <Image
                    src={p.image}
                    alt={`${p.title} — Nihaa Jewels Coimbatore`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                <div className={`${p.block} p-7 md:p-9`}>
                  <span className="eyebrow mb-3">{p.eyebrow}</span>
                  <h3
                    className="font-[family-name:var(--font-heading)]"
                    style={{ fontSize: '1.5rem', lineHeight: 1.2 }}
                  >
                    {p.title}
                  </h3>
                  <p className="text-soft mt-3.5" style={{ fontSize: '0.88rem', lineHeight: 1.8 }}>
                    {p.body}
                  </p>
                  <span
                    className="mt-6 inline-flex items-center gap-2"
                    style={{
                      fontSize: '0.72rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      borderBottom: '1px solid currentColor',
                      paddingBottom: 3,
                    }}
                  >
                    {p.cta}
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
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
