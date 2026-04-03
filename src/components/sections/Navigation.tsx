'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Gem, Search, Phone, ChevronDown, ArrowRight, Heart } from 'lucide-react';
import { NAV_LINKS, COLLECTIONS_SUBMENU } from '@/constants';

/* ─── Sub-Components ───────────────────────────── */



const Logo = () => (
  <Link href="/" className="flex items-center gap-3 group shrink-0" aria-label="Nihaa Jewels Home">
    <div className="relative">
      <motion.div whileHover={{ rotate: 15 }} className="text-[#D4AF37] filter drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
        <Gem size={24} strokeWidth={1.5} />
      </motion.div>
    </div>
    <div className="flex flex-col leading-tight">
      <span className="text-[#D4AF37] text-2xl font-bold tracking-tight font-playfair gold-glow">
        Nihaa
      </span>
      <span className="text-[#FAF9F6]/40 text-[0.45rem] tracking-[0.5em] uppercase font-medium -mt-1 ml-0.5">
        Jewels
      </span>
    </div>
  </Link>
);

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState(false);

  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
    document.body.style.overflow = '';
  }, [pathname]);

  const activeLink = pathname;

  return (
    <>


      <motion.header
        id="navigation-header"
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled
            ? 'nav-glass py-2 shadow-2xl'
            : 'bg-[#121212] py-5 border-b border-white/[0.03]'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <Logo />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10 lg:gap-14">
            {NAV_LINKS.map(link => {
              const isActive = activeLink === link.href || (link.label === 'Collections' && activeLink.startsWith('/collections'));

              if (link.label === 'Collections') {
                return (
                  <div
                    key="desktop-collections"
                    className="relative group"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button
                      className={`flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] font-medium transition-all duration-300 ${isActive ? 'text-[#D4AF37]' : 'text-[#d6d3ce] group-hover:text-[#D4AF37]'
                        }`}
                    >
                      Collections
                      <ChevronDown size={12} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full -left-40 mt-4 w-[650px] bg-[#1a1a1a] border border-[#D4AF37]/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] grid grid-cols-[1.2fr_1fr] overflow-hidden"
                        >
                          <div className="p-8 border-r border-[#D4AF37]/10">
                            <p className="text-[0.6rem] uppercase tracking-[0.3em] text-[#D4AF37] font-bold mb-6">Categories</p>
                            <div className="space-y-4">
                              {COLLECTIONS_SUBMENU.map(item => (
                                <Link
                                  key={item.label}
                                  href={item.href}
                                  className="flex flex-col group/item transition-all"
                                >
                                  <span className="text-[0.75rem] text-[#FAF9F6] group-hover/item:text-[#D4AF37] group-hover/item:translate-x-1 transition-all uppercase tracking-widest font-medium">
                                    {item.label}
                                  </span>
                                  <span className="text-[0.55rem] text-[#d6d3ce]/30 font-light mt-1">
                                    {item.desc}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* Visual Featured Area */}
                          <div className="relative group/feat overflow-hidden h-full min-h-[350px]">
                            <Image
                              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80"
                              alt="Featured Collection"
                              fill
                              className="object-cover transition-transform duration-1000 group-hover/feat:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-black/20 to-transparent p-8 flex flex-col justify-end">
                              <p className="text-[#D4AF37] text-[0.55rem] uppercase tracking-[0.3em] font-bold mb-2">Editor&apos;s Pick</p>
                              <h4 className="text-2xl font-playfair text-white mb-3 leading-tight">The Heritage <br /> Gold Series</h4>
                              <Link href="/collections/temple" className="flex items-center gap-2 text-white text-[0.62rem] uppercase tracking-[0.2em] font-bold hover:text-[#D4AF37] transition-colors">
                                View Collection <ArrowRight size={12} />
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[0.7rem] uppercase tracking-[0.2em] font-medium transition-colors relative py-1 group ${isActive ? 'text-[#D4AF37]' : 'text-[#d6d3ce] hover:text-[#D4AF37]'
                    }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-[1px] bg-gradient-to-r from-[#D4AF37] to-transparent transition-all duration-500 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
              );
            })}
          </nav>

          {/* Icons & CTA */}
          <div className="flex items-center gap-5 sm:gap-7 shrink-0">
            <div className="hidden lg:flex items-center gap-4 text-[#d6d3ce]/40">
              <button className="hover:text-[#D4AF37] transition-colors" aria-label="Search">
                <Search size={19} strokeWidth={1.5} />
              </button>
              <button className="hover:text-[#D4AF37] transition-colors" aria-label="Wishlist">
                <Heart size={19} strokeWidth={1.5} />
              </button>
            </div>

            <Link
              href="/contact"
              className="relative bg-[#D4AF37] text-[#121212] px-6 py-2.5 text-[0.62rem] uppercase tracking-[0.25em] font-bold hover:bg-[#E8C84E] transition-all overflow-hidden group/cta"
            >
              <span className="relative z-10 transition-colors">Inquire</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/cta:translate-y-0 transition-transform duration-300" />
            </Link>

            <button
              className="md:hidden text-[#FAF9F6] p-2 -mr-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="fixed inset-0 z-[60] bg-[#121212] flex flex-col pt-32 px-8"
          >
            <nav className="flex flex-col gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={`mob-${link.label}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="text-4xl font-playfair text-[#FAF9F6] border-b border-white/5 pb-4 block"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-auto pb-12 flex flex-col gap-6"
            >
              <a href="tel:+914422800000" className="flex items-center gap-4 text-[#D4AF37]">
                <Phone size={20} />
                <span className="text-sm tracking-[0.2em] font-bold">+91 422 280 0000</span>
              </a>
              <div className="flex gap-8 text-[#d6d3ce]/40">
                <Search size={22} />
                <Heart size={22} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
