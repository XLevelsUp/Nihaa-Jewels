// The 404 page: says plainly the page is gone, then offers the collections so a lost visitor keeps browsing instead of leaving.

import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle, Phone } from 'lucide-react';

import ImageSlot from '@/components/ui/ImageSlot';
import BookVisitButton from '@/components/ui/BookVisitButton';
import { getNavCategories, type NavCategory } from '@/lib/catalogue';
import { STORE } from '@/constants/store';

export const metadata: Metadata = {
  title: 'Page not found',
  description: `This page could not be found. Explore ${STORE.name}'s gold necklaces, chains, bangles and earrings, or book a visit to our Coimbatore showroom.`,
  robots: { index: false, follow: true },
};

const WHATSAPP_HREF = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(`Hello ${STORE.name}, I was looking for a piece on your website.`)}`;

export default async function NotFound() {
  // A lost visitor still gets a usable page if the catalogue cannot be reached.
  let categories: NavCategory[] = [];
  try {
    categories = await getNavCategories();
  } catch {
    /* fall through with no collections strip */
  }

  return (
    <div className="landing-bg flex min-h-screen flex-col">
      {/* No header or footer here: just the mark, linking home, so the page stays branded without the full chrome. */}
      <Link href="/" aria-label={`${STORE.name}, home`} className="mx-auto mt-8 flex items-center gap-2.5 md:mt-10">
        <img src="/images/brand/logo-amber.png" alt="" width={34} height={34} className="h-[34px] w-[34px]" />
        <span className="lux-title text-[1.05rem] font-bold uppercase tracking-[0.16em]" style={{ color: 'var(--c-burgundy)' }}>
          {STORE.name}
        </span>
      </Link>

      <main className="flex flex-1 flex-col justify-center">
        <section aria-labelledby="nf-heading" className="pt-10 md:pt-14">
          <div className="container-page flex flex-col items-center text-center">
            <p
              aria-hidden="true"
              className="lux-display select-none leading-none"
              style={{
                fontSize: 'clamp(6rem, 18vw, 12rem)',
                fontWeight: 300,
                color: 'transparent',
                WebkitTextStroke: '1px var(--c-gold-ink)',
              }}
            >
              404
            </p>
            <p className="lux-eyebrow mt-4">Page not found</p>
            <h1 id="nf-heading" className="lux-display mt-4" style={{ fontSize: 'clamp(2rem, 4.4vw, 3.4rem)' }}>
              This piece has <em>slipped away</em>
            </h1>
            <p className="lux-body mx-auto mt-5 text-center">
              The page you were looking for has moved, sold or never existed. Every piece we make is still waiting in
              the collection, and our showroom is always happy to help.
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
              <Link href="/collections" className="lux-button">Browse the collection</Link>
              <BookVisitButton tone="ghost" />
            </div>
            <Link href="/" className="lux-link mt-4">Back to the homepage</Link>
          </div>
        </section>

        {categories.length > 0 && (
          <section aria-labelledby="nf-collections" className="pt-20 md:pt-28">
            <div className="container-wide">
              <h2 id="nf-collections" className="lux-eyebrow mb-6 text-center">Or start with a collection</h2>
              <ul className="mx-auto grid max-w-4xl grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4 md:gap-x-5">
                {categories.slice(0, 4).map((c) => (
                  <li key={c.slug}>
                    <Link href={`/collections/${c.slug}`} className="group block">
                      <div className="relative aspect-square overflow-hidden" style={{ background: 'var(--c-icing)' }}>
                        <ImageSlot
                          slot={{
                            file: '',
                            label: c.name,
                            alt: `${c.name} collection`,
                            ratio: '1:1',
                            size: '800 × 800',
                            brief: '',
                            src: c.heroImagePath,
                          }}
                          sizes="(max-width: 640px) 50vw, 220px"
                          className="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                        />
                      </div>
                      <p className="lux-title mt-2.5 flex items-center justify-between text-[1.1rem] font-semibold">
                        {c.name}
                        <span aria-hidden="true" className="text-[0.85rem] transition-transform group-hover:translate-x-1" style={{ color: 'var(--c-burgundy)' }}>→</span>
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section aria-label="Contact" className="py-20 md:py-28">
          <div className="container-page flex flex-col items-center gap-3 text-center">
            <p className="lux-title text-[1.3rem]">Looking for something in particular?</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-[0.9rem]">
              <a href={STORE.phoneHref} className="inline-flex min-h-11 items-center gap-2 tabular-nums">
                <Phone size={15} strokeWidth={1.5} aria-hidden="true" /> {STORE.phone}
              </a>
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2">
                <MessageCircle size={15} strokeWidth={1.5} aria-hidden="true" /> WhatsApp us
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
