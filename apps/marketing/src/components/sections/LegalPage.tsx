// Shared shell for the privacy policy and terms, so both read in the site's own type and sit between the usual header and footer.

import Navigation from '@/components/sections/NavigationServer';
import Footer from '@/components/sections/Footer';
import { STORE, STORE_ADDRESS_ONE_LINE } from '@/constants/store';

export interface LegalSection {
  heading: string;
  body: React.ReactNode;
}

export default function LegalPage({ eyebrow, title, updated, intro, sections }: { eyebrow: string; title: string; updated: string; intro: string; sections: LegalSection[] }) {
  return (
    <div className="landing-bg min-h-screen">
      <Navigation />
      <article className="surface-page pt-32 pb-24 md:pt-44 md:pb-36">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <header className="text-center">
            <p className="lux-eyebrow">{eyebrow}</p>
            <h1 className="lux-display mt-4" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)' }}>{title}</h1>
            <p className="mt-4 text-[0.78rem] uppercase tracking-[0.2em]" style={{ color: 'var(--c-text-muted, inherit)' }}>Last updated {updated}</p>
            <p className="lux-body mx-auto mt-8 text-center">{intro}</p>
          </header>

          <hr className="lux-rule my-14" />

          <div className="space-y-12">
            {sections.map((s, i) => (
              <section key={s.heading} aria-labelledby={`legal-${i}`}>
                <h2 id={`legal-${i}`} className="lux-title text-[1.35rem]">
                  <span className="mr-3" style={{ color: 'var(--c-champagne)' }}>{String(i + 1).padStart(2, '0')}</span>
                  {s.heading}
                </h2>
                <div className="lux-body mt-4 space-y-3">{s.body}</div>
              </section>
            ))}
          </div>

          <hr className="lux-rule my-14" />

          <address className="not-italic text-center lux-body">
            {STORE.name}, {STORE_ADDRESS_ONE_LINE}
            <br />
            Call or WhatsApp <a href={STORE.phoneHref} style={{ textDecoration: 'underline', textUnderlineOffset: '4px' }}>{STORE.phone}</a>
          </address>
        </div>
      </article>
      <Footer />
    </div>
  );
}
