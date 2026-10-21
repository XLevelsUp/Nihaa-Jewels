// Every active piece on one page with the filters above it, so browsing starts with jewellery rather than a choice of folders; filters live in the URL.

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import Navigation from '@/components/sections/NavigationServer';
import Footer from '@/components/sections/Footer';
import VisitUs from '@/components/sections/VisitUs';
import CatalogueBrowser, { type FilterGroup, type FilterOption } from '@/components/catalogue/CatalogueBrowser';
import { getCategories, getCategoryBySlug, getProducts, type PricedProduct } from '@/lib/catalogue';
import { homeSlot } from '@/lib/imageSlots';
import { INDICATIVE_PRICE_DISCLAIMER } from '@/lib/pricing';
import { productImageUrl } from '@/lib/supabase';
import { AUDIENCES, PRICE_BANDS, isAudience, titleCase } from '@/constants/filters';
import type { Category } from '@/types/database';

type Params = Record<string, string | undefined>;

interface PageProps {
  searchParams: Promise<Params>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { gender, category } = await searchParams;
  if (isAudience(gender)) {
    const a = AUDIENCES[gender];
    return { title: a.heading, description: a.blurb };
  }
  // A filtered view points search engines at the category's own page rather than competing with it.
  const selected = category ? await getCategoryBySlug(category).catch(() => null) : null;
  if (selected) {
    return {
      title: selected.meta_title ?? selected.name,
      description: selected.meta_description ?? selected.description ?? undefined,
      alternates: { canonical: `/collections/${selected.slug}` },
    };
  }
  return {
    title: 'All Jewellery',
    description:
      'Browse every Sakthi Chains piece in one place: necklaces, chains, bangles and earrings in BIS hallmarked gold, filtered by purity, occasion and price.',
    alternates: { canonical: '/collections' },
  };
}

export const revalidate = 3600;

function applyFilters(products: PricedProduct[], sp: Params, categories: Category[]): PricedProduct[] {
  const selected = categories.find((c) => c.slug === sp.category);
  // A parent includes its sub-categories, matching the category pages.
  const categoryIds = selected ? new Set([selected.id, ...categories.filter((c) => c.parent_id === selected.id).map((c) => c.id)]) : null;
  const band = PRICE_BANDS.find((b) => b.label === sp.price);

  const filtered = products.filter((p) => {
    if (categoryIds && !categoryIds.has(p.category_id)) return false;
    if (sp.karat && p.karat !== sp.karat) return false;
    if (sp.occasion && !(p.occasion ?? []).includes(sp.occasion)) return false;
    // Unisex pieces suit everyone, so they appear under women and men too.
    if (sp.gender && p.gender !== sp.gender && !(p.gender === 'unisex' && (sp.gender === 'women' || sp.gender === 'men'))) return false;
    if (band) {
      if (!p.price) return false;
      if (band.min != null && p.price.total < band.min) return false;
      if (band.max != null && p.price.total > band.max) return false;
    }
    return true;
  });

  // Unpriced pieces sink to the end of a price sort rather than reading as ₹0.
  const price = (p: PricedProduct, empty: number) => p.price?.total ?? empty;
  switch (sp.sort) {
    case 'price-asc':
      return filtered.sort((a, b) => price(a, Infinity) - price(b, Infinity));
    case 'price-desc':
      return filtered.sort((a, b) => price(b, -Infinity) - price(a, -Infinity));
    case 'newest':
      return filtered.sort((a, b) => b.created_at.localeCompare(a.created_at));
    default:
      return filtered.sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || b.created_at.localeCompare(a.created_at));
  }
}

