'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import GoldButton from '@/components/ui/GoldButton';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden"
    >
      {/* Parallax background */}
      <motion.div className="absolute inset-0 z-0" style={{ y, scale }}>
        <Image
          src="https://images.unsplash.com/photo-1601121141418-5f2b59c6c2b5?w=1920&q=90&auto=format&fit=crop"
          alt="Luxury jewellery collection — Nihaa Jewels hero"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/80 via-[#121212]/50 to-[#121212]" />
      </motion.div>

      {/* Ambient gold glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#D4AF37]/8 blur-[120px] pointer-events-none z-0" />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="section-label mb-6"
        >
          Est. 1986 · Coimbatore, India
        </motion.p>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#FAF9F6] leading-tight mb-6"
          style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
        >
          Crafted for{' '}
          <em className="text-gradient-gold not-italic">
            Eternity
          </em>
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="divider-gold"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-[#d6d3ce] text-sm sm:text-base font-light tracking-wide max-w-lg mx-auto mb-10 leading-relaxed"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Four generations of master goldsmiths, crafting heirlooms that speak
          the language of timeless elegance.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <GoldButton href="#collections" size="lg" icon id="hero-cta-primary">
            Explore Collection
          </GoldButton>
          <GoldButton href="#heritage" size="lg" variant="outline" id="hero-cta-heritage">
            Our Heritage
          </GoldButton>
        </motion.div>
      </motion.div>

      {/* Floating jewelry accent image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 1.4, ease: 'easeOut' }}
        className="absolute bottom-24 right-10 md:right-20 z-10 hidden lg:block"
      >
        <div className="animate-float relative">
          <div className="w-36 h-36 rounded-full overflow-hidden border border-[#D4AF37]/40 shadow-[0_0_60px_rgba(212,175,55,0.25)]">
            <Image
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80&auto=format&fit=crop"
              alt="Featured ring"
              width={144}
              height={144}
              className="object-cover w-full h-full scale-110"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center">
            <span className="text-[#121212] text-[0.45rem] font-bold uppercase tracking-wide">New</span>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[#D4AF37]/60 text-[0.6rem] uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <ChevronDown size={16} strokeWidth={1.5} className="text-[#D4AF37]/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
