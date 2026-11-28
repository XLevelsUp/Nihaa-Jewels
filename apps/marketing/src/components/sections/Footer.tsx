// Four-column burgundy footer (brand and socials, links, visit us, legal) over a thin copyright bar; every store detail reads from constants/store.

import Link from 'next/link';
import Image from 'next/image';
import { Clock, Heart, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

import SocialIcons from '@/components/ui/SocialIcons';
import OpenNow from '@/components/ui/OpenNow';
import { SHOWROOMS, STORE, socialLinksWithInstagram } from '@/constants/store';
import { JEWELLERY_TYPES, TYPE_ORDER } from '@/constants/jewelleryTypes';

const EXPLORE = [
  ...TYPE_ORDER.map((t) => ({ label: JEWELLERY_TYPES[t].title, href: JEWELLERY_TYPES[t].path })),
  { label: 'All Jewellery', href: '/collections' },
  { label: 'Our Story', href: '/about' },
  { label: 'Bespoke Commissions', href: '/custom-design' },
  { label: 'Gifting', href: '/gifting' },
  { label: 'Care Guide', href: '/care-guide' },
];

const LEGAL = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
  { label: 'Contact Us', href: '/contact' },
];

const heading = 'text-[1rem] font-semibold tracking-[0.02em]';
const linkClass = 'inline-flex min-h-9 items-center text-[0.9rem] opacity-85 transition-opacity duration-300 hover:opacity-100';
const soft = { color: 'var(--c-on-chrome-soft)' };

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-[0.88rem] leading-[1.6]">
      <span className="mt-[3px] shrink-0 opacity-80" aria-hidden="true">{icon}</span>
      <div>{children}</div>
    </li>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const showroom = SHOWROOMS[0];

  return (
    <footer className="chrome-block">
      <div className="container-wide grid grid-cols-1 gap-x-8 gap-y-12 pt-12 pb-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1.3fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3" aria-label={`${STORE.name} home`}>
            <Image src="/images/brand/logo-champagne.png" alt="" width={44} height={44} />
            <span className="text-[1.05rem] font-semibold uppercase tracking-[0.28em]" style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}>
              {STORE.name}
            </span>
          </Link>
          <p className="mt-4 max-w-[22rem] text-[0.88rem] leading-[1.7]" style={soft}>
            Gold, diamond and silver jewellery at Town Hall, Coimbatore. BIS hallmarked, weighed in front of you and priced at
            the day’s gold rate.
          </p>
          <nav aria-label="Sakthi Chains on social media" className="mt-6">
            <SocialIcons links={socialLinksWithInstagram()} />
          </nav>
        </div>

        <nav aria-label="Explore">
          <p className={heading}>Explore</p>
          <ul className="mt-4 space-y-0.5">
            {EXPLORE.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className={heading}>Visit Us</p>
          <ul className="mt-4 space-y-4">
            <Row icon={<MapPin size={16} />}>
              <address className="not-italic">{showroom.address}</address>
              <a href={showroom.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block opacity-85 hover:opacity-100"
                style={{ textDecoration: 'underline', textUnderlineOffset: '4px', textDecorationThickness: '1px' }}
              >
                Open in Google Maps
              </a>
            </Row>
            <Row icon={<Clock size={16} />}>
              <OpenNow />
              <p style={soft}>{STORE.hours.replace('Mon–Sat:', 'Monday to Saturday,')}</p>
            </Row>
            <Row icon={<Phone size={16} />}>
              <a href={STORE.phoneHref} className="tabular-nums hover:underline">{STORE.phone}</a>
            </Row>
            <Row icon={<MessageCircle size={16} />}>
              <a href={`https://wa.me/${STORE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                WhatsApp us
              </a>
            </Row>
            {STORE.email && (
              <Row icon={<Mail size={16} />}>
                <a href={`mailto:${STORE.email}`} className="hover:underline">{STORE.email}</a>
              </Row>
            )}
          </ul>
        </div>

        <div>
          <nav aria-label="Legal">
            <p className={heading}>Legal</p>
            <ul className="mt-4 space-y-0.5">
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="mt-6 inline-block rounded-full px-4 py-3 text-[0.8rem]" style={{ border: '1px solid currentColor', opacity: 0.85 }}>
            BIS hallmarked gold, priced daily
          </p>
        </div>
      </div>

      <div style={{ borderTop: '1px solid color-mix(in srgb, currentColor 22%, transparent)' }}>
        <div className="container-wide flex flex-col items-center justify-between gap-3 py-6 text-[0.8rem] sm:flex-row" style={soft}>
          <p>&copy; {year} {STORE.name}. All rights reserved.</p>
          <p className="inline-flex items-center gap-1.5">
            Built with
            <Heart size={13} fill="#F0507A" color="#F0507A" className="motion-safe:animate-[heartbeat_1.6s_ease-in-out_infinite]" aria-label="love" role="img" />
            by{' '}
            <a href="https://xlevelsup.com" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-100">
              XLevelsUp
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
