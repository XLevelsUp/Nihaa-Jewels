// The house's story in the homepage's editorial style; history copy is placeholder (no dates or names) until the client confirms the facts.

import type { Metadata } from 'next';

import Navigation from '@/components/sections/NavigationServer';
import Footer from '@/components/sections/Footer';
import VisitUs from '@/components/sections/VisitUs';
import ImageSlot from '@/components/ui/ImageSlot';
import Reveal from '@/components/ui/Reveal';
import { aboutSlot, homeSlot } from '@/lib/imageSlots';

export const metadata: Metadata = {
  title: 'Our Story',
  description:
    'Sakthi Chains began with a single thread of gold. Discover the house, the craft and the hands behind our BIS hallmarked gold jewellery.',
  openGraph: {
    title: 'Our Story | Sakthi Chains',
    description: 'The house, the craft and the hands behind Sakthi Chains gold jewellery.',
    type: 'website',
  },
};

const CHAPTERS = [
  { numeral: 'I', title: 'The first chain', body: 'A single bench, a coil of gold wire and a goldsmith who made chains that lasted.' },
  { numeral: 'II', title: 'A name in the family', body: 'Word passed from one wedding to the next, and families came back for every occasion after.' },
  { numeral: 'III', title: 'Beyond the chain', body: 'The same patience turned to necklaces, bangles and earrings, all still made by hand.' },
  { numeral: 'IV', title: 'The house today', body: 'A showroom where every piece can be held, weighed and chosen at the day’s gold rate.' },
];

const CRAFT = [
  { key: 'craftThread', numeral: 'I', title: 'The thread', body: 'Gold is melted, measured and drawn through steel plates until it becomes a fine, even wire.' },
  { key: 'craftShaping', numeral: 'II', title: 'The shaping', body: 'Link by link, the wire is bent, joined and soldered at the bench into chains and settings.' },
  { key: 'craftFinish', numeral: 'III', title: 'The finish', body: 'Each piece is checked, polished by hand and hallmarked before it reaches the showroom.' },
] as const;

const PROMISES = [
  { title: 'Pure by measure', body: 'Every piece is BIS hallmarked for its karat, so its purity can be checked by anyone, anywhere.' },
  { title: 'Weighed in front of you', body: 'Weight, wastage and making charges are shown openly, priced at the day’s published gold rate.' },
  { title: 'Cared for for life', body: 'Bring any Sakthi piece back to be cleaned, polished and checked, for as long as you wear it.' },
];

