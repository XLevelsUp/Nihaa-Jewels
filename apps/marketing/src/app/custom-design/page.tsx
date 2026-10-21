// Bespoke commissions: how a custom piece is made, what to bring and what we make; copy restates promises made elsewhere on the site and is placeholder until the client confirms the process.

import type { Metadata } from 'next';
import { MessageCircle } from 'lucide-react';

import Navigation from '@/components/sections/NavigationServer';
import Footer from '@/components/sections/Footer';
import ImageSlot from '@/components/ui/ImageSlot';
import Reveal from '@/components/ui/Reveal';
import BookVisitButton from '@/components/ui/BookVisitButton';
import { aboutSlot } from '@/lib/imageSlots';
import { STORE } from '@/constants/store';

export const metadata: Metadata = {
  title: 'Bespoke Gold Jewellery, Made to Order',
  description: `Commission a piece of gold jewellery from ${STORE.name} in Coimbatore. Bring a sketch, a photo or an heirloom; we draw it, weigh it and make it at our own bench.`,
  alternates: { canonical: '/custom-design' },
};

const WHATSAPP_HREF = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(`Hello ${STORE.name}, I would like to commission a piece. Here is my idea:`)}`;

const STEPS = [
  { title: 'Share your idea', body: 'A sketch, a photo, a piece you love, or only a few words. Bring it to the showroom or send it on WhatsApp.' },
  { title: 'We draw it', body: 'Our goldsmith sketches the piece with you and suggests the purity, weight and finish that suit it.' },
  { title: 'Weight and price', body: 'You see the estimated gold weight, wastage and making charges at the day’s rate before anything is made.' },
  { title: 'Made at our bench', body: 'Once you approve the design, it is drawn, shaped and finished by hand in our own workshop.' },
  { title: 'Fitted and hallmarked', body: 'You collect it at the showroom, checked, BIS hallmarked and adjusted to fit.' },
];

const BRING = [
  { title: 'A sketch or a photo', body: 'Something you drew, saved or saw. Rough is fine.' },
  { title: 'An heirloom to remake', body: 'Old family gold, reshaped into something you will wear, its gold tested in front of you.' },
  { title: 'A piece to match', body: 'Earrings to go with a necklace, or a second bangle to make a pair.' },
];

const MAKE = ['Necklaces & chokers', 'Chains & pendants', 'Bangles & kadas', 'Earrings & jhumkas', 'Bridal sets', 'Pieces for children'];

const FAQS = [
  {
    q: 'How long does a commission take?',
    a: 'It depends on the piece. We give you a date when you approve the design, before any work begins.',
  },
  {
    q: 'Do I pay before seeing the design?',
    a: 'No. You see the drawing and the estimated price first; nothing is made until you approve it.',
  },
  {
    q: 'Can you use my old gold?',
    a: 'Yes. It is tested in front of you and valued at the day’s rate towards the new piece.',
  },
];

export default function CustomDesignPage() {
  return (
    <div className="landing-bg min-h-screen">
      <Navigation />

      <main>
        <section aria-labelledby="bespoke-heading" className="pt-12 md:pt-20">
          <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-6">
              <p className="lux-eyebrow">Bespoke Commissions</p>
              <h1 id="bespoke-heading" className="lux-display mt-4" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}>
                Your idea, <em>made in gold</em>
              </h1>
              <p className="lux-body mt-6">
                Bring a sketch, an heirloom or only an idea. We will draw it, weigh it and make it at our own bench, and
                you will see the price before anything is made.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <BookVisitButton label="Book a design consultation" />
                <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="lux-button lux-button-ghost">
                  <MessageCircle size={15} strokeWidth={1.5} aria-hidden="true" />
                  Send a photo on WhatsApp
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="relative w-full overflow-hidden lg:col-span-6" style={{ aspectRatio: '4 / 5' }}>
              <ImageSlot slot={aboutSlot('craftShaping')} sizes="(max-width: 1024px) 100vw, 50vw" priority />
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="process-heading" className="pt-20 md:pt-28">
          <div className="container-wide">
            <Reveal className="mx-auto mb-12 max-w-2xl text-center md:mb-14">
              <p className="lux-eyebrow">The Process</p>
              <h2 id="process-heading" className="lux-display mt-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
                From idea <em>to your hands</em>
              </h2>
            </Reveal>
            <ol className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
              {STEPS.map((s, i) => (
                <li key={s.title}>
                  <Reveal delay={i * 0.07} className="h-full border-t pt-7" style={{ borderColor: 'var(--c-border-firm)' }}>
                    <span className="lux-display block text-[2.4rem] leading-none" style={{ color: 'var(--c-gold-ink)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="lux-title mt-5 text-[1.3rem]">{s.title}</h3>
                    <p className="lux-body mt-2 text-[0.86rem]">{s.body}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="bring-heading" className="pt-20 md:pt-28">
          <div className="container-wide grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <Reveal className="relative w-full overflow-hidden lg:col-span-5" style={{ aspectRatio: '4 / 5' }}>
              <ImageSlot slot={aboutSlot('craftThread')} sizes="(max-width: 1024px) 100vw, 40vw" />
            </Reveal>
            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal>
                <p className="lux-eyebrow">Where It Starts</p>
                <h2 id="bring-heading" className="lux-display mt-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
                  What you <em>can bring</em>
                </h2>
              </Reveal>
              <ul className="mt-8">
                {BRING.map((b, i) => (
                  <li key={b.title}>
                    <Reveal delay={0.05 + i * 0.06} className="border-t py-5" style={{ borderColor: 'var(--c-border)' }}>
                      <h3 className="lux-title text-[1.3rem]">{b.title}</h3>
                      <p className="lux-body mt-1 text-[0.88rem]">{b.body}</p>
                    </Reveal>
                  </li>
                ))}
              </ul>

              <Reveal delay={0.25} className="mt-8">
                <p className="lux-eyebrow">What We Make</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {MAKE.map((m) => (
                    <li key={m} className="px-3.5 py-2 text-[0.8rem]" style={{ border: '1px solid var(--c-border-firm)', background: 'var(--c-product-card)' }}>
                      {m}
                    </li>
                  ))}
                </ul>
                <p className="text-soft mt-3 text-[0.78rem]">All in BIS hallmarked gold, in 22K or 18K.</p>
              </Reveal>
            </div>
          </div>
        </section>

        <section aria-labelledby="bespoke-faq" className="pt-20 md:pt-28">
          <div className="container-page max-w-3xl">
            <Reveal>
              <h2 id="bespoke-faq" className="lux-display text-center" style={{ fontSize: 'clamp(1.9rem, 3.6vw, 2.8rem)' }}>
                Good <em>to know</em>
              </h2>
              <div className="mt-8">
                {FAQS.map((f) => (
                  <details key={f.q} className="group border-t py-4" style={{ borderColor: 'var(--c-border)' }}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                      <span className="lux-title text-[1.2rem]">{f.q}</span>
                      <span aria-hidden="true" className="text-[1.2rem] leading-none transition-transform group-open:rotate-45" style={{ color: 'var(--c-burgundy)' }}>
                        +
                      </span>
                    </summary>
                    <p className="lux-body mt-3 text-[0.88rem]">{f.a}</p>
                  </details>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="chrome-block mt-20 py-16 md:mt-28 md:py-20">
          <div className="container-page flex flex-col items-center gap-6 text-center">
            <h2 className="lux-display" style={{ fontSize: 'clamp(1.9rem, 3.6vw, 2.8rem)', color: 'var(--c-on-sage)' }}>
              Let us <em>draw it with you</em>
            </h2>
            <p className="max-w-xl text-[0.92rem] leading-relaxed" style={{ color: 'var(--c-on-chrome-soft)' }}>
              Book a consultation at the showroom, or send us a photo first and we will tell you what is possible.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <BookVisitButton tone="light" label="Book a consultation" />
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="lux-button"
                style={{ background: 'transparent', borderColor: 'rgba(247,236,217,0.55)', color: 'var(--c-on-sage)' }}
              >
                <MessageCircle size={15} strokeWidth={1.5} aria-hidden="true" />
                WhatsApp a photo
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