export default async function CollectionsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const audience = isAudience(sp.gender) ? AUDIENCES[sp.gender] : null;

  let all: PricedProduct[] = [];
  let categories: Category[] = [];
  try {
    [all, categories] = await Promise.all([getProducts(), getCategories()]);
  } catch (error) {
    console.error('[collections] Failed to load the catalogue:', error);
  }

  const products = applyFilters(all, sp, categories);
  const inCategory = (c: Category, p: PricedProduct) =>
    p.category_id === c.id || categories.some((k) => k.parent_id === c.id && k.id === p.category_id);
  const topLevel = categories
    .filter((c) => !c.parent_id)
    .map((c) => ({ category: c, count: all.filter((p) => inCategory(c, p)).length }))
    .filter((c) => c.count > 0);

  const countBy = (values: string[]): FilterOption[] =>
    [...new Set(values)].sort().map((v) => ({ value: v, label: titleCase(v), count: values.filter((x) => x === v).length }));

  const groups: FilterGroup[] = [
    { key: 'category', label: 'Category', options: topLevel.map(({ category, count }) => ({ value: category.slug, label: category.name, count })) },
    {
      key: 'price',
      label: 'Price',
      options: PRICE_BANDS.map((b) => ({
        value: b.label,
        label: b.label,
        count: all.filter((p) => p.price && (b.min == null || p.price.total >= b.min) && (b.max == null || p.price.total <= b.max)).length,
      })).filter((o) => o.count > 0),
    },
    { key: 'karat', label: 'Purity', options: countBy(all.map((p) => p.karat)).map((o) => ({ ...o, label: o.value })) },
    { key: 'occasion', label: 'Occasion', options: countBy(all.flatMap((p) => p.occasion ?? [])) },
    { key: 'gender', label: 'Worn by', options: countBy(all.map((p) => p.gender).filter(Boolean) as string[]) },
  ];

  // Builds a link that changes only the category, keeping the visitor's other filters.
  const categoryHref = (slug: string | null) => {
    const next = new URLSearchParams(Object.entries(sp).filter(([k, v]) => k !== 'category' && v) as [string, string][]);
    if (slug) next.set('category', slug);
    const qs = next.toString();
    return qs ? `/collections?${qs}` : '/collections';
  };
  const selectedCategory = topLevel.find((c) => c.category.slug === sp.category)?.category;
  const heading = audience ? audience.heading : selectedCategory ? selectedCategory.name : 'All Jewellery';

  return (
    <div className="landing-bg min-h-screen">
      <Navigation />

      <main className="container-wide pb-8 pt-8 md:pt-12">
        <nav aria-label="Breadcrumb" className="text-soft text-[0.72rem] uppercase tracking-[0.18em]">
          <Link href="/" className="hover:text-[var(--c-burgundy)]">Home</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <span aria-current="page" style={{ color: 'var(--c-text)' }}>{heading}</span>
        </nav>

        <header className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <h1 className="lux-display" style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.8rem)' }}>{heading}</h1>
          <p className="text-soft text-[0.82rem]">
            {audience ? audience.blurb : `${all.length} ${all.length === 1 ? 'design' : 'designs'}, BIS hallmarked, made by hand`}
          </p>
        </header>

        {topLevel.length > 1 && (
          <ul aria-label="Shop by category" className="-mx-4 mt-8 flex gap-5 overflow-x-auto px-4 pb-2 md:mx-0 md:gap-8 md:px-0 [scrollbar-width:none]">
            {[{ slug: null, name: 'All', image: null as string | null }, ...topLevel.map(({ category }) => ({ slug: category.slug, name: category.name, image: category.hero_image_path }))].map((c) => {
              const active = (sp.category ?? null) === c.slug || (!c.slug && !selectedCategory);
              return (
                <li key={c.slug ?? 'all'} className="shrink-0">
                  <Link href={categoryHref(c.slug)} scroll={false} aria-current={active ? 'true' : undefined} className="group flex w-[72px] flex-col items-center gap-2.5 md:w-[84px]">
                    <span
                      className="relative grid h-[68px] w-[68px] place-items-center overflow-hidden rounded-full transition-shadow md:h-[80px] md:w-[80px]"
                      style={{ background: 'var(--c-icing)', boxShadow: active ? '0 0 0 2px var(--c-page), 0 0 0 3px var(--c-burgundy)' : '0 0 0 1px var(--c-border-firm)' }}
                    >
                      {c.image ? (
                        <Image src={productImageUrl(c.image)} alt="" fill sizes="84px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <span className="lux-title text-[1rem]" style={{ color: 'var(--c-burgundy)' }}>All</span>
                      )}
                    </span>
                    <span className="text-center text-[0.68rem] uppercase tracking-[0.16em]" style={{ color: active ? 'var(--c-burgundy)' : 'var(--c-text)', fontWeight: active ? 600 : 400 }}>
                      {c.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-10 md:mt-12">
          <CatalogueBrowser
            products={products}
            groups={groups}
            emptyMessage={
              all.length === 0
                ? 'The collection is being curated and will be unveiled shortly.'
                : 'No designs match these filters. Remove one, or book a visit and we will show you what is in the showroom.'
            }
          />
        </div>

        {products.length > 0 && <p className="text-soft mt-12 text-[0.72rem]">{INDICATIVE_PRICE_DISCLAIMER}</p>}
      </main>

      <VisitUs showroom={homeSlot('visitShowroom')} />
      <Footer />
    </div>
  );
}
