// Three-panel campaign triptych for Gold, Silver and Diamond, stacked on phones and three columns on desktop.

import Link from 'next/link';

import ImageSlot from '@/components/ui/ImageSlot';
import Reveal from '@/components/ui/Reveal';
import { homeSlot } from '@/lib/imageSlots';

const PANELS = [
  { key: 'diptychLeft', eyebrow: 'BIS Hallmarked', title: 'Gold,', accent: 'shaped by hand', href: '/gold-jewellery' },
  { key: 'diptychSilver', eyebrow: '925 Sterling · 999 Fine', title: 'Silver,', accent: 'bright & everyday', href: '/silver-jewellery' },
  { key: 'diptychDiamond', eyebrow: 'Certified', title: 'Diamond,', accent: 'set in gold', href: '/diamond-jewellery' },
] as const;

export default function CampaignDiptych() {
  return (
    <section aria-label="Gold, silver and diamond collections" className="container-wide mt-12 grid grid-cols-1 gap-4 md:mt-20 lg:grid-cols-3 lg:gap-6">
      {PANELS.map((p, i) => (
        <Reveal key={p.key} delay={i * 0.1} y={0}>
          <Link href={p.href} className="group relative block h-[56svh] min-h-[400px] overflow-hidden lg:h-[64svh] lg:max-h-[580px]">
            <div className="absolute inset-0">
              <ImageSlot
                slot={homeSlot(p.key)}
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="transition-transform duration-[1800ms] ease-out group-hover:scale-[1.03]"
              />
            </div>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: 'linear-gradient(180deg, rgba(20, 6, 8, 0) 28%, rgba(20, 6, 8, 0.55) 55%, rgba(20, 6, 8, 0.94) 100%)' }}
            />
            <span className="absolute inset-x-0 bottom-0 block p-6 md:p-8" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.6), 0 2px 18px rgba(0, 0, 0, 0.55)' }}>
              <span className="lux-eyebrow block" style={{ color: '#F1DDB4', fontWeight: 600 }}>{p.eyebrow}</span>
              <span className="lux-display mt-3 block" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.35rem)', color: '#FFF8EC' }}>
                {p.title} <em style={{ color: '#F1DDB4' }}>{p.accent}</em>
              </span>
              <span
                className="lux-link mt-4"
                style={{ color: '#FFF8EC', background: 'rgba(20, 6, 8, 0.45)', borderColor: 'rgba(255, 248, 236, 0.6)', textShadow: 'none' }}
              >
                Explore
              </span>
            </span>
          </Link>
        </Reveal>
      ))}
    </section>
  );
}
