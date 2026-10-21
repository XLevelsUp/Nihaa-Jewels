// Burgundy colophon: centred mark, three short link columns plus the showroom, then legal; every store detail reads from STORE so the brand's contact info lives in one place.

import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';

import { STORE, STORE_ADDRESS_LINES } from '@/constants/store';

const COLUMNS = [
  {
    title: 'The House',
    links: [
      { label: 'Our Story', href: '/about' },
      { label: 'Our Showroom', href: '/stores' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Collections',
    links: [
      { label: 'The Catalogue', href: '/collections' },
      { label: 'Bespoke Commissions', href: '/custom-design' },
      { label: 'Gifting', href: '/gifting' },
    ],
  },
  {
    title: 'Client Care',
    links: [
      { label: 'Book an Appointment', href: '/contact' },
      { label: 'Caring for Gold', href: '/care-guide' },
      { label: 'WhatsApp', href: `https://wa.me/${STORE.whatsapp}` },
    ],
  },
];

const LEGAL = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="chrome-block pt-20 pb-10 md:pt-28">
      <div className="container-page">
        <div className="flex flex-col items-center text-center">
          <Image src="/images/brand/logo-champagne.png" alt="" width={56} height={56} />
          <p className="mt-5 text-[0.95rem] uppercase tracking-[0.36em]" style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}>
            {STORE.name}
          </p>
          <p className="lux-display mt-3 text-[1.25rem]" style={{ color: 'var(--c-on-chrome-soft)' }}>
            <em>Fine gold, made by hand</em>
          </p>
        </div>

        <hr className="lux-rule mt-14 md:mt-20" />

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="lux-eyebrow">{col.title}</p>
              <ul className="mt-5 space-y-1">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="inline-flex min-h-11 items-center text-[0.9rem] opacity-90 transition-opacity duration-300 hover:opacity-100"
                      {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <address className="col-span-2 not-italic md:col-span-1">
            <p className="lux-eyebrow">The Showroom</p>
            <p className="mt-5 text-[0.88rem] leading-[1.8]" style={{ color: 'var(--c-on-chrome-soft)' }}>
              {STORE_ADDRESS_LINES.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </p>
            <p className="mt-4 text-[0.88rem]" style={{ color: 'var(--c-on-chrome-soft)' }}>{STORE.hours}</p>
            <a href={STORE.phoneHref} className="mt-2 inline-flex min-h-11 items-center text-[0.9rem] tabular-nums">
              {STORE.phone}
            </a>
          </address>
        </div>

        <hr className="lux-rule mt-16" />

        <div className="mt-8 flex flex-col items-center gap-4 text-[0.75rem] md:flex-row md:justify-between" style={{ color: 'var(--c-on-chrome-soft)' }}>
          <p>&copy; {year} {STORE.name}. All rights reserved.</p>
          <ul className="flex gap-6">
            {LEGAL.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center transition-colors duration-300 hover:text-[var(--c-on-sage)]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="inline-flex items-center gap-1.5">
            Built with
            <Heart size={13} fill="#F0507A" color="#F0507A" className="motion-safe:animate-[heartbeat_1.6s_ease-in-out_infinite]" aria-label="love" role="img" />
            by{' '}
            <a href="https://xlevelsup.com" target="_blank" rel="noopener noreferrer" className="transition-colors duration-300 hover:text-[var(--c-on-sage)]">
              XLevelsUp
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
