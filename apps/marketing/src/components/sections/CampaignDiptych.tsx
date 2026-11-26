// Two full-height campaign photographs side by side, each captioned low over a scrim and opening the catalogue; they stack on phones.

import Link from 'next/link';

import ImageSlot from '@/components/ui/ImageSlot';
import Reveal from '@/components/ui/Reveal';
import { homeSlot } from '@/lib/imageSlots';

const PANELS = [
  { key: 'diptychLeft', eyebrow: 'The New Collection', title: 'Filigree,', accent: 'reimagined', href: '/collections' },
  { key: 'diptychRight', eyebrow: 'The Heritage Edit', title: 'Temple gold,', accent: 'made lighter', href: '/collections' },
] as const;

export default function CampaignDiptych() {
  return (
    <section aria-label="Campaign" className="container-wide mt-24 grid grid-cols-1 gap-4 md:mt-36 md:grid-cols-2 md:gap-6">
      {PANELS.map((p, i) => (
        <Reveal key={p.key} delay={i * 0.12} y={0}>
          <Link href={p.href} className="group relative block h-[60svh] min-h-[420px] overflow-hidden md:h-[68svh] md:max-h-[620px]">
            <ImageSlot
              slot={homeSlot(p.key)}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="transition-transform duration-[1800ms] ease-out group-hover:scale-[1.03]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: 'linear-gradient(180deg, rgba(20, 6, 8, 0) 55%, rgba(20, 6, 8, 0.7) 100%)' }}
            />
            <span className="absolute inset-x-0 bottom-0 block p-6 md:p-10">
              <span className="lux-eyebrow block" style={{ color: 'var(--c-champagne)' }}>{p.eyebrow}</span>
              <span className="lux-display mt-3 block" style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.6rem)', color: '#F7ECD9' }}>
                {p.title} <em style={{ color: 'var(--c-champagne)' }}>{p.accent}</em>
              </span>
              <span className="lux-link mt-4" style={{ color: '#F7ECD9' }}>Discover</span>
            </span>
          </Link>
        </Reveal>
      ))}
    </section>
  );
}
