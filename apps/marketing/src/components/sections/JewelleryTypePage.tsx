// Landing page for one of the three things Sakthi Chains sells (gold, silver, diamond): hero, today's rates or certificate promises, honest intro, the filtered catalogue, the other two types, and FAQs with their structured data.

import Link from 'next/link';
import { BadgeCheck, Gem, Scale, ShieldCheck } from 'lucide-react';

import Navigation from '@/components/sections/NavigationServer';
import Footer from '@/components/sections/Footer';
import VisitUs from '@/components/sections/VisitUs';
import CatalogueBrowser from '@/components/catalogue/CatalogueBrowser';
import ImageSlot from '@/components/ui/ImageSlot';
import Reveal from '@/components/ui/Reveal';
import BookVisitButton from '@/components/ui/BookVisitButton';
import { getCategories, getCurrentRates, getCurrentSilverRates, getProducts, type PricedProduct } from '@/lib/catalogue';
import { applyFilters, buildFilterGroups, type BrowseParams } from '@/lib/browse';
import { homeSlot, typeSlot } from '@/lib/imageSlots';
import { INDICATIVE_PRICE_DISCLAIMER, formatRupees } from '@/lib/pricing';
import { JEWELLERY_TYPES, TYPE_ORDER, typeOf, type JewelleryType } from '@/constants/jewelleryTypes';
import { SITE_URL } from '@/constants/store';
import type { Category } from '@/types/database';

interface Highlight {
  icon: React.ReactNode;
  label: string;
  value: string;
}

async function highlightsFor(type: JewelleryType): Promise<Highlight[]> {
  const iconProps = { size: 18, strokeWidth: 1.4, 'aria-hidden': true } as const;
  if (type === 'diamond') {
    return [
      { icon: <BadgeCheck {...iconProps} />, label: 'Certificate', value: 'With every diamond piece' },
      { icon: <Gem {...iconProps} />, label: 'Set in', value: 'BIS hallmarked gold' },
      { icon: <ShieldCheck {...iconProps} />, label: 'Price', value: 'Confirmed at the showroom' },
    ];
  }
  const rates = await (type === 'gold' ? getCurrentRates() : getCurrentSilverRates()).catch(() => ({}) as Record<string, number>);
  const keys = type === 'gold' ? ['22K', '18K', '24K'] : ['925', '999'];
  const live = keys
    .filter((k) => (rates as Record<string, number>)[k])
    .map((k) => ({
      icon: <Scale {...iconProps} />,
      label: type === 'gold' ? `${k} today` : `${k} silver today`,
      value: `${formatRupees((rates as Record<string, number>)[k])} / g`,
    }));
  return live.length > 0
    ? live
    : [{ icon: <Scale {...iconProps} />, label: 'Today’s rate', value: 'Call us for today’s rate' }];
}

