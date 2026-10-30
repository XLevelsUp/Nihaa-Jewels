'use client';

// Desktop: a sticky filter sidebar beside the grid; phones: a Filters button opens the same panel as a bottom sheet. Filters live in the URL so a view can be shared.

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Drawer } from '@mui/material';
import { SlidersHorizontal, X } from 'lucide-react';

import ProductGrid from './ProductGrid';
import { SORTS } from '@/constants/filters';
import type { PricedProduct } from '@/lib/catalogue';

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

export interface FilterGroup {
  key: string;
  label: string;
  options: FilterOption[];
}

interface CatalogueBrowserProps {
  products: PricedProduct[];
  groups: FilterGroup[];
  emptyMessage: string;
}

export default function CatalogueBrowser({ products, groups, emptyMessage }: CatalogueBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);

  const push = (next: URLSearchParams) => {
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    push(next);
  };

  const active = groups.flatMap((g) => {
    const value = params.get(g.key);
    const option = value ? g.options.find((o) => o.value === value) : undefined;
    return option ? [{ key: g.key, label: option.label }] : [];
  });

  const clearAll = () => {
    const next = new URLSearchParams();
    const sort = params.get('sort');
    if (sort) next.set('sort', sort);
    push(next);
  };

  const panel = (
    <div className="flex flex-col">
      {groups.map((g) =>
        g.options.length === 0 ? null : (
          <fieldset key={g.key} className="border-t py-6 first:border-t-0 first:pt-0" style={{ borderColor: 'var(--c-border)' }}>
            <legend className="lux-eyebrow mb-4 block" style={{ letterSpacing: '0.24em' }}>{g.label}</legend>
            <ul className="flex flex-col gap-1">
              {g.options.map((o) => {
                const selected = params.get(g.key) === o.value;
                return (
                  <li key={o.value}>
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => set(g.key, selected ? '' : o.value)}
                      className="group flex min-h-9 w-full items-center gap-3 text-left text-[0.86rem] transition-colors"
                      style={{ color: selected ? 'var(--c-burgundy)' : 'var(--c-text)' }}
                    >
                      <span
                        aria-hidden="true"
                        className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full border transition-colors"
                        style={{ borderColor: selected ? 'var(--c-burgundy)' : 'var(--c-border-firm)' }}
                      >
                        {selected && <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--c-burgundy)' }} />}
                      </span>
                      <span className={`flex-1 ${selected ? 'font-semibold' : 'group-hover:text-[var(--c-burgundy)]'}`}>{o.label}</span>
                      <span className="text-soft text-[0.72rem] tabular-nums">{o.count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        ),
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr] xl:gap-14">
      <aside aria-label="Filters" className="hidden lg:block">
        <div className="sticky top-24">{panel}</div>
      </aside>

      <div>
        <div className="mb-8 flex flex-wrap items-center gap-3 border-b pb-4" style={{ borderColor: 'var(--c-border)' }}>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="inline-flex min-h-10 items-center gap-2 border px-4 text-[0.7rem] font-medium uppercase tracking-[0.2em] lg:hidden"
            style={{ borderColor: 'var(--c-border-firm)', color: 'var(--c-text)' }}
          >
            <SlidersHorizontal size={14} strokeWidth={1.5} aria-hidden="true" />
            Filters{active.length > 0 && ` (${active.length})`}
          </button>

          <div className="hidden flex-wrap items-center gap-2 lg:flex">
            {active.map((a) => (
              <button
                key={a.key}
                type="button"
                onClick={() => set(a.key, '')}
                aria-label={`Remove filter ${a.label}`}
                className="inline-flex min-h-8 items-center gap-1.5 px-3 text-[0.74rem]"
                style={{ background: 'var(--c-icing)', color: 'var(--c-text)' }}
              >
                {a.label}
                <X size={12} aria-hidden="true" />
              </button>
            ))}
            {active.length > 1 && (
              <button type="button" onClick={clearAll} className="px-2 text-[0.74rem] underline underline-offset-4" style={{ color: 'var(--c-burgundy)' }}>
                Clear all
              </button>
            )}
          </div>

          <span className="text-soft ml-auto text-[0.78rem] tabular-nums">
            {products.length} {products.length === 1 ? 'design' : 'designs'}
          </span>

          <label className="flex items-center gap-2 text-[0.78rem]">
            <span className="text-soft hidden sm:inline">Sort</span>
            <select
              value={params.get('sort') ?? ''}
              onChange={(e) => set('sort', e.target.value)}
              className="min-h-10 cursor-pointer border bg-transparent px-3 text-[0.8rem]"
              style={{ borderColor: 'var(--c-border-firm)', color: 'var(--c-text)' }}
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>

        <ProductGrid products={products} emptyMessage={emptyMessage} withSidebar />
      </div>

      <Drawer
        anchor="bottom"
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        PaperProps={{ sx: { maxHeight: '85vh', bgcolor: 'var(--c-page)', borderTopLeftRadius: 12, borderTopRightRadius: 12 } }}
      >
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'var(--c-border)' }}>
          <p className="lux-title text-[1.3rem]">Filters</p>
          <button type="button" onClick={() => setSheetOpen(false)} aria-label="Close filters" className="grid h-10 w-10 place-items-center">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-6">{panel}</div>
        <div className="flex gap-3 border-t px-5 py-4" style={{ borderColor: 'var(--c-border)' }}>
          {active.length > 0 && (
            <button type="button" onClick={clearAll} className="lux-button lux-button-ghost flex-1">Clear</button>
          )}
          <button type="button" onClick={() => setSheetOpen(false)} className="lux-button flex-[2]">
            Show {products.length} {products.length === 1 ? 'design' : 'designs'}
          </button>
        </div>
      </Drawer>
    </div>
  );
}
