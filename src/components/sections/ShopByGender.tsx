'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

const SEGMENTS = [
  {
    id: 'women',
    label: 'Women',
    description: 'Timeless elegance for the modern matriarch. From bridal heirlooms to everyday grace.',
    href: '/collections/women',
    image: '/images/women1.webp',
    image_alt: 'Sophisticated gold and diamond jewellery for women',
  },
  { 
    id: 'men',
    label: 'Men',
    description: 'Bold craftsmanship for the discerning gentleman. Refined rings, chains, and kadas.',
    href: '/collections/men',
    image: '/images/menimage.webp',
    image_alt: 'Handcrafted masculine gold jewellery',
  },
  {
    id: 'kids',
    label: 'Kids',
    description: 'Delicate first steps into a lifetime of legacy. Safe, charming, and BIS hallmarked.',
    href: '/collections/kids',
    image: '/images/kidimage.webp', 
    image_alt: 'Lightweight and safe gold jewellery for children',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: 'tween',
      ease: 'easeOut',
      duration: 0.8
    } 
  },
};

export default function ShopByGender() {
  return (
    <section className="py-24 bg-[#121212] flex flex-col items-center">
      {/* Title Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 px-6"
      >
        <h2 className="text-[#FAF9F6] text-4xl md:text-5xl font-playfair tracking-wide mb-5">
          Curated For You
        </h2>
        <div className="w-12 h-px bg-linear-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6 opacity-60" />
        <p className="text-[#d6d3ce]/80 font-inter font-light text-[0.95rem] md:text-base max-w-md mx-auto italic">
          Discover collections tailored to every story.
        </p>
      </motion.div>

      {/* Navigation Grid */}
      <nav aria-label="Shop by Persona" className="w-full max-w-[1100px] px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {SEGMENTS.map((segment) => (
            <motion.div key={segment.id} variants={cardVariants}>
              <Link 
                href={segment.href} 
                aria-label={`Shop ${segment.label} collection`}
                className="group block relative w-full h-full"
              >
                {/* Image Container */}
                <div className="relative aspect-3/4 overflow-hidden rounded-sm bg-[#1a1a1a] shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-700 ease-out group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] group-hover:-translate-y-2">
                  <Image
                    src={segment.image}
                    alt={segment.image_alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover grayscale transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:grayscale-0 group-hover:scale-105"
                  />
                  
                  {/* Subtle inner shadow/gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-[#121212]/90 via-[#121212]/20 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-60" />
                  
                  {/* Content positioned over image */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end text-center z-10 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:-translate-y-1">
                    <h3 className="font-playfair text-[#D4AF37] text-[1.8rem] mb-3 leading-tight drop-shadow-md transition-all duration-500 group-hover:scale-105">
                      {segment.label}
                    </h3>
                    <p 
                      className="font-inter text-[#FAF9F6]/90 text-[0.9rem] font-light leading-relaxed opacity-0 translate-y-4 transition-all duration-500 ease-out delay-100 group-hover:opacity-100 group-hover:translate-y-0"
                    >
                      {segment.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </nav>
    </section>
  );
}