export default async function JewelleryTypePage({ type, searchParams }: { type: JewelleryType; searchParams: BrowseParams }) {
  const spec = JEWELLERY_TYPES[type];

  let all: PricedProduct[] = [];
  let categories: Category[] = [];
  try {
    const [products, cats] = await Promise.all([getProducts(), getCategories()]);
    all = products.filter((p) => typeOf(p) === type);
    categories = cats;
  } catch (error) {
    console.error(`[${type}-jewellery] Failed to load the catalogue:`, error);
  }

  const products = applyFilters(all, { ...searchParams, type }, categories);
  const groups = buildFilterGroups(all, categories, { withType: false });
  const highlights = await highlightsFor(type);
  const others = TYPE_ORDER.filter((t) => t !== type).map((t) => JEWELLERY_TYPES[t]);

  const url = `${SITE_URL}${spec.path}`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#page`,
        name: `${spec.title} at Sakthi Chains, Coimbatore`,
        description: spec.metaDescription,
        url,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: all.length,
          itemListElement: all.slice(0, 30).map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: p.name,
            url: `${SITE_URL}/collections/${p.category?.slug ?? 'all'}/${p.slug}`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: spec.title, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: spec.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  };

  const emptyMessage =
    all.length === 0
      ? `Our ${spec.label.toLowerCase()} range is at the showroom and is being photographed for the website. Book a visit, call or WhatsApp us, and we will show you what is in store.`
      : 'No designs match these filters. Remove one, or book a visit and we will show you what is in the showroom.';

  return (
    <div className="landing-bg min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Navigation />

      <main>
        <section aria-labelledby="type-heading" className="container-wide pt-8 md:pt-12">
          <nav aria-label="Breadcrumb" className="text-soft text-[0.72rem] uppercase tracking-[0.18em]">
            <Link href="/" className="hover:text-[var(--c-burgundy)]">Home</Link>
            <span aria-hidden="true" className="mx-2">/</span>
            <span aria-current="page" style={{ color: 'var(--c-text)' }}>{spec.title}</span>
          </nav>

          <div className="mt-6 grid grid-cols-1 gap-8 md:mt-8 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="relative order-1 aspect-[4/3] overflow-hidden sm:aspect-[16/9] lg:order-2 lg:col-span-7" style={{ background: 'var(--c-icing)' }}>
              <ImageSlot slot={typeSlot(spec.hero)} sizes="(max-width: 1024px) 100vw, 58vw" priority />
            </div>

            <Reveal className="order-2 lg:order-1 lg:col-span-5">
              <p className="lux-eyebrow">{spec.eyebrow}</p>
              <h1 id="type-heading" className="lux-display mt-4" style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.6rem)' }}>
                {spec.headline} <em>{spec.accent}</em>
              </h1>
              <p className="lux-body mt-6">{spec.intro[0]}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#designs" className="lux-button">See the designs</a>
                <BookVisitButton tone="ghost" />
              </div>
            </Reveal>
          </div>

          <ul className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label={type === 'diamond' ? 'Our promise' : 'Today’s rates'}>
            {highlights.map((h) => (
              <li
                key={h.label}
                className="flex min-h-16 items-center gap-4 px-4 py-3"
                style={{ border: '1px solid var(--c-border)', background: 'var(--c-product-card)' }}
              >
                <span style={{ color: 'var(--c-burgundy)' }}>{h.icon}</span>
                <span>
                  <span className="text-soft block text-[0.66rem] uppercase tracking-[0.2em]">{h.label}</span>
                  <span className="block text-[0.95rem] font-medium tabular-nums">{h.value}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12">
            {spec.intro.slice(1).map((para) => (
              <p key={para.slice(0, 24)} className="lux-body">{para}</p>
            ))}
          </div>
        </section>

        <section id="designs" aria-label={`${spec.title} designs`} className="container-wide scroll-mt-24 pt-16 md:pt-24">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="lux-display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}>The {spec.label.toLowerCase()} designs</h2>
            <p className="text-soft text-[0.82rem]">
              {all.length} {all.length === 1 ? 'design' : 'designs'} online · more at the showroom
            </p>
          </div>
          <CatalogueBrowser products={products} groups={groups} emptyMessage={emptyMessage} />
          {products.length > 0 && type !== 'diamond' && (
            <p className="text-soft mt-12 text-[0.72rem]">{INDICATIVE_PRICE_DISCLAIMER}</p>
          )}
        </section>

        <section aria-labelledby="other-types" className="container-wide pt-16 md:pt-24">
          <h2 id="other-types" className="lux-eyebrow">Also at Sakthi Chains</h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            {others.map((o) => (
              <li key={o.type}>
                <Link href={o.path} className="group grid grid-cols-[96px_1fr] items-center gap-4 p-3 sm:grid-cols-[128px_1fr] sm:gap-6" style={{ border: '1px solid var(--c-border)' }}>
                  <div className="relative aspect-[4/5] overflow-hidden" style={{ background: 'var(--c-icing)' }}>
                    <ImageSlot slot={typeSlot(o.card)} sizes="128px" className="transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <span>
                    <span className="lux-title block text-[1.25rem]">{o.title}</span>
                    <span className="text-soft mt-1 block text-[0.82rem]">{o.eyebrow}</span>
                    <span className="lux-link mt-4 !min-h-10 !px-4">Explore</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="type-faq" className="container-page pt-16 md:pt-24">
          <h2 id="type-faq" className="lux-display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}>
            {spec.label} jewellery: <em>your questions</em>
          </h2>
          <div className="mt-8">
            {spec.faqs.map((f) => (
              <details key={f.q} className="group border-t py-4" style={{ borderColor: 'var(--c-border)' }}>
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                  <h3 className="lux-title text-[1.15rem]">{f.q}</h3>
                  <span aria-hidden="true" className="text-[1.2rem] leading-none transition-transform group-open:rotate-45" style={{ color: 'var(--c-burgundy)' }}>
                    +
                  </span>
                </summary>
                <p className="lux-body mt-3 text-[0.9rem]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <div className="pt-16 md:pt-24" />
      <VisitUs showroom={homeSlot('visitShowroom')} />
      <Footer />
    </div>
  );
}
