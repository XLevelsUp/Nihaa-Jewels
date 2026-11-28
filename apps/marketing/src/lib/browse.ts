// Filtering, sorting and filter-group counts shared by /collections and the gold, silver and diamond pages, so every listing behaves the same.

import type { FilterGroup, FilterOption } from '@/components/catalogue/CatalogueBrowser';
import { JEWELLERY_TYPES, TYPE_ORDER, isJewelleryType, purityText, purityValue, typeOf } from '@/constants/jewelleryTypes';
import { PRICE_BANDS, titleCase } from '@/constants/filters';
import { isPriceOnRequest } from '@/lib/pricing';
import type { PricedProduct } from '@/lib/catalogue';
import type { Category } from '@/types/database';

export type BrowseParams = Record<string, string | undefined>;

const PURITY_ORDER = ['22K', '18K', '24K', '925', '999'];

function priceOf(p: PricedProduct): number | null {
  return p.price && !isPriceOnRequest(p.price) ? p.price.total : null;
}

export function inCategoryTree(categories: Category[], c: Category, p: PricedProduct): boolean {
  return p.category_id === c.id || categories.some((k) => k.parent_id === c.id && k.id === p.category_id);
}

export function applyFilters(products: PricedProduct[], sp: BrowseParams, categories: Category[]): PricedProduct[] {
  const selected = categories.find((c) => c.slug === sp.category);
  const categoryIds = selected ? new Set([selected.id, ...categories.filter((c) => c.parent_id === selected.id).map((c) => c.id)]) : null;
  const band = PRICE_BANDS.find((b) => b.label === sp.price);
  const type = isJewelleryType(sp.type) ? sp.type : null;

  const filtered = products.filter((p) => {
    if (type && typeOf(p) !== type) return false;
    if (categoryIds && !categoryIds.has(p.category_id)) return false;
    if (sp.karat && purityValue(p) !== sp.karat) return false;
    if (sp.occasion && !(p.occasion ?? []).includes(sp.occasion)) return false;
    if (sp.gender && p.gender !== sp.gender && !(p.gender === 'unisex' && (sp.gender === 'women' || sp.gender === 'men'))) return false;
    if (band) {
      const total = priceOf(p);
      if (total == null) return false;
      if (band.min != null && total < band.min) return false;
      if (band.max != null && total > band.max) return false;
    }
    return true;
  });

  const price = (p: PricedProduct, empty: number) => priceOf(p) ?? empty;
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

export function buildFilterGroups(all: PricedProduct[], categories: Category[], { withType }: { withType: boolean }): FilterGroup[] {
  const countBy = (values: string[]): FilterOption[] =>
    [...new Set(values)].sort().map((v) => ({ value: v, label: titleCase(v), count: values.filter((x) => x === v).length }));

  const topLevel = categories
    .filter((c) => !c.parent_id)
    .map((c) => ({ value: c.slug, label: c.name, count: all.filter((p) => inCategoryTree(categories, c, p)).length }))
    .filter((o) => o.count > 0);

  const purities = all.map(purityValue).filter(Boolean) as string[];
  const purityOptions = PURITY_ORDER.filter((v) => purities.includes(v)).map((v) => ({
    value: v,
    label: purityText(v).replace(/^./, (c) => c.toUpperCase()),
    count: purities.filter((x) => x === v).length,
  }));

  const types = TYPE_ORDER.map((t) => ({ value: t, label: JEWELLERY_TYPES[t].label, count: all.filter((p) => typeOf(p) === t).length })).filter(
    (o) => o.count > 0,
  );

  return [
    ...(withType ? [{ key: 'type', label: 'Type', options: types.length > 1 ? types : [] }] : []),
    { key: 'category', label: 'Category', options: topLevel },
    {
      key: 'price',
      label: 'Price',
      options: PRICE_BANDS.map((b) => ({
        value: b.label,
        label: b.label,
        count: all.filter((p) => {
          const total = priceOf(p);
          return total != null && (b.min == null || total >= b.min) && (b.max == null || total <= b.max);
        }).length,
      })).filter((o) => o.count > 0),
    },
    { key: 'karat', label: 'Purity', options: purityOptions.length > 1 ? purityOptions : [] },
    { key: 'occasion', label: 'Occasion', options: countBy(all.flatMap((p) => p.occasion ?? [])) },
    { key: 'gender', label: 'Worn by', options: countBy(all.map((p) => p.gender).filter(Boolean) as string[]) },
  ];
}
