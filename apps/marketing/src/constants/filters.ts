// Plain data, no 'use client' — both server and client components import these.

export interface PriceBand {
  label: string;
  min?: number;
  max?: number;
}

export const PRICE_BANDS: PriceBand[] = [
  { label: 'Below ₹25K', max: 25000 },
  { label: '₹25K – ₹50K', min: 25000, max: 50000 },
  { label: '₹50K – ₹1L', min: 50000, max: 100000 },
  { label: '₹1L & Above', min: 100000 },
];

export const OCCASIONS = ['wedding', 'daily-wear', 'festive', 'engagement', 'office'];

// Audience values match the admin GENDERS list; unisex is never browsed directly
// because those pieces already surface under both women and men.
export const AUDIENCES: Record<string, { heading: string; blurb: string }> = {
  women: {
    heading: 'Jewellery for Women',
    blurb: 'Temple work, everyday gold and bridal sets, in 22K and 18K.',
  },
  men: {
    heading: 'Jewellery for Men',
    blurb: 'Chains, rings and kadas in weights made to be worn daily.',
  },
  kids: {
    heading: 'Jewellery for Kids',
    blurb: 'Lightweight bangles, chains and earrings for little ones.',
  },
};

export function isAudience(value: string | undefined): value is keyof typeof AUDIENCES {
  return typeof value === 'string' && value in AUDIENCES;
}

export function titleCase(value: string): string {
  return value.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
