// Care guide for gold, silver and diamonds: everyday habits, cleaning, storage and chains, silver and diamond care, a do/don't list, then the check-up at the showroom.

import type { Metadata } from 'next';
import { Droplets, Gem, Link2, Package, Sparkles, SunMedium } from 'lucide-react';

import Navigation from '@/components/sections/NavigationServer';
import Footer from '@/components/sections/Footer';
import ImageSlot from '@/components/ui/ImageSlot';
import Reveal from '@/components/ui/Reveal';
import BookVisitButton from '@/components/ui/BookVisitButton';
import { aboutSlot } from '@/lib/imageSlots';

export const metadata: Metadata = {
  title: 'Jewellery Care Guide: Gold, Silver and Diamond',
  description:
    'How to wear, clean and store gold, silver and diamond jewellery: gentle cleaning at home, keeping silver bright, storing chains and diamonds safely, and check-ups at our showroom.',
  alternates: { canonical: '/care-guide' },
};

const GUIDES = [
  {
    icon: SunMedium,
    title: 'Wear it well',
    points: [
      'Put jewellery on last, after perfume, lotion and hairspray, and take it off first.',
      'Remove it for swimming, cleaning, the gym and heavy work.',
      'Chlorine and household chemicals dull gold and weaken solder joints over time.',
    ],
  },
  {
    icon: Droplets,
    title: 'Clean it gently',
    points: [
      'Soak for a few minutes in lukewarm water with a drop of mild soap.',
      'Loosen dirt with a soft baby toothbrush, especially in carved detail.',
      'Rinse, then pat completely dry with a soft lint-free cloth.',
    ],
  },
  {
    icon: Package,
    title: 'Store it apart',
    points: [
      'Keep each piece in its own soft pouch or lined compartment.',
      'Gold is soft and scratches against other jewellery, including other gold.',
      'Keep pieces away from damp places like the bathroom.',
    ],
  },
  {
    icon: Link2,
    title: 'Chains in particular',
    points: [
      'Fasten the clasp before storing, so the chain cannot knot.',
      'Hang longer chains, or lay them flat, rather than piling them.',
      'Avoid sleeping in fine chains; the twisting strains the links.',
    ],
  },
  {
    icon: Gem,
    title: 'Temple and antique finish',
    points: [
      'The darker tone in recesses is part of the design; do not scrub it away.',
      'Wipe with a dry soft cloth after wearing, and skip polishing cloths and pastes.',
      'Store in a pouch out of air to keep the finish even.',
    ],
  },
  {
    icon: Sparkles,
    title: 'Let us check it',
    points: [
      'Bring any piece in once a year so we can check clasps, hooks and joints.',
      'Loose clasps are the most common reason a chain is lost.',
      'Small repairs are quick when caught early.',
    ],
  },
];

const OTHER_CARE = [
  {
    id: 'silver-care',
    icon: Sparkles,
    title: 'Caring for silver',
    intro: 'Silver slowly darkens as it meets the air. That is normal, and a little care keeps it bright.',
    points: [
      'Wipe each piece with a soft dry cloth after wearing, to remove skin oils.',
      'Store it in a closed pouch or a small sealed bag, away from damp air.',
      'Keep it away from perfume, chlorine and rubber bands, which speed up darkening.',
      '999 fine silver is soft, so store it on its own to avoid scratches.',
      'For a darkened piece, ask us at the showroom rather than using harsh dips.',
    ],
  },
  {
    id: 'diamond-care',
    icon: Gem,
    title: 'Caring for diamonds',
    intro: 'Diamonds are hard, but they pick up grease easily, and their settings need an eye kept on them.',
    points: [
      'Clean with lukewarm water, a drop of mild soap and a soft brush, reaching behind the stone.',
      'Store each piece separately: a diamond can scratch other jewellery, and other diamonds.',
      'Take rings off for heavy work; a hard knock can chip a stone or bend a claw.',
      'Bring the piece in once a year so we can check the claws and settings.',
      'Keep the diamond certificate safe with the piece.',
    ],
  },
];

const DO = ['Lukewarm water and mild soap', 'A soft brush and a lint-free cloth', 'Separate soft pouches', 'A yearly check of clasps'];
const DONT = ['Bleach, chlorine or harsh cleaners', 'Toothpaste or abrasive powders', 'Wearing jewellery in the pool or gym', 'Polishing an antique finish bright'];

