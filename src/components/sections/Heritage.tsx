'use client';

import { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import SectionLabel from '@/components/ui/SectionLabel';
import GoldButton from '@/components/ui/GoldButton';
import { HERITAGE_CONTENT, HERITAGE_STATS } from '@/constants';
import Image from 'next/image';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeOut' } },
};

export default function Heritage() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="heritage"
      className="py-32 px-6 bg-[#0e0e0e] relative overflow-hidden"
    >
      {/* Decorative background glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#D4AF37]/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — typography */}
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <motion.div variants={itemVariants}>
              <SectionLabel>{HERITAGE_CONTENT.eyebrow}</SectionLabel>
              <div className="w-10 h-px bg-[#D4AF37] mt-4 mb-8 opacity-60" />
            </motion.div>

            <motion.blockquote
              variants={itemVariants}
              className="font-playfair text-2xl md:text-3xl text-[#F7E7CE] italic leading-snug mb-8"
              style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
            >
              {HERITAGE_CONTENT.quote}
            </motion.blockquote>

            {HERITAGE_CONTENT.body.split('\n\n').map((paragraph, i) => (
              <motion.p
                key={i}
                variants={itemVariants}
                className="text-[#d6d3ce] text-sm font-light leading-[1.9] mb-4"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {paragraph}
              </motion.p>
            ))}

            <motion.p
              variants={itemVariants}
              className="font-playfair text-[#D4AF37] italic text-base mt-4 mb-8"
              style={{ fontFamily: 'var(--font-playfair-display), serif' }}
            >
              {HERITAGE_CONTENT.signature}
            </motion.p>

            <motion.div variants={itemVariants}>
              <GoldButton href="#collections" variant="outline" icon id="heritage-cta">
                View Collection
              </GoldButton>
            </motion.div>
          </motion.div>

          {/* Right — image + stats */}
          <div className="flex flex-col gap-8">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative h-[380px] overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=900&q=85&auto=format&fit=crop"
                alt="Nihaa Jewels artisan crafting gold jewellery"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e]/60 to-transparent" />
              {/* Gold corner accent */}
              <div className="absolute top-5 left-5 w-10 h-10 border-t border-l border-[#D4AF37]/60" />
              <div className="absolute bottom-5 right-5 w-10 h-10 border-b border-r border-[#D4AF37]/60" />
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-4 gap-0 border border-[#D4AF37]/15"
            >
              {HERITAGE_STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex flex-col items-center py-6 gap-1.5 ${
                    i < HERITAGE_STATS.length - 1
                      ? 'border-r border-[#D4AF37]/15'
                      : ''
                  }`}
                  id={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <span
                    className="font-playfair text-2xl text-[#D4AF37] font-semibold"
                    style={{ fontFamily: 'var(--font-playfair-display), serif' }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="text-[#d6d3ce] text-[0.6rem] uppercase tracking-wide text-center leading-tight"
                    style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
