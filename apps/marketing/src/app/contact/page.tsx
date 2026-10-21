// Contact: the fastest ways to reach the shop first (call, WhatsApp, book), then the message form beside the showroom details and short answers to the usual questions.

import type { Metadata } from 'next';
import { CalendarCheck, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

import Navigation from '@/components/sections/NavigationServer';
import Footer from '@/components/sections/Footer';
import ContactForm from '@/components/sections/ContactForm';
import Reveal from '@/components/ui/Reveal';
import BookVisitButton from '@/components/ui/BookVisitButton';
import { MAPS_URL, STORE, STORE_ADDRESS_ONE_LINE } from '@/constants/store';
import { INDICATIVE_PRICE_DISCLAIMER } from '@/lib/pricing';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Call, WhatsApp or write to ${STORE.name}, or book a visit to our showroom in RS Puram, Coimbatore.`,
  alternates: { canonical: '/contact' },
};

const WHATSAPP_HREF = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(`Hello ${STORE.name}, I have a question.`)}`;

// Each answer restates something the site already promises elsewhere; nothing new is claimed here.
const FAQS = [
  {
    q: 'Can I buy online?',
    a: 'Not yet. Every piece is seen, weighed and bought at our showroom. Book a visit and we will have your choices waiting.',
  },
  {
    q: 'Is the price on the website final?',
    a: `${INDICATIVE_PRICE_DISCLAIMER} It moves with the day’s gold rate.`,
  },
  {
    q: 'Can I exchange old gold?',
    a: 'Yes. Bring it to the showroom and it is tested in front of you and valued at the day’s rate against something new.',
  },
  {
    q: 'Do you make custom pieces?',
    a: 'Yes. Bring a sketch, an heirloom or only an idea, and we will draw it, weigh it and make it at our own bench.',
  },
];

export default function ContactPage() {
  const channels = [
    { icon: Phone, title: 'Call us', detail: STORE.phone, note: STORE.hours, href: STORE.phoneHref, action: 'Call now', external: false },
    { icon: MessageCircle, title: 'WhatsApp', detail: STORE.whatsappDisplay, note: 'Photos, prices and quick questions', href: WHATSAPP_HREF, action: 'Start a chat', external: true },
    ...(STORE.email
      ? [{ icon: Mail, title: 'Email', detail: STORE.email, note: 'We reply within one working day', href: `mailto:${STORE.email}`, action: 'Write to us', external: false }]
      : []),
  ];

  return (
    <div className="landing-bg min-h-screen">
      <Navigation />

      <main className="pb-20 md:pb-28">
        <section aria-labelledby="contact-heading" className="pt-12 md:pt-20">
          <div className="container-page">
            <Reveal className="max-w-2xl">
              <p className="lux-eyebrow">Contact</p>
              <h1 id="contact-heading" className="lux-display mt-4" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}>
                We are <em>here to help</em>
              </h1>
              <p className="lux-body mt-6">
                A question about a piece, a price or a commission, or a time to visit. Choose whatever is easiest for you.
              </p>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
              {channels.map((c, i) => (
                <Reveal key={c.title} delay={i * 0.08} className="h-full">
                  <a
                    href={c.href}
                    target={c.external ? '_blank' : undefined}
                    rel={c.external ? 'noopener noreferrer' : undefined}
                    className="group flex h-full flex-col gap-3 p-6 transition-colors hover:border-[var(--c-burgundy)]"
                    style={{ border: '1px solid var(--c-border-firm)', background: 'var(--c-product-card)' }}
                  >
                    <c.icon size={22} strokeWidth={1.4} style={{ color: 'var(--c-burgundy)' }} aria-hidden="true" />
                    <span className="lux-title text-[1.35rem]">{c.title}</span>
                    <span className="text-[0.95rem] font-medium tabular-nums">{c.detail}</span>
                    <span className="text-soft text-[0.78rem]">{c.note}</span>
                    <span className="mt-auto pt-2 text-[0.7rem] font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--c-burgundy)' }}>
                      {c.action} <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </a>
                </Reveal>
              ))}
              <Reveal delay={channels.length * 0.08} className="h-full">
                <div className="chrome-block flex h-full flex-col gap-3 p-6">
                  <CalendarCheck size={22} strokeWidth={1.4} style={{ color: 'var(--c-champagne)' }} aria-hidden="true" />
                  <span className="lux-title text-[1.35rem]" style={{ color: 'var(--c-on-sage)' }}>Visit the showroom</span>
                  <span className="text-[0.82rem] leading-relaxed" style={{ color: 'var(--c-on-chrome-soft)' }}>
                    Pick a time and we will have your pieces waiting.
                  </span>
                  <div className="mt-auto pt-2">
                    <BookVisitButton tone="light" label="Book a visit" />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section aria-label="Send a message and showroom details" className="pt-20 md:pt-28">
          <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-7">
              <ContactForm />
            </Reveal>

            <div className="flex flex-col gap-10 lg:col-span-5">
              <Reveal delay={0.1}>
                <p className="lux-eyebrow">The Showroom</p>
                <dl className="mt-6 flex flex-col gap-5 text-[0.9rem]">
                  <div className="flex gap-3">
                    <MapPin size={18} strokeWidth={1.5} className="mt-0.5 shrink-0" style={{ color: 'var(--c-burgundy)' }} aria-hidden="true" />
                    <div>
                      <dt className="sr-only">Address</dt>
                      <dd className="leading-relaxed">{STORE_ADDRESS_ONE_LINE}</dd>
                      <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="lux-link mt-2">Directions</a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Clock size={18} strokeWidth={1.5} className="mt-0.5 shrink-0" style={{ color: 'var(--c-burgundy)' }} aria-hidden="true" />
                    <div>
                      <dt className="sr-only">Hours</dt>
                      <dd>{STORE.hours}</dd>
                    </div>
                  </div>
                </dl>
              </Reveal>

              <Reveal delay={0.15}>
                <p className="lux-eyebrow">Quick Answers</p>
                <div className="mt-4">
                  {FAQS.map((f) => (
                    <details key={f.q} className="group border-t py-4" style={{ borderColor: 'var(--c-border)' }}>
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                        <span className="lux-title text-[1.15rem]">{f.q}</span>
                        <span aria-hidden="true" className="text-[1.2rem] leading-none transition-transform group-open:rotate-45" style={{ color: 'var(--c-burgundy)' }}>
                          +
                        </span>
                      </summary>
                      <p className="lux-body mt-3 text-[0.86rem]">{f.a}</p>
                    </details>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