export default function CareGuidePage() {
  return (
    <div className="landing-bg min-h-screen">
      <Navigation />

      <main>
        <section aria-labelledby="care-heading" className="pt-12 md:pt-20">
          <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-6">
              <p className="lux-eyebrow">Care Guide</p>
              <h1 id="care-heading" className="lux-display mt-4" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}>
                Gold that lasts <em>a lifetime</em>
              </h1>
              <p className="lux-body mt-6">
                Gold does not tarnish, but it is soft, and it picks up the marks of daily life. A few simple habits keep
                every piece looking the way it did on the day it was made.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="relative w-full overflow-hidden lg:col-span-6" style={{ aspectRatio: '4 / 3' }}>
              <ImageSlot slot={aboutSlot('craftFinish')} sizes="(max-width: 1024px) 100vw, 50vw" priority className="object-[50%_60%]" />
            </Reveal>
          </div>
        </section>

        <section aria-label="Care instructions" className="pt-20 md:pt-28">
          <div className="container-wide">
            <ul className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {GUIDES.map((g, i) => (
                <li key={g.title}>
                  <Reveal delay={(i % 3) * 0.08} className="h-full border-t pt-7" style={{ borderColor: 'var(--c-border-firm)' }}>
                    <g.icon size={22} strokeWidth={1.4} style={{ color: 'var(--c-gold-ink)' }} aria-hidden="true" />
                    <h2 className="lux-title mt-4 text-[1.45rem]">{g.title}</h2>
                    <ul className="mt-3 flex flex-col gap-2">
                      {g.points.map((p) => (
                        <li key={p} className="lux-body flex gap-2.5 text-[0.88rem]">
                          <span aria-hidden="true" className="mt-[0.6em] h-1 w-1 shrink-0 rotate-45" style={{ background: 'var(--c-gold-ink)' }} />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="silver-diamond-heading" className="pt-20 md:pt-28">
          <div className="container-wide">
            <Reveal className="mb-10">
              <p className="lux-eyebrow">Silver and Diamonds</p>
              <h2 id="silver-diamond-heading" className="lux-display mt-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                Beyond gold
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
              {OTHER_CARE.map((c, i) => (
                <Reveal
                  key={c.id}
                  delay={i * 0.08}
                  id={c.id}
                  className="scroll-mt-24 p-6 md:p-8"
                  style={{ border: '1px solid var(--c-border-firm)', background: 'var(--c-product-card)' }}
                >
                  <c.icon size={22} strokeWidth={1.4} style={{ color: 'var(--c-gold-ink)' }} aria-hidden="true" />
                  <h3 className="lux-title mt-4 text-[1.5rem]">{c.title}</h3>
                  <p className="lux-body mt-2 text-[0.9rem]">{c.intro}</p>
                  <ul className="mt-4 flex flex-col gap-2">
                    {c.points.map((p) => (
                      <li key={p} className="lux-body flex gap-2.5 text-[0.88rem]">
                        <span aria-hidden="true" className="mt-[0.6em] h-1 w-1 shrink-0 rotate-45" style={{ background: 'var(--c-gold-ink)' }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="dodont-heading" className="pt-20 md:pt-28">
          <div className="container-page">
            <Reveal className="mb-10 text-center">
              <p className="lux-eyebrow">At a Glance</p>
              <h2 id="dodont-heading" className="lux-display mt-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                Do <em>and don’t</em>
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                { title: 'Do', items: DO, mark: '✓', colour: '#2E7D53' },
                { title: 'Don’t', items: DONT, mark: '✕', colour: 'var(--c-burgundy)' },
              ].map((col, i) => (
                <Reveal key={col.title} delay={i * 0.08} className="p-6 md:p-8" style={{ border: '1px solid var(--c-border-firm)', background: 'var(--c-product-card)' }}>
                  <h3 className="lux-title text-[1.5rem]">{col.title}</h3>
                  <ul className="mt-4 flex flex-col gap-3">
                    {col.items.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-[0.92rem]">
                        <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[0.75rem] font-semibold" style={{ color: col.colour, border: `1px solid ${col.colour}` }}>
                          {col.mark}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="chrome-block mt-20 py-16 md:mt-28 md:py-20">
          <div className="container-page flex flex-col items-center gap-6 text-center">
            <h2 className="lux-display" style={{ fontSize: 'clamp(1.9rem, 3.6vw, 2.8rem)', color: 'var(--c-on-sage)' }}>
              Bring it back <em>to us</em>
            </h2>
            <p className="max-w-xl text-[0.92rem] leading-relaxed" style={{ color: 'var(--c-on-chrome-soft)' }}>
              Bring any Sakthi piece back to be cleaned, polished and checked, for as long as you wear it.
            </p>
            <BookVisitButton tone="light" label="Book a check-up" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
