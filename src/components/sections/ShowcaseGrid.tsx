'use client';

import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import { SHOWCASE_ITEMS } from '@/constants';

export default function ShowcaseGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="collections" className="py-24 px-6 bg-[#121212]">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
          ref={ref}
        >
          <SectionLabel centered>Curated Collections</SectionLabel>
          <div className="divider-gold" />
          <h2
            className="font-playfair text-4xl md:text-5xl text-[#FAF9F6] mt-4 mb-4"
            style={{ fontFamily: 'var(--font-playfair-display), serif' }}
          >
            The Edit
          </h2>
          <p
            className="text-[#d6d3ce] text-sm font-light max-w-md mx-auto leading-relaxed"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Four categories. Infinite expressions. Each piece designed to outlast
            the moment it was made for.
          </p>
        </motion.div>

        {/* Asymmetrical grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[280px] lg:auto-rows-[320px]">
          {SHOWCASE_ITEMS.map((item, i) => (
            <ShowcaseCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ShowcaseCard({
  item,
  index,
}: {
  item: (typeof SHOWCASE_ITEMS)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  // Layout: first card is tall (spans 2 rows) on large screens
  const gridClass =
    index === 0
      ? 'col-span-1 row-span-2 lg:col-span-1 lg:row-span-2'
      : 'col-span-1 row-span-1';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: 'easeOut' }}
      className={`showcase-card group cursor-pointer ${gridClass}`}
      id={`showcase-${item.id}`}
      role="button"
      tabIndex={0}
      aria-label={`Explore ${item.label} collection`}
    >
      {/* Image */}
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={item.image}
          alt={`${item.label} — Nihaa Jewels`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.08]"
        />

        {/* Gradient overlay */}
        <div className="showcase-card-overlay" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
          <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
            <p
              className="text-[#D4AF37] text-[0.6rem] uppercase tracking-[0.2em] mb-1.5 font-medium"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {item.subtitle}
            </p>
            <h3
              className="font-playfair text-2xl md:text-3xl text-[#FAF9F6] mb-2"
              style={{ fontFamily: 'var(--font-playfair-display), serif' }}
            >
              {item.label}
            </h3>
            <p
              className="text-[#d6d3ce] text-xs leading-relaxed font-light opacity-0 group-hover:opacity-100 transition-opacity duration-400 max-w-[200px]"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {item.description}
            </p>
          </div>

          {/* Arrow */}
          <div className="absolute top-5 right-5 w-9 h-9 border border-[#D4AF37]/0 group-hover:border-[#D4AF37]/60 rounded-full flex items-center justify-center transition-all duration-400 group-hover:bg-[#D4AF37]/10">
            <ArrowUpRight
              size={14}
              strokeWidth={1.5}
              className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
