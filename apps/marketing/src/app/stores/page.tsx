// The showroom page: where it is, when it is open, what a visit is like and what can be done there; visit copy is placeholder until the client confirms it.

import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, MapPin, MessageCircle, Navigation as NavigationIcon, Phone } from 'lucide-react';

import Navigation from '@/components/sections/NavigationServer';
import Footer from '@/components/sections/Footer';
import ImageSlot from '@/components/ui/ImageSlot';
import Reveal from '@/components/ui/Reveal';
import BookVisitButton from '@/components/ui/BookVisitButton';
import { aboutSlot, homeSlot } from '@/lib/imageSlots';
import { MAPS_EMBED_URL, MAPS_URL, STORE, STORE_ADDRESS_ONE_LINE } from '@/constants/store';

export const metadata: Metadata = {
  title: 'Our Showroom in RS Puram, Coimbatore',
  description: `Visit the ${STORE.name} showroom in RS Puram, Coimbatore. See every piece in person, weighed and priced at the day's gold rate. ${STORE.hours}.`,
  alternates: { canonical: '/stores' },
};

const VISIT_STEPS = [
  { title: 'Choose a time', body: 'Book a slot online or on WhatsApp. Walk-ins are welcome too.' },
  { title: 'Pieces set aside', body: 'Tell us what you would like to see and we have it waiting at a private counter.' },
  { title: 'Weighed in front of you', body: 'Weight, wastage and making charges are shown openly at the day’s gold rate.' },
  { title: 'Take your time', body: 'Try pieces on, compare, and leave with a quote if you want to think it over.' },
];

const SERVICES = [
  { title: 'Bespoke commissions', body: 'Bring a sketch or an idea and we will make it at our own bench.', href: '/custom-design' },
  { title: 'Old gold exchange', body: 'Old gold tested in front of you and valued at the day’s rate.', href: '/contact' },
  { title: 'Gifting', body: 'Help choosing a first piece of gold, wrapped properly.', href: '/gifting' },
  { title: 'Care & cleaning', body: 'Bring any Sakthi piece back to be cleaned and checked.', href: '/care-guide' },
];

