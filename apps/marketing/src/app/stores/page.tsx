// The showroom page: the Town Hall showroom with its map, hours and phone, what a visit is like and what can be done there; visit copy is placeholder until the client confirms it.

import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, MapPin, MessageCircle, Navigation as NavigationIcon, Phone } from 'lucide-react';

import Navigation from '@/components/sections/NavigationServer';
import Footer from '@/components/sections/Footer';
import ImageSlot from '@/components/ui/ImageSlot';
import Reveal from '@/components/ui/Reveal';
import BookVisitButton from '@/components/ui/BookVisitButton';
import { aboutSlot, homeSlot } from '@/lib/imageSlots';
import { SHOWROOMS, STORE } from '@/constants/store';

export const metadata: Metadata = {
  title: 'Jewellery Showroom at Town Hall, Coimbatore',
  description: `Visit the ${STORE.name} jewellery showroom at Town Hall, Coimbatore, for BIS hallmarked gold, 925/999 silver and certified diamond jewellery. Open Monday to Saturday.`,
  alternates: { canonical: '/stores' },
};

const VISIT_STEPS = [
  { title: 'Choose a time', body: 'Book a slot online or on WhatsApp. Walk-ins are welcome too.' },
  { title: 'Pieces set aside', body: 'Tell us what you would like to see and we have it waiting at a private counter.' },
  { title: 'Weighed in front of you', body: 'Weight, wastage and making charges are shown openly at the day’s gold or silver rate; diamond pieces are priced on request.' },
  { title: 'Take your time', body: 'Try pieces on, compare, and leave with a quote if you want to think it over.' },
];

const SERVICES = [
  { title: 'Bespoke commissions', body: 'Bring a sketch or an idea and we will make it at our own bench.', href: '/custom-design' },
  { title: 'Old gold exchange', body: 'Old gold tested in front of you and valued at the day’s rate.', href: '/contact' },
  { title: 'Gifting', body: 'Help choosing a gift in gold, silver or diamond, wrapped properly.', href: '/gifting' },
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
                Jewellery is best judged in the hand. See gold, diamond and silver pieces in person at our showroom on
                Karuppa Goundar Street, Town Hall, Coimbatore.
              </p>

              <ul className="mt-8 flex flex-wrap gap-2">
                {SHOWROOMS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="inline-flex min-h-10 items-center gap-2 px-4 text-[0.82rem] transition-colors hover:border-[var(--c-burgundy)]"
                      style={{ border: '1px solid var(--c-border-firm)', background: 'var(--c-product-card)' }}
                    >
                      <MapPin size={14} strokeWidth={1.5} aria-hidden="true" style={{ color: 'var(--c-burgundy)' }} />
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <BookVisitButton label="Book a visit" />
                <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="lux-button lux-button-ghost">
                  <MessageCircle size={15} strokeWidth={1.5} aria-hidden="true" />
                  WhatsApp us
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="relative w-full overflow-hidden lg:col-span-6" style={{ aspectRatio: '4 / 3' }}>
              <ImageSlot slot={homeSlot('visitShowroom')} sizes="(max-width: 1024px) 100vw, 50vw" priority />
            </Reveal>
          </div>
        </section>

        <section aria-label="Showroom locations" className="pt-20 md:pt-28">
          <div className={`container-wide grid grid-cols-1 gap-6 ${SHOWROOMS.length > 1 ? 'lg:grid-cols-2' : 'mx-auto max-w-3xl'}`}>
            {SHOWROOMS.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.1} className="flex flex-col" style={{ border: '1px solid var(--c-border-firm)', background: 'var(--c-product-card)' }}>
                <article id={s.id} className="flex h-full flex-col" style={{ scrollMarginTop: 110 }}>
                  <iframe
                    title={`Map showing ${STORE.name}, ${s.name}, ${STORE.city}`}
                    src={s.mapsEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="block h-[260px] w-full md:h-[320px]"
                    style={{ border: 0, filter: 'sepia(0.15) saturate(0.85)' }}
                  />
                  <div className="flex flex-1 flex-col p-6 md:p-8">
                    <p className="lux-eyebrow">Our showroom</p>
                    <h2 className="lux-display mt-2" style={{ fontSize: 'clamp(1.7rem, 2.6vw, 2.2rem)' }}>
                      {STORE.name}, <em>{s.name}</em>
                    </h2>
                    <dl className="mt-5 flex flex-col gap-3 text-[0.9rem]">
                      <div className="flex gap-3">
                        <MapPin size={17} strokeWidth={1.5} className="mt-0.5 shrink-0" style={{ color: 'var(--c-burgundy)' }} aria-hidden="true" />
                        <div><dt className="sr-only">Address</dt><dd className="leading-relaxed">{s.address}</dd></div>
                      </div>
                      <div className="flex gap-3">
                        <Clock size={17} strokeWidth={1.5} className="mt-0.5 shrink-0" style={{ color: 'var(--c-burgundy)' }} aria-hidden="true" />
                        <div><dt className="sr-only">Hours</dt><dd>{s.hours}<br />Sunday closed</dd></div>
                      </div>
                      <div className="flex gap-3">
                        <Phone size={17} strokeWidth={1.5} className="mt-0.5 shrink-0" style={{ color: 'var(--c-burgundy)' }} aria-hidden="true" />
                        <div><dt className="sr-only">Phone</dt><dd><a href={s.phoneHref} className="tabular-nums underline-offset-4 hover:underline">{s.phone}</a></dd></div>
                      </div>
                    </dl>
                    <div className="mt-auto flex flex-wrap gap-3 pt-6">
                      <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className="lux-button lux-button-ghost">
                        <NavigationIcon size={15} strokeWidth={1.5} aria-hidden="true" />
                        Directions
                      </a>
                      <a href={s.phoneHref} className="lux-button lux-button-ghost">
                        <Phone size={15} strokeWidth={1.5} aria-hidden="true" />
                        Call
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
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
