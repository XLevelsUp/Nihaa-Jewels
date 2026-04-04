'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gem, Globe, Phone, MapPin, Mail, ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';
import { FOOTER_LINKS, SOCIAL_LINKS } from '@/constants';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="bg-[#0a0a0a] border-t border-[#D4AF37]/10 pt-24 pb-8 px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">

        {/* ─── Trust Badges (Premium Addition) ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-16 mb-16 border-b border-[#D4AF37]/5">
          {[
            { icon: <Award size={24} />, title: 'BIS Hallmarked', desc: '100% Purity Guaranteed' },
            { icon: <ShieldCheck size={24} />, title: 'IGI Certified', desc: 'Authentic Diamonds' },
            { icon: <RotateCcw size={24} />, title: 'Lifetime Exchange', desc: 'Buyback & Exchange' },
            { icon: <Truck size={24} />, title: 'Insured Shipping', desc: 'Complimentary & Secure' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-2 group">
              <div className="text-[#D4AF37]/60 group-hover:text-[#D4AF37] transition-colors duration-500">
                {item.icon}
              </div>
              <h5 className="text-[#FAF9F6] text-[0.65rem] uppercase tracking-[0.2em] font-bold">
                {item.title}
              </h5>
              <p className="text-[#d6d3ce]/40 text-[0.55rem] uppercase tracking-widest font-light">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ─── Main Footer Content ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">

          {/* Brand & Story */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <motion.div whileHover={{ rotate: 12 }} className="text-[#D4AF37]">
                <Gem size={22} strokeWidth={1.5} />
              </motion.div>
              <div className="leading-tight">
                <span className="text-[#D4AF37] text-2xl font-bold font-playfair tracking-tight gold-glow">
                  Nihaa
                </span>
                <span className="block text-[#FAF9F6]/40 text-[0.45rem] tracking-[0.5em] uppercase font-medium">
                  Jewels
                </span>
              </div>
            </Link>
            <p className="text-[#d6d3ce]/60 text-xs font-light leading-[1.8] max-w-sm">
              Crafting heirlooms for four generations. Our pieces blend the sacred traditions of Coimbatore with modern silhouettes, ensuring every jewel tells a story of elegance and devotion.
            </p>
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, color: '#D4AF37' }}
                  className="w-9 h-9 border border-white/5 rounded-full flex items-center justify-center text-[#d6d3ce]/30 hover:border-[#D4AF37]/30 transition-all duration-500"
                >
                  <Globe size={16} strokeWidth={1.5} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Dynamic Links columns */}
          {FOOTER_LINKS.map((column) => (
            <div key={column.heading}>
              <h4 className="text-[#D4AF37] text-[0.65rem] uppercase tracking-[0.3em] font-bold mb-8">
                {column.heading}
              </h4>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[#d6d3ce]/40 text-xs font-light hover:text-[#FAF9F6] transition-all duration-300 tracking-wider flex items-center group"
                    >
                      <span className="w-0 group-hover:w-3 h-px bg-[#D4AF37] mr-0 transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:mr-2" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact & Newsletter */}
          <div className="space-y-8">
            <div>
              <h4 className="text-[#D4AF37] text-[0.65rem] uppercase tracking-[0.3em] font-bold mb-8">
                The Atelier
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={14} className="text-[#D4AF37]/60 mt-1 shrink-0" />
                  <p className="text-[#d6d3ce]/50 text-xs font-light leading-relaxed">
                    42, Jewellers Street, RS Puram,<br />Coimbatore, Tamil Nadu 641002
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={14} className="text-[#D4AF37]/60 shrink-0" />
                  <p className="text-[#d6d3ce]/50 text-xs font-light">+91 422 280 0000</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={14} className="text-[#D4AF37]/60 shrink-0" />
                  <p className="text-[#d6d3ce]/50 text-xs font-light">concierge@nihaajewels.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Bottom Copyright Bar ─── */}
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 order-2 md:order-1">
            <p className="text-[#d6d3ce]/20 text-[0.55rem] uppercase tracking-[0.25em] font-medium">
              © {year} Nihaa Jewels. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {['Privacy', 'Terms', 'Gifts'].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-[#d6d3ce]/20 text-[0.55rem] uppercase tracking-[0.2em] font-medium hover:text-[#D4AF37] transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div className="order-1 md:order-2">
            <p className="text-[#D4AF37] text-[0.6rem] uppercase tracking-[0.3em] font-bold flex items-center gap-2">
              <span className="opacity-60 font-light italic">Built with</span>
              <span className="text-[#FF3B30] text-sm leading-none animate-pulse">❤️</span>
              <span className="opacity-60 font-light italic">by</span>
              <a
                href="https://xlevelsup.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#D4AF37] transition-all duration-500 underline underline-offset-4 decoration-white/10 hover:decoration-[#D4AF37]/50"
              >
                XLevelsUp
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
