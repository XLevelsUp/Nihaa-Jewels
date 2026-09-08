'use client';

import { motion, Variants } from 'framer-motion';
import { ShieldCheck, Gem, Eye, Hammer } from 'lucide-react';

const ASSURANCE_ITEMS = [
  {
    id: 1,
    icon: ShieldCheck,
    title: 'Purity Guarantee',
    description: 'Every piece is BIS Hallmarked, ensuring the exact karatage promised to you.',
  },
  {
    id: 2,
    icon: Gem,
    title: 'Certified Stones',
    description: 'Conflict-free diamonds with IGI & GIA certifications for lifetime value.',
  },
  {
    id: 3,
    icon: Eye,
    title: '100% Transparency',
    description: 'Detailed billing with zero hidden costs or undisclosed weightages.',
  },
  {
    id: 4,
    icon: Hammer,
    title: 'Quality Craftsmanship',
    description: 'Four generations of master goldsmiths ensuring heirloom-quality finish.',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // 0.2s stagger between items
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: 'tween',
      ease: 'easeOut',
      duration: 0.6
    } 
  },
};

export default function NihaaAssurance() {
  return (
    <section className="bg-[#121212] py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 flex flex-col items-center"
        >
          <h2 className="font-playfair text-[#FAF9F6] text-3xl md:text-4xl uppercase tracking-[0.3em] mb-4">
            The Nihaa Assurance
          </h2>
          <div className="w-16 h-px bg-linear-to-r from-transparent via-[#D4AF37] to-transparent opacity-80" />
        </motion.div>

        {/* Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-[72px] w-full"
        >
          {ASSURANCE_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div 
                key={item.id} 
                variants={itemVariants}
                className="flex flex-col items-center text-center group"
              >
                {/* Icon Container */}
                <div className="mb-6 flex items-center justify-center transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-110">
                  <Icon 
                    size={32} 
                    strokeWidth={1.2} 
                    color="#D4AF37" 
                    className="drop-shadow-[0_4px_10px_rgba(212,175,55,0.3)]"
                  />
                </div>
                
                {/* Text Content */}
                <h3 className="font-montserrat font-bold text-[#FAF9F6] text-[1.1rem] tracking-widest uppercase mb-4 transition-colors duration-300 group-hover:text-[#D4AF37]">
                  {item.title}
                </h3>
                <p className="font-inter font-light text-[#d6d3ce] text-[0.85rem] leading-relaxed max-w-[240px]">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
