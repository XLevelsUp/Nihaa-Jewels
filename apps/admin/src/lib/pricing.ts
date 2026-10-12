// Mirror of apps/marketing/src/lib/pricing.ts — keep both in step, or admin previews will not match the site.

export type Karat = '18K' | '22K' | '24K';
export type MakingChargeType = 'per_gram' | 'flat' | 'percentage';

export const GST_RATE = 0.03;

export interface PricingInput {
  netWeightG: number;
  karat: Karat;
  wastagePct: number;
  makingChargeType: MakingChargeType;
  makingChargeValue: number;
  stoneCharges: number;
  hallmarkCharges: number;
}

export interface PriceBreakdown {
  ratePerGram: number;
  metalCost: number;
  wastageCost: number;
  makingCharges: number;
  stoneCharges: number;
  hallmarkCharges: number;
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

  const subtotal =
    metalCost + wastageCost + makingCharges + input.stoneCharges + input.hallmarkCharges;
  const gst = subtotal * GST_RATE;

  return {
    ratePerGram: round2(ratePerGram),
    metalCost: round2(metalCost),
    wastageCost: round2(wastageCost),
    makingCharges: round2(makingCharges),
    stoneCharges: round2(input.stoneCharges),
    hallmarkCharges: round2(input.hallmarkCharges),
    subtotal: round2(subtotal),
    gst: round2(gst),
    total: round2(round2(subtotal) + round2(gst)),
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
