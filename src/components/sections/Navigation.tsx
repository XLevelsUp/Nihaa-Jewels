'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Gem } from 'lucide-react';
import { NAV_LINKS } from '@/constants';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <motion.header
        id="navigation"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'nav-glass py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            id="nav-logo"
            className="flex items-center gap-2.5 group"
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ duration: 0.3 }}
              className="text-[#D4AF37]"
            >
              <Gem size={20} strokeWidth={1.5} />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span
                className="font-playfair text-[#FAF9F6] text-xl font-semibold tracking-wide group-hover:text-[#D4AF37] transition-colors duration-300"
                style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
              >
                Nihaa
              </span>
              <span
                className="text-[#D4AF37] text-[0.55rem] tracking-[0.3em] uppercase font-light"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                Jewels
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.label} href={link.href} label={link.label} />
            ))}
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="#collections"
              id="nav-cta"
              className="hidden md:inline-flex items-center gap-2 border border-[#D4AF37] text-[#D4AF37] px-5 py-2 text-[0.65rem] uppercase tracking-widest font-medium hover:bg-[#D4AF37] hover:text-[#121212] transition-all duration-300"
            >
              Explore
            </Link>
            <button
              id="nav-menu-toggle"
              className="md:hidden text-[#FAF9F6] hover:text-[#D4AF37] transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#121212] flex flex-col items-center justify-center gap-10"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={link.href}
                  className="font-playfair text-3xl text-[#FAF9F6] hover:text-[#D4AF37] transition-colors tracking-wide"
                  style={{ fontFamily: 'var(--font-playfair-display), serif' }}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4"
            >
              <Link
                href="#collections"
                className="btn-gold-shimmer px-10 py-4 text-xs uppercase tracking-widest"
                onClick={() => setMenuOpen(false)}
              >
                Explore Collection
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="relative text-[#d6d3ce] text-[0.75rem] uppercase tracking-widest font-light hover:text-[#D4AF37] transition-colors duration-300 group py-1"
      style={{ fontFamily: 'var(--font-inter), sans-serif' }}
    >
      {label}
      <span className="absolute bottom-0 left-0 w-0 h-px bg-[#D4AF37] group-hover:w-full transition-all duration-400" />
    </Link>
  );
}
