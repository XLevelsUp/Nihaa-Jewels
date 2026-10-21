// GRT-style price breakup: each component's value, any discount on it and the final value, then GST on the discounted subtotal and the grand total.

import { formatRupees, INDICATIVE_PRICE_DISCLAIMER, type PriceBreakdown } from '@/lib/pricing';

interface PriceBreakdownTableProps {
  price: PriceBreakdown;
  netWeightG: number;
  karat: string;
}

export default function PriceBreakdownTable({ price, netWeightG, karat }: PriceBreakdownTableProps) {
  const discounted = price.discount > 0;
  const originalGst = price.originalTotal - price.originalSubtotal;

  const rows: { label: string; hint?: string; value: number; discount: number }[] = [
    { label: `Gold (${karat})`, hint: `${netWeightG} g × ${formatRupees(price.ratePerGram)}/g`, value: price.metalCost, discount: 0 },
    { label: 'Wastage', value: price.wastageCost, discount: price.wastageDiscount },
    { label: 'Making charges', value: price.makingCharges, discount: price.makingDiscount },
  ];
  if (price.stoneCharges > 0) rows.push({ label: 'Stones', value: price.stoneCharges, discount: 0 });
  if (price.hallmarkCharges > 0) rows.push({ label: 'Hallmarking', value: price.hallmarkCharges, discount: 0 });

  const cell = 'py-2.5 text-right tabular-nums whitespace-nowrap';
  const rule = { borderTop: '1px solid color-mix(in srgb, var(--c-burgundy) 12%, transparent)' };

  return (
    <section aria-labelledby="price-breakup" className="p-5 md:p-6" style={{ border: '1px solid color-mix(in srgb, var(--c-burgundy) 14%, transparent)', background: 'var(--c-product-card)' }}>
      <h2 id="price-breakup" className="lux-eyebrow mb-4" style={{ letterSpacing: '0.22em' }}>Price Breakup</h2>

      <table className="w-full border-collapse text-[0.8rem]">
        <thead>
          <tr className="text-soft text-[0.62rem] uppercase tracking-[0.14em]">
            <th scope="col" className="pb-2 text-left font-medium">Component</th>
            <th scope="col" className="pb-2 text-right font-medium">Value</th>
            {discounted && <th scope="col" className="pb-2 pl-3 text-right font-medium">Discount</th>}
            {discounted && <th scope="col" className="pb-2 pl-3 text-right font-medium">Final</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} style={rule}>
              <th scope="row" className="py-2.5 pr-3 text-left font-normal">
                {r.label}
                {r.hint && <span className="text-soft block text-[0.66rem]">{r.hint}</span>}
              </th>
              <td className={cell}>{formatRupees(r.value)}</td>
              {discounted && (
                <td className={`${cell} pl-3`} style={{ color: r.discount > 0 ? 'var(--c-burgundy)' : undefined }}>
                  {r.discount > 0 ? `− ${formatRupees(r.discount)}` : '–'}
                </td>
              )}
              {discounted && <td className={`${cell} pl-3`}>{formatRupees(r.value - r.discount)}</td>}
            </tr>
          ))}
          <tr style={rule} className="font-medium">
            <th scope="row" className="py-2.5 text-left">Subtotal</th>
            <td className={cell}>{formatRupees(price.originalSubtotal)}</td>
            {discounted && <td className={`${cell} pl-3`} style={{ color: 'var(--c-burgundy)' }}>− {formatRupees(price.discount)}</td>}
            {discounted && <td className={`${cell} pl-3`}>{formatRupees(price.subtotal)}</td>}
          </tr>
          <tr style={rule}>
            <th scope="row" className="py-2.5 text-left font-normal">GST (3%)</th>
            <td className={cell}>{formatRupees(discounted ? originalGst : price.gst)}</td>
            {discounted && <td className={`${cell} pl-3`} />}
            {discounted && <td className={`${cell} pl-3`}>{formatRupees(price.gst)}</td>}
          </tr>
        </tbody>
      </table>

      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2 pt-4" style={{ borderTop: '1px solid color-mix(in srgb, var(--c-burgundy) 30%, transparent)' }}>
        <span className="text-[0.68rem] font-medium uppercase tracking-[0.16em]" style={{ color: 'var(--c-burgundy)' }}>Grand total</span>
        <span className="flex items-baseline gap-2 tabular-nums">
          {discounted && <s className="text-soft text-[0.9rem]">{formatRupees(price.originalTotal)}</s>}
          <span className="text-[1.4rem] font-semibold" style={{ color: 'var(--c-burgundy)' }}>{formatRupees(price.total)}</span>
        </span>
      </div>

      {discounted && (
        <p className="mt-2 text-right text-[0.78rem] font-medium" style={{ color: 'var(--c-burgundy)' }}>
          You save {formatRupees(price.originalTotal - price.total)} ({price.percentOff}% off)
        </p>
      )}

      <p className="text-soft mt-4 pt-4 text-[0.66rem] leading-relaxed" style={rule}>{INDICATIVE_PRICE_DISCLAIMER}</p>
    </section>
  );
}
