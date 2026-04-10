'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const CATEGORIES = [
  { id: '1', label: 'Rings', href: '/collections/rings', image: '/images/rings.webp' },
  { id: '2', label: 'Bracelets', href: '/collections/bracelets', image: '/images/bracelet2.webp' },
  { id: '3', label: 'Chains', href: '/collections/chains', image: '/images/chain1.webp' },
  { id: '4', label: 'Pendants', href: '/collections/pendants', image: '/images/pendant1.webp' },
  { id: '5', label: 'Mangalsutras', href: '/collections/mangalsutras', image: '/images/mangalsutra1.webp' },
  { id: '6', label: 'Bangles', href: '/collections/bangles', image: '/images/bangles1.webp' },
  { id: '7', label: 'Earrings', href: '/collections/earrings', image: '/images/earring2.webp' },
  { id: '8', label: 'Explore All', subtext: '10+ More Collections', href: '/collections', type: 'cta_card' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: 'spring', 
      stiffness: 100, 
      damping: 20 
    } 
  },
};

export default function CategoryDiscoveryGrid() {
  return (
    <section className="py-20 bg-[#121212] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-[#FAF9F6] text-4xl md:text-5xl lg:text-6xl font-playfair tracking-wide flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
            <span>Find Your</span>
            <em className="bg-linear-to-r from-[#D4AF37] via-[#FBF5B7] to-[#D4AF37] bg-size-[200%_auto] bg-clip-text text-transparent italic animate-shimmer">
              Match
            </em>
          </h2>
          <div className="w-16 h-px bg-linear-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6 opacity-60" />
        </motion.div>

        {/* Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {CATEGORIES.map((category) => (
            <motion.figure 
              key={category.id} 
              variants={itemVariants}
              className="group relative"
            >
              {category.type === 'cta_card' ? (
                <Link href={category.href} className="block h-full">
                  <div className="aspect-4/5 bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-sm flex flex-col items-center justify-center p-6 text-center transition-all duration-500 hover:bg-[#222] hover:border-[#D4AF37]/50 group-hover:-translate-y-1">
                    <p className="font-montserrat text-[#D4AF37] uppercase tracking-[0.15em] text-sm md:text-[0.95rem] font-medium mb-3">
                      {category.label}
                    </p>
                    {category.subtext && (
                      <p className="text-[#d6d3ce]/60 font-inter font-light text-xs md:text-sm mb-6">
                        {category.subtext}
                      </p>
                    )}
                    <div className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 group-hover:bg-[#D4AF37]/10 transition-all duration-300">
                      <ArrowUpRight size={18} strokeWidth={1} />
                    </div>
                  </div>
                </Link>
              ) : (
                <Link href={category.href} className="block">
                  <div className="relative aspect-4/5 overflow-hidden rounded-sm bg-[#1a1a1a]">
                    <Image
                      src={category.image!}
                      alt={`Luxury ${category.label} Coimbatore - Nihaa Jewels`}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  
                  <figcaption className="mt-4 relative">
                    <h3 className="font-montserrat text-[#FAF9F6] text-center uppercase tracking-[0.15em] text-[0.85rem] md:text-sm transition-colors duration-300 group-hover:text-[#D4AF37]">
                      {category.label}
                    </h3>
                    {/* Gold shimmer border-bottom on hover */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-px bg-linear-to-r from-transparent via-[#D4AF37] to-transparent transition-all duration-500 ease-out flex opacity-0 group-hover:w-16 group-hover:opacity-100 shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                  </figcaption>
                </Link>
              )}
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
