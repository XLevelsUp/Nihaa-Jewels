// Highlighted burgundy panel with today's gold and silver rates and the diamond price-on-request note; rates sit in an even grid and the three type links in one equal row on every screen.

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import Reveal from '@/components/ui/Reveal';
import { getCurrentRates, getCurrentSilverRates } from '@/lib/catalogue';
import { formatRupees } from '@/lib/pricing';
import type { Karat, SilverPurity } from '@/types/database';

const GOLD_ORDER: Karat[] = ['22K', '18K', '24K'];
const SILVER_ORDER: SilverPurity[] = ['925', '999'];

const LINKS = [
  { label: 'Gold', href: '/gold-jewellery' },
  { label: 'Silver', href: '/silver-jewellery' },
  { label: 'Diamond', href: '/diamond-jewellery' },
];

export default async function TodaysRates() {
  let goldRates: Partial<Record<Karat, number>> = {};
  let silverRates: Partial<Record<SilverPurity, number>> = {};

  try {
    [goldRates, silverRates] = await Promise.all([getCurrentRates(), getCurrentSilverRates()]);
  } catch {
    return null;
  }

  const rates = [
    ...GOLD_ORDER.filter((k) => goldRates[k]).map((k) => ({ label: `${k} gold`, value: goldRates[k]! })),
    ...SILVER_ORDER.filter((p) => silverRates[p]).map((p) => ({ label: `${p} silver`, value: silverRates[p]! })),
  ];
  if (rates.length === 0) return null;

  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' });

  return (
    <section aria-labelledby="todays-rates-heading" className="surface-page pt-12 md:pt-20">
      <div className="container-wide">
        <Reveal className="chrome-block relative overflow-hidden px-4 py-6 sm:px-6 md:px-8 md:py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center lg:gap-8">
            <div className="lg:col-span-4">
              <p className="lux-eyebrow flex items-center gap-2">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping" style={{ background: 'var(--c-champagne)' }} />
                  <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: 'var(--c-champagne)' }} />
                </span>
                Today&apos;s rates · {today}
              </p>
              <h2 id="todays-rates-heading" className="lux-display mt-2 text-[1.5rem] md:text-[1.9rem]" style={{ color: 'var(--c-on-sage)' }}>
                Per gram, <em>at our showroom</em>
              </h2>
              <p className="mt-2 text-[0.82rem]" style={{ color: 'var(--c-on-chrome-soft)' }}>
                Diamond jewellery: price on request.
              </p>
            </div>

            <ul className="grid grid-cols-3 gap-2 lg:col-span-5">
              {rates.map((r) => (
                <li
                  key={r.label}
                  className="px-2 py-3 text-center sm:px-3"
                  style={{ border: '1px solid color-mix(in srgb, var(--c-champagne) 25%, transparent)', background: 'color-mix(in srgb, #000 12%, transparent)' }}
                >
                  <p className="text-[0.62rem] uppercase tracking-[0.16em]" style={{ color: 'var(--c-on-chrome-soft)' }}>{r.label}</p>
                  <p className="mt-1 text-[1rem] font-semibold tabular-nums sm:text-[1.15rem]" style={{ color: 'var(--c-champagne)' }}>
                    {formatRupees(r.value)}
                  </p>
                </li>
              ))}
            </ul>

            <nav aria-label="Shop by type" className="grid grid-cols-3 gap-2 lg:col-span-3 lg:grid-cols-1">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="group flex min-h-11 items-center justify-center gap-1.5 px-2 text-[0.66rem] font-medium uppercase tracking-[0.18em] transition-colors lg:justify-between lg:px-4"
                  style={{ border: '1px solid color-mix(in srgb, var(--c-champagne) 45%, transparent)', color: 'var(--c-on-sage)' }}
                >
                  {l.label}
                  <ArrowRight size={13} strokeWidth={1.6} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </nav>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
