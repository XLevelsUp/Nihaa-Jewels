'use client';

import { useRef } from 'react';
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
        {/* Layer 1: Dark Obsidian Overlay for Contrast */}
        <div className="absolute inset-0 bg-[#050505]/40" />
        
        {/* Layer 2: The "Gold Glow" Vignette per spec */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-[#D4AF37]/25 via-transparent to-[#050505]/90 mix-blend-overlay" />
        
        {/* Layer 3: Bottom fade to merge with following sections cleanly */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-[#050505] to-transparent" />
      </motion.div>

      {/* Absolute-positioned Text Layers */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {/* Eyebrow: Montserrat, 0.4em letter-spacing */}
          <span className="block font-montserrat uppercase tracking-[0.4em] text-[#D4AF37]/90 text-xs md:text-sm font-semibold mb-6">
            Est. 2026 | Coimbatore
          </span>
        </motion.div>

        <div>
          {/* Static H1: Refined Inter font style, completely static with zero animation for instant loading & SEO */}
          <h1 className="font-inter font-light text-3xl md:text-4xl lg:text-[3vw] leading-[1.3] text-[#FAF9F6] pb-2 max-w-[95vw]">
            The Best <span className="text-[#D4AF37] font-medium">Jewellery Shop</span> in Coimbatore
            <span className="block text-[0.75rem] md:text-xs font-light tracking-[0.3em] uppercase text-[#FAF9F6]/50 mt-4 normal-case font-inter">
              Fine Jewellery & Bespoke Goldsmiths
            </span>
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.5, ease: "easeOut" }}
          className="mt-8"
        >
          {/* H2: Inter, contemporary luxury sentence-case tracking */}
          <h2 className="font-inter text-[#E5D5B8] text-sm md:text-base font-light tracking-[0.12em] max-w-3xl mx-auto leading-relaxed px-6">
            Handcrafted gold jewellery, diamond necklaces & bridal jewellery in Coimbatore — all BIS hallmarked.
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
