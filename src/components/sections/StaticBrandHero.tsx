'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function StaticBrandHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax setup
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Breathing & Parallax Effects
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen min-h-[600px] w-full overflow-hidden bg-[#050505]"
    >
      {/* Background Image with Y-axis Parallax & Scale */}
      <motion.div 
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        <Image
          src="https://images.unsplash.com/photo-1610492103103-6059630c90c7?q=80&w=1920"
          alt="Nihaa Jewels Coimbatore Goldsmiths Luxury Jewellery"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Layer 1: Dark Obsidian Overlay for Contrast */}
        <div className="absolute inset-0 bg-[#050505]/40" />
        
        {/* Layer 2: The "Gold Glow" Vignette per spec */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-[#D4AF37]/25 via-transparent to-[#050505]/90 mix-blend-overlay" />
        
        {/* Layer 3: Bottom fade to merge with following sections cleanly */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-[#050505] to-transparent" />
      </motion.div>

      {/* Absolute-positioned Text Layers */}
      <motion.div 
        style={{ opacity: textOpacity, y: textY }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Eyebrow: Montserrat, 0.5em letter-spacing */}
          <span className="block font-montserrat uppercase tracking-[0.5em] text-[#D4AF37] text-xs md:text-sm font-semibold mb-6">
            Est. 2026 | Coimbatore
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* H1: Playfair Display, 500 weight, 5vw size */}
          <h1 className="font-playfair font-medium text-5xl md:text-6xl lg:text-[5vw] leading-[1.1] pb-2 max-w-[90vw]">
            <span className="text-[#FAF9F6] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">Hand-Forged</span>{' '}
            <em className="text-[#D4AF37] drop-shadow-[0_4px_12px_rgba(212,175,55,0.4)] italic">Legacies</em>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-8"
        >
          {/* Heritage Story: Small, high-tracking text */}
          <p className="font-inter text-[#FAF9F6]/70 text-[0.8rem] md:text-[0.9rem] font-light tracking-widest uppercase max-w-2xl mx-auto leading-relaxed">
            Preserving the ancient art of the master goldsmith. <br className="hidden md:block" /> Every piece a dialogue between heritage and the modern connoisseur.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