export default function AboutPage() {
  return (
    <div className="landing-bg min-h-screen">
      <Navigation />

      <section aria-labelledby="about-heading" className="relative isolate h-[78svh] min-h-[520px] w-full overflow-hidden" style={{ background: '#140608' }}>
        <ImageSlot slot={aboutSlot('hero')} sizes="100vw" priority className="object-[70%_50%]" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(20, 6, 8, 0.75) 0%, rgba(20, 6, 8, 0.25) 55%, rgba(20, 6, 8, 0) 100%), linear-gradient(180deg, rgba(20, 6, 8, 0) 55%, rgba(20, 6, 8, 0.6) 100%)' }}
        />
        <div className="container-page absolute inset-x-0 bottom-0 pb-16 md:pb-24">
          <Reveal>
            <p className="lux-eyebrow" style={{ color: 'var(--c-champagne)' }}>Our Story</p>
            <h1
              id="about-heading"
              className="lux-display mt-5 max-w-[14ch]"
              style={{ fontSize: 'clamp(2.6rem, 6vw, 5.2rem)', color: '#F7ECD9' }}
            >
              A house built on <em style={{ color: 'var(--c-champagne)' }}>a single thread of gold</em>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="surface-page pt-24 md:pt-36">
        <div className="container-page flex flex-col items-center text-center">
          <Reveal>
            <p className="lux-display mx-auto max-w-[24ch]" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 3rem)', lineHeight: 1.2 }}>
              We make gold to be worn every day, kept for a lifetime and <em>passed on after</em>.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-10 flex items-center gap-3" aria-hidden="true">
            <span className="h-px w-12" style={{ background: 'var(--c-gold-ink)' }} />
            <span className="h-1.5 w-1.5 rotate-45" style={{ background: 'var(--c-gold-ink)' }} />
            <span className="h-px w-12" style={{ background: 'var(--c-gold-ink)' }} />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="origin-heading" className="surface-page pt-24 md:pt-36">
        <div className="container-page grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-10">
          <Reveal className="relative w-full overflow-hidden md:col-span-5" style={{ aspectRatio: '4 / 5' }}>
            <ImageSlot slot={aboutSlot('origin')} sizes="(max-width: 768px) 100vw, 40vw" />
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7">
            <p className="lux-eyebrow">How It Began</p>
            <h2 id="origin-heading" className="lux-display mt-4" style={{ fontSize: 'clamp(2.1rem, 4.2vw, 3.4rem)' }}>
              It started <em>with chains</em>
            </h2>
            <p className="lux-body mt-6">
              Sakthi began at a single goldsmith’s bench, making chains for the families around it. Each one was drawn,
              linked and finished by hand, and made to be worn every day without a second thought.
            </p>
            <p className="lux-body mt-4">
              The name grew the way it still does: one family telling the next. The chains came first, and the same
              patience now goes into every necklace, bangle and earring that carries the Sakthi name.
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="chapters-heading" className="surface-page pt-24 md:pt-36">
        <div className="container-wide">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
            <p className="lux-eyebrow">The Chapters</p>
            <h2 id="chapters-heading" className="lux-display mt-4" style={{ fontSize: 'clamp(2.1rem, 4.4vw, 3.6rem)' }}>
              From one bench <em>to the house today</em>
            </h2>
          </Reveal>
          <ol className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {CHAPTERS.map((c, i) => (
              <li key={c.numeral}>
                <Reveal delay={i * 0.08} className="h-full border-t pt-8" style={{ borderColor: 'var(--c-border-firm)' }}>
                  <span className="lux-display block text-[clamp(2.4rem,3.4vw,3rem)] leading-none" style={{ color: 'var(--c-gold-ink)' }}>
                    {c.numeral}
                  </span>
                  <h3 className="lux-title mt-6 text-[clamp(1.4rem,2vw,1.75rem)]">{c.title}</h3>
                  <p className="lux-body mt-3 text-[0.88rem]">{c.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="craft-heading" className="surface-page pt-24 md:pt-36">
        <div className="container-wide">
          <Reveal className="mb-12 flex flex-col items-start gap-6 md:mb-16">
            <p className="lux-eyebrow">The Craft</p>
            <h2 id="craft-heading" className="lux-display" style={{ fontSize: 'clamp(2.1rem, 4.4vw, 3.6rem)' }}>
              From thread <em>to finish</em>
            </h2>
          </Reveal>
          <ol className="grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-3">
            {CRAFT.map((c, i) => (
              <li key={c.key}>
                <Reveal delay={i * 0.1}>
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 5' }}>
                    <ImageSlot slot={aboutSlot(c.key)} sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                  <div className="mt-6 flex items-baseline gap-3">
                    <span className="lux-title text-[0.95rem]" style={{ color: 'var(--c-gold-ink)' }}>{c.numeral}</span>
                    <h3 className="lux-title text-[clamp(1.4rem,2vw,1.75rem)]">{c.title}</h3>
                  </div>
                  <p className="lux-body mt-3 max-w-[38ch] text-[0.9rem]">{c.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="hands-heading" className="relative isolate mt-24 w-full overflow-hidden md:mt-36" style={{ background: '#140608' }}>
        <div className="relative aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[2/1]">
          <ImageSlot slot={aboutSlot('hands')} sizes="100vw" className="object-[50%_40%]" />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(20, 6, 8, 0) 45%, rgba(20, 6, 8, 0.8) 100%)' }}
          />
          <div className="container-page absolute inset-x-0 bottom-0 pb-10 md:pb-16">
            <Reveal>
              <p className="lux-eyebrow" style={{ color: 'var(--c-champagne)' }}>The Hands Behind It</p>
              <h2 id="hands-heading" className="lux-display mt-4 max-w-[20ch]" style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)', color: '#F7ECD9' }}>
                The same few pairs of hands, <em style={{ color: 'var(--c-champagne)' }}>from first thread to final polish</em>
              </h2>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="promise-heading" className="surface-page pt-24 md:pt-36">
        <div className="container-page grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-4">
            <p className="lux-eyebrow">Our Promise</p>
            <h2 id="promise-heading" className="lux-display mt-4" style={{ fontSize: 'clamp(2.1rem, 4.2vw, 3.4rem)' }}>
              What every piece <em>carries with it</em>
            </h2>
          </Reveal>
          <ol className="md:col-span-7 md:col-start-6">
            {PROMISES.map((p, i) => (
              <li key={p.title}>
                <Reveal
                  delay={0.1 + i * 0.1}
                  className="grid grid-cols-[3rem_1fr] gap-4 py-6"
                  style={{ borderTop: '1px solid color-mix(in srgb, var(--c-gold-ink) 22%, transparent)' }}
                >
                  <span aria-hidden="true" className="lux-title pt-0.5 text-[1.1rem]" style={{ color: 'var(--c-gold-ink)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="lux-title text-[1.35rem]">{p.title}</h3>
                    <p className="lux-body mt-2 text-[0.9rem]">{p.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <VisitUs showroom={homeSlot('visitShowroom')} />
      <Footer />
    </div>
  );
}
