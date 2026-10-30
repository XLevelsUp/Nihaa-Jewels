// Every gold service the house offers as four numbered text columns under a gold rule, each leading to its page and from there to an appointment.

import Link from 'next/link';

import Reveal from '@/components/ui/Reveal';

const SERVICES: { eyebrow: string; title: string; body: string; cta: string; href: string }[] = [
  {
    eyebrow: 'Made to Order',
    title: 'Bespoke Commissions',
    body: 'Bring a sketch, an heirloom or only an idea. We will draw it, weigh it and make it at our own bench.',
    cta: 'Begin a commission',
    href: '/custom-design',
  },
  {
    eyebrow: 'Old for New',
    title: 'Gold Exchange',
    body: 'Bring old gold to be tested in front of you and valued at the day’s rate against something new.',
    cta: 'Ask about exchange',
    href: '/contact',
  },
  {
    eyebrow: 'For Someone Else',
    title: 'The Art of Gifting',
    body: 'Birthdays, anniversaries, a first piece of gold. We will help you choose, and wrap it properly.',
    cta: 'Explore gifting',
    href: '/gifting',
  },
  {
    eyebrow: 'For Life',
    title: 'Care & Restoration',
    body: 'Cleaning, polishing, resizing and clasp repairs, for Sakthi pieces and the family gold you already own.',
    cta: 'Caring for gold',
    href: '/care-guide',
  },
];

export default function MadeForYou() {
  return (
    <section aria-labelledby="services-heading" className="surface-page pt-24 md:pt-36">
      <div className="container-wide">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <p className="lux-eyebrow">Services</p>
          <h2 id="services-heading" className="lux-display mt-4" style={{ fontSize: 'clamp(2.1rem, 4.4vw, 3.6rem)' }}>
            Everything gold, <em>under one roof</em>
          </h2>
        </Reveal>

        <ul className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 0.08} className="h-full">
                <Link
                  href={s.href}
                  className="group flex h-full flex-col border-t pt-8"
                  style={{ borderColor: 'var(--c-border-firm)' }}
                >
                  <span className="lux-display text-[clamp(2.4rem,3.4vw,3rem)] leading-none" style={{ color: 'var(--c-gold-ink)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="lux-eyebrow mt-8">{s.eyebrow}</p>
                  <h3 className="lux-title mt-3 text-[clamp(1.4rem,2vw,1.75rem)]">{s.title}</h3>
                  <p className="lux-body mt-3 flex-1 text-[0.88rem]">{s.body}</p>
                  <span className="lux-link mt-6 self-start">{s.cta}</span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
