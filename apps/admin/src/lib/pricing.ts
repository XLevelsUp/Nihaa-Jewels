// Mirror of apps/marketing/src/lib/pricing.ts — keep both in step, or admin previews will not match the site.

export type Karat = '18K' | '22K' | '24K';
export type MakingChargeType = 'per_gram' | 'flat' | 'percentage';
export type DiscountType = 'percentage' | 'flat';

export const GST_RATE = 0.03;

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

export function calculatePrice(input: PricingInput, ratePerGram: number): PriceBreakdown | null {
  if (!Number.isFinite(ratePerGram) || ratePerGram <= 0) return null;
  if (!Number.isFinite(input.netWeightG) || input.netWeightG <= 0) return null;

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
    default:
      return null;
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

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
