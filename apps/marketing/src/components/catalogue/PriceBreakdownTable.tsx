// GRT-style price breakup for gold and silver, or a "Price on request" card with booking actions.

import BookAppointmentButton from './BookAppointmentButton';
import { formatRupees, INDICATIVE_PRICE_DISCLAIMER, isPriceOnRequest, type PriceResult } from '@/lib/pricing';

interface PriceBreakdownTableProps {
  price: PriceResult;
  netWeightG: number;
  productId?: string | null;
  productName?: string;
}

export default function PriceBreakdownTable({ price, netWeightG, productId, productName }: PriceBreakdownTableProps) {
  const cardStyle = {
    border: '1px solid color-mix(in srgb, var(--c-burgundy) 14%, transparent)',
    background: 'var(--c-product-card)',
  };

  if (isPriceOnRequest(price)) {
    return (
      <section aria-labelledby="price-breakup" className="p-5 md:p-6" style={cardStyle}>
        <h2 id="price-breakup" className="lux-eyebrow mb-3" style={{ letterSpacing: '0.22em' }}>Price Breakup</h2>
        <p className="text-[1.2rem] font-semibold" style={{ color: 'var(--c-burgundy)' }}>Price on request</p>
        <p className="text-soft mt-1 mb-4 text-[0.8rem] leading-relaxed">
          Book a showroom visit or message us on WhatsApp for the current price and certificate details.
        </p>
        <BookAppointmentButton productId={productId} productName={productName} />
      </section>
    );
  }

  const discounted = price.discount > 0;
  const originalGst = price.originalTotal - price.originalSubtotal;
  const metalLabel = price.purityLabel.charAt(0).toUpperCase() + price.purityLabel.slice(1);

  const rows: { label: string; hint?: string; value: number; discount: number }[] = [
    { label: metalLabel, hint: `${netWeightG} g × ${formatRupees(price.ratePerGram)}/g`, value: price.metalCost, discount: 0 },
  ];
  if (price.diamondValue > 0) rows.push({ label: 'Diamond value', value: price.diamondValue, discount: 0 });
  rows.push(
    { label: 'Wastage', value: price.wastageCost, discount: price.wastageDiscount },
    { label: 'Making charges', value: price.makingCharges, discount: price.makingDiscount },
  );
  if (price.stoneCharges > 0) rows.push({ label: 'Stones', value: price.stoneCharges, discount: 0 });
  if (price.hallmarkCharges > 0) rows.push({ label: 'Hallmarking', value: price.hallmarkCharges, discount: 0 });

  const cell = 'py-2.5 text-right tabular-nums whitespace-nowrap';
  const rule = { borderTop: '1px solid color-mix(in srgb, var(--c-burgundy) 12%, transparent)' };

  return (
    <section aria-labelledby="price-breakup" className="p-5 md:p-6" style={cardStyle}>
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
