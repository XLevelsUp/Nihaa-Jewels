// Pure — no I/O. Prices are indicative estimates, never offers. See docs/e-catalogue-plan.md.

export type Karat = '18K' | '22K' | '24K';
export type MakingChargeType = 'per_gram' | 'flat' | 'percentage';
export type DiscountType = 'percentage' | 'flat';

export const GST_RATE = 0.03;

export const INDICATIVE_PRICE_DISCLAIMER =
  'Indicative price based on today’s gold rate. Final price is confirmed in store.';

export interface PricingInput {
  netWeightG: number;
  karat: Karat;
  wastagePct: number;
  makingChargeType: MakingChargeType;
  makingChargeValue: number;
  stoneCharges: number;
  hallmarkCharges: number;
  /** Off wastage and making only, as a percent or a flat rupee amount; the gold value is never discounted. */
  discountType?: DiscountType;
  discountValue?: number;
}

export interface PriceBreakdown {
  ratePerGram: number;
  metalCost: number;
  wastageCost: number;
  makingCharges: number;
  stoneCharges: number;
  hallmarkCharges: number;
  wastageDiscount: number;
  makingDiscount: number;
  discount: number;
  originalSubtotal: number;
  originalTotal: number;
  /** Saving as a whole percent of the original total, as shown on the card; 0 when there is no discount. */
  percentOff: number;
  subtotal: number;
  gst: number;
  total: number;
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function assertFinite(value: number, label: string): void {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`pricing: ${label} must be a finite number, received ${value}`);
  }
}

export function calculatePrice(input: PricingInput, ratePerGram: number): PriceBreakdown {
  assertFinite(ratePerGram, 'ratePerGram');
  assertFinite(input.netWeightG, 'netWeightG');

  if (ratePerGram <= 0) {
    throw new RangeError(`pricing: ratePerGram must be positive, received ${ratePerGram}`);
  }
  if (input.netWeightG <= 0) {
    throw new RangeError(`pricing: netWeightG must be positive, received ${input.netWeightG}`);
  }

  const metalCost = input.netWeightG * ratePerGram;
  const wastageCost = metalCost * (input.wastagePct / 100);

  let makingCharges: number;
  switch (input.makingChargeType) {
    case 'per_gram':
      makingCharges = input.netWeightG * input.makingChargeValue;
      break;
    case 'flat':
      makingCharges = input.makingChargeValue;
      break;
    case 'percentage':
      makingCharges = metalCost * (input.makingChargeValue / 100);
      break;
    default: {
      const exhaustive: never = input.makingChargeType;
      throw new TypeError(`pricing: unknown making charge type ${String(exhaustive)}`);
    }
  }

  // GRT's convention: the discount comes off the value addition (wastage + making), GST is charged on what remains.
  const valueAdded = wastageCost + makingCharges;
  const raw = Number.isFinite(input.discountValue) ? Math.max(input.discountValue ?? 0, 0) : 0;
  // A flat amount is capped at the value addition and split across wastage and making in proportion, so it never touches the gold.
  const discount = input.discountType === 'flat' ? Math.min(raw, valueAdded) : valueAdded * (Math.min(raw, 100) / 100);
  const wastageDiscount = valueAdded > 0 ? discount * (wastageCost / valueAdded) : 0;
  const makingDiscount = discount - wastageDiscount;

  const originalSubtotal =
    metalCost + wastageCost + makingCharges + input.stoneCharges + input.hallmarkCharges;
  const subtotal = originalSubtotal - discount;
  const gst = subtotal * GST_RATE;
  const originalTotal = round2(round2(originalSubtotal) + round2(originalSubtotal * GST_RATE));
  const total = round2(round2(subtotal) + round2(gst));

  return {
    ratePerGram: round2(ratePerGram),
    metalCost: round2(metalCost),
    wastageCost: round2(wastageCost),
    makingCharges: round2(makingCharges),
    stoneCharges: round2(input.stoneCharges),
    hallmarkCharges: round2(input.hallmarkCharges),
    wastageDiscount: round2(wastageDiscount),
    makingDiscount: round2(makingDiscount),
    discount: round2(discount),
    originalSubtotal: round2(originalSubtotal),
    originalTotal,
    percentOff: discount > 0 ? Math.max(1, Math.round(((originalTotal - total) / originalTotal) * 100)) : 0,
    subtotal: round2(subtotal),
    gst: round2(gst),
    total,
  };
}

export function formatRupees(amount: number, showPaise = false): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showPaise ? 2 : 0,
    maximumFractionDigits: showPaise ? 2 : 0,
  }).format(amount);
}

export function validateRateChange(
  newRate: number,
  previousRate: number | null,
  maxDeviationPct = 5,
): string | null {
  if (!Number.isFinite(newRate) || newRate <= 0) {
    return `Rate must be a positive number, received ${newRate}`;
  }
  if (previousRate === null) return null;

  const deviationPct = Math.abs((newRate - previousRate) / previousRate) * 100;
  if (deviationPct > maxDeviationPct) {
    return `Rate ${newRate} deviates ${deviationPct.toFixed(2)}% from previous ${previousRate}, exceeding the ${maxDeviationPct}% limit`;
  }
  return null;
}
