'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gem, Globe, Phone, MapPin, Mail } from 'lucide-react';
import { FOOTER_LINKS, SOCIAL_LINKS } from '@/constants';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="bg-[#0a0a0a] border-t border-[#D4AF37]/12 pt-20 pb-8 px-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-6 group w-fit">
              <motion.div
                whileHover={{ rotate: 15 }}
                className="text-[#D4AF37]"
              >
                <Gem size={18} strokeWidth={1.5} />
              </motion.div>
              <div className="leading-none">
                <span
                  className="text-[#FAF9F6] text-xl font-semibold"
                  style={{ fontFamily: 'var(--font-playfair-display), serif' }}
                >
                  Nihaa
                </span>
                <span
                  className="block text-[#D4AF37] text-[0.55rem] tracking-[0.3em] uppercase font-light"
                  style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  Jewels
                </span>
              </div>
            </Link>

            <p
              className="text-[#d6d3ce]/70 text-xs font-light leading-relaxed mb-8 max-w-[220px]"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Four generations of master goldsmiths creating heirlooms that
              outlast the ages. Est. Coimbatore, 1986.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              <SocialIcon href="#" label="Social" id="footer-social">
                <Globe size={15} strokeWidth={1.5} />
              </SocialIcon>
              <SocialIcon href="#" label="WhatsApp" id="footer-whatsapp">
                <Phone size={15} strokeWidth={1.5} />
              </SocialIcon>
              <SocialIcon href="#" label="Email" id="footer-email">
                <Mail size={15} strokeWidth={1.5} />
              </SocialIcon>
            </div>
          </div>

          {/* Nav columns */}
          {FOOTER_LINKS.map((column) => (
            <div key={column.heading}>
              <h4
                className="text-[#D4AF37] text-[0.65rem] uppercase tracking-widest font-medium mb-6"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {column.heading}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[#d6d3ce]/60 text-xs font-light hover:text-[#D4AF37] transition-colors duration-300 tracking-wide"
                      style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div>
            <h4
              className="text-[#D4AF37] text-[0.65rem] uppercase tracking-widest font-medium mb-6"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Visit Us
            </h4>
            <div className="space-y-4">
              <ContactItem icon={<MapPin size={13} strokeWidth={1.5} />}>
                42, Jewellers Street,
                <br />
                Coimbatore, Tamil Nadu 641001
              </ContactItem>
              <ContactItem icon={<Phone size={13} strokeWidth={1.5} />}>
                +91 44 2800 0000
              </ContactItem>
              <ContactItem icon={<Mail size={13} strokeWidth={1.5} />}>
                hello@nihaajewels.com
              </ContactItem>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#D4AF37]/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-[#d6d3ce]/30 text-[0.6rem] uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            © {year} Nihaa Jewels. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms', 'Certifications'].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-[#d6d3ce]/30 text-[0.6rem] uppercase tracking-widest hover:text-[#D4AF37]/60 transition-colors"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
  id,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <motion.a
      href={href}
      id={id}
      aria-label={label}
      whileHover={{ y: -2, color: '#D4AF37' }}
      className="w-8 h-8 border border-[#D4AF37]/20 flex items-center justify-center text-[#d6d3ce]/50 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all duration-300"
    >
      {children}
    </motion.a>
  );
}

function ContactItem({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-[#D4AF37]/60 mt-0.5 shrink-0">{icon}</span>
      <span
        className="text-[#d6d3ce]/60 text-xs font-light leading-relaxed"
        style={{ fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {children}
      </span>
    </div>
  );
}
