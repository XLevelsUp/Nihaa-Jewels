// Pure pricing engine — identical in apps/marketing and apps/admin; no I/O.

export type Karat = '18K' | '22K' | '24K';
export type Metal = 'gold' | 'silver';
export type SilverPurity = '925' | '999';
export type MakingChargeType = 'per_gram' | 'flat' | 'percentage';
export type DiscountType = 'percentage' | 'flat';

export const GST_RATE = 0.03;

export const INDICATIVE_PRICE_DISCLAIMER =
  'Indicative price based on today’s metal rate. Final price is confirmed in store.';

export interface PricingInput {
  netWeightG: number;
  metal?: Metal;
  karat?: Karat | null;
  silverPurity?: SilverPurity | null;
  wastagePct: number;
  makingChargeType: MakingChargeType;
  makingChargeValue: number;
  stoneCharges: number;
  hallmarkCharges: number;
  diamondValue?: number | null;
  priceOnRequest?: boolean;
  /** Off wastage and making only, as a percent or a flat rupee amount; the metal value is never discounted. */
  discountType?: DiscountType;
  discountValue?: number;
}

export interface PriceOnRequest {
  onRequest: true;
}

export interface PriceBreakdown {
  onRequest?: false;
  metal: Metal;
  purityLabel: string;
  ratePerGram: number;
  metalCost: number;
  diamondValue: number;
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

export type PriceResult = PriceBreakdown | PriceOnRequest;

export function isPriceOnRequest(price: PriceResult | null | undefined): price is PriceOnRequest {
  return Boolean(price && 'onRequest' in price && price.onRequest === true);
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculatePrice(input: PricingInput, ratePerGram: number): PriceResult | null {
  if (input.priceOnRequest) return { onRequest: true };
  if (!Number.isFinite(ratePerGram) || ratePerGram <= 0) return null;
  if (!Number.isFinite(input.netWeightG) || input.netWeightG <= 0) return null;

  const metal: Metal = input.metal ?? 'gold';
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

  const diamondValue = Number.isFinite(input.diamondValue) ? Math.max(input.diamondValue ?? 0, 0) : 0;

  // GRT's convention: the discount comes off the value addition (wastage + making), GST is charged on what remains.
  const valueAdded = wastageCost + makingCharges;
  const raw = Number.isFinite(input.discountValue) ? Math.max(input.discountValue ?? 0, 0) : 0;
  // A flat amount is capped at the value addition and split across wastage and making in proportion, so it never touches the metal.
  const discount = input.discountType === 'flat' ? Math.min(raw, valueAdded) : valueAdded * (Math.min(raw, 100) / 100);
  const wastageDiscount = valueAdded > 0 ? discount * (wastageCost / valueAdded) : 0;
  const makingDiscount = discount - wastageDiscount;

  const originalSubtotal =
    metalCost + diamondValue + wastageCost + makingCharges + input.stoneCharges + input.hallmarkCharges;
  const subtotal = originalSubtotal - discount;
  const gst = subtotal * GST_RATE;
  const originalTotal = round2(round2(originalSubtotal) + round2(originalSubtotal * GST_RATE));
  const total = round2(round2(subtotal) + round2(gst));

  return {
    metal,
    purityLabel: purityLabel(metal, input.karat ?? null, input.silverPurity ?? null),
    ratePerGram: round2(ratePerGram),
    metalCost: round2(metalCost),
    diamondValue: round2(diamondValue),
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

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function rateKey(metal: Metal, karat: Karat | null, silverPurity: SilverPurity | null): string | null {
  if (metal === 'silver') return silverPurity ? `silver-${silverPurity}` : null;
  return karat;
}

export function purityLabel(metal: Metal, karat: Karat | null, silverPurity: SilverPurity | null): string {
  if (metal === 'silver') return silverPurity === '999' ? '999 fine silver' : silverPurity === '925' ? '925 sterling silver' : 'Silver';
  return karat ? `${karat} gold` : 'Gold';
}