const WHATSAPP_HREF = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(`Hello ${STORE.name}, I would like to visit the showroom.`)}`;

export default function StoresPage() {
  return (
    <div className="landing-bg min-h-screen">
      <Navigation />

      <main>
        <section aria-labelledby="stores-heading" className="pt-12 md:pt-20">
          <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-6">
              <p className="lux-eyebrow">Our Showroom</p>
              <h1 id="stores-heading" className="lux-display mt-4" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}>
                Visit <em>the House</em>
              </h1>
              <p className="lux-body mt-6">
                Gold is best judged in the hand. Every piece in our catalogue can be seen, tried on and weighed at our
                showroom in RS Puram, Coimbatore.
              </p>

              <dl className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex gap-3">
                  <MapPin size={18} strokeWidth={1.5} className="mt-0.5 shrink-0" style={{ color: 'var(--c-burgundy)' }} aria-hidden="true" />
                  <div>
                    <dt className="lux-eyebrow" style={{ letterSpacing: '0.24em' }}>Address</dt>
                    <dd className="mt-2 text-[0.88rem] leading-relaxed">{STORE_ADDRESS_ONE_LINE}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock size={18} strokeWidth={1.5} className="mt-0.5 shrink-0" style={{ color: 'var(--c-burgundy)' }} aria-hidden="true" />
                  <div>
                    <dt className="lux-eyebrow" style={{ letterSpacing: '0.24em' }}>Hours</dt>
                    <dd className="mt-2 text-[0.88rem] leading-relaxed">{STORE.hours}<br />Sunday closed</dd>
                  </div>
                </div>
              </dl>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <BookVisitButton label="Book a visit" />
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="lux-button lux-button-ghost">
                  <NavigationIcon size={15} strokeWidth={1.5} aria-hidden="true" />
                  Directions
                </a>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[0.85rem]">
                <a href={STORE.phoneHref} className="inline-flex min-h-11 items-center gap-2 tabular-nums" style={{ color: 'var(--c-text)' }}>
                  <Phone size={15} strokeWidth={1.5} aria-hidden="true" /> {STORE.phone}
                </a>
                <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2" style={{ color: 'var(--c-text)' }}>
                  <MessageCircle size={15} strokeWidth={1.5} aria-hidden="true" /> WhatsApp us
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="relative w-full overflow-hidden lg:col-span-6" style={{ aspectRatio: '4 / 3' }}>
              <ImageSlot slot={homeSlot('visitShowroom')} sizes="(max-width: 1024px) 100vw, 50vw" priority />
            </Reveal>
          </div>
        </section>

        <section aria-label="Map" className="pt-20 md:pt-28">
          <div className="container-wide">
            <Reveal className="relative overflow-hidden" style={{ border: '1px solid var(--c-border)' }}>
              <iframe
                title={`Map showing ${STORE.name}, ${STORE.area}, ${STORE.city}`}
                src={MAPS_EMBED_URL}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-[340px] w-full md:h-[440px]"
                style={{ border: 0, filter: 'sepia(0.15) saturate(0.85)' }}
              />
              <div
                className="absolute bottom-4 left-4 right-4 max-w-sm p-5 sm:right-auto md:bottom-6 md:left-6"
                style={{ background: 'var(--c-page)', boxShadow: '0 12px 40px rgba(36,16,18,0.18)' }}
              >
                <p className="lux-title text-[1.2rem]">{STORE.name}</p>
                <p className="text-soft mt-1 text-[0.8rem] leading-relaxed">{STORE_ADDRESS_ONE_LINE}</p>
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="lux-link mt-3">Open in Google Maps</a>
              </div>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="visit-heading" className="pt-20 md:pt-28">
          <div className="container-wide">
            <Reveal className="mx-auto mb-12 max-w-2xl text-center md:mb-14">
              <p className="lux-eyebrow">Your Visit</p>
              <h2 id="visit-heading" className="lux-display mt-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
                What to <em>expect</em>
              </h2>
            </Reveal>
            <ol className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {VISIT_STEPS.map((s, i) => (
                <li key={s.title}>
                  <Reveal delay={i * 0.08} className="h-full border-t pt-7" style={{ borderColor: 'var(--c-border-firm)' }}>
                    <span className="lux-display block text-[2.4rem] leading-none" style={{ color: 'var(--c-gold-ink)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="lux-title mt-5 text-[1.35rem]">{s.title}</h3>
                    <p className="lux-body mt-2 text-[0.88rem]">{s.body}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="services-heading" className="pt-20 md:pt-28">
          <div className="container-wide grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <Reveal className="relative w-full overflow-hidden lg:col-span-5" style={{ aspectRatio: '4 / 5' }}>
              <ImageSlot slot={aboutSlot('craftFinish')} sizes="(max-width: 1024px) 100vw, 40vw" />
            </Reveal>
            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal>
                <p className="lux-eyebrow">At the Showroom</p>
                <h2 id="services-heading" className="lux-display mt-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
                  More than <em>a shop counter</em>
                </h2>
              </Reveal>
              <ul className="mt-8">
                {SERVICES.map((s, i) => (
                  <li key={s.title}>
                    <Reveal delay={0.05 + i * 0.06}>
                      <Link
                        href={s.href}
                        className="group grid grid-cols-[1fr_auto] items-center gap-4 border-t py-5"
                        style={{ borderColor: 'var(--c-border)' }}
                      >
                        <span>
                          <span className="lux-title block text-[1.3rem] transition-colors group-hover:text-[var(--c-burgundy)]">{s.title}</span>
                          <span className="lux-body mt-1 block text-[0.86rem]">{s.body}</span>
                        </span>
                        <span aria-hidden="true" className="text-[1.1rem] transition-transform duration-300 group-hover:translate-x-1" style={{ color: 'var(--c-burgundy)' }}>
                          →
                        </span>
                      </Link>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="chrome-block mt-20 py-16 md:mt-28 md:py-20">
          <div className="container-page flex flex-col items-center gap-6 text-center">
            <h2 className="lux-display" style={{ fontSize: 'clamp(1.9rem, 3.6vw, 2.8rem)', color: 'var(--c-on-sage)' }}>
              We will have it <em>waiting for you</em>
            </h2>
            <p className="max-w-xl text-[0.92rem] leading-relaxed" style={{ color: 'var(--c-on-chrome-soft)' }}>
              Book a time and tell us what you would like to see. No payment is taken online.
            </p>
            <BookVisitButton tone="light" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
