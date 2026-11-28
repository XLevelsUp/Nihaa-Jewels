// The three things Sakthi Chains sells (gold, silver, diamond): one definition feeds the menu, footer, landing pages, filters and product labels so they never disagree.

import type { ImageSlotSpec } from '@/constants/homepageImages';
import type { Karat, Metal, SilverPurity } from '@/lib/pricing';

export type JewelleryType = 'gold' | 'silver' | 'diamond';

export interface Faq {
  q: string;
  a: string;
}

export interface JewelleryTypeSpec {
  type: JewelleryType;
  label: string;
  title: string;
  path: string;
  eyebrow: string;
  headline: string;
  accent: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  faqs: Faq[];
  hero: ImageSlotSpec;
  card: ImageSlotSpec;
}

const slot = (file: string, label: string, alt: string, ratio: string, size: string, brief: string): ImageSlotSpec => ({
  file,
  label,
  alt,
  ratio,
  size,
  brief,
  hint: `public/images/jewellery-types/${file}.webp`,
});

export const JEWELLERY_TYPES: Record<JewelleryType, JewelleryTypeSpec> = {
  gold: {
    type: 'gold',
    label: 'Gold',
    title: 'Gold Jewellery',
    path: '/gold-jewellery',
    eyebrow: 'BIS hallmarked gold',
    headline: 'Gold jewellery,',
    accent: 'priced at today’s rate',
    metaTitle: 'Gold Jewellery in Coimbatore',
    metaDescription:
      'BIS hallmarked gold jewellery at Sakthi Chains, Town Hall, Coimbatore: chains, necklaces, bangles and earrings, priced from today’s gold rate with a full breakdown.',
    intro: [
      'Gold is where Sakthi Chains began, and it is still most of what you will find at our showroom at Town Hall, Coimbatore. Gold chains for men and women, necklaces for weddings and festivals, bangles, and light earrings for every day.',
      'Every gold piece is BIS hallmarked for its purity, and each one on this page shows how its price is worked out: the gold weight multiplied by today’s rate for its purity, then wastage, making charges, hallmarking and GST. Choose 22 carat for most jewellery, 18 carat for lighter or stone-set designs, or 24 carat where purity matters most.',
      'Prices follow the day’s gold rate, so the final figure is confirmed at the counter when the piece is weighed in front of you. Book a visit and we will have your shortlist ready.',
    ],
    faqs: [
      {
        q: 'Which gold purity should I choose?',
        a: '22 carat (916) is the usual choice for chains, bangles and necklaces because it is rich in colour and strong enough for daily wear. 18 carat is harder and suits stone-set and lighter designs. 24 carat is pure gold and very soft, so it is rarely used for jewellery that is worn every day.',
      },
      {
        q: 'How is the price of a gold piece worked out?',
        a: 'The net gold weight is multiplied by today’s rate for its purity. Wastage, making charges, hallmarking and 3% GST are then added. Every product page shows this breakdown line by line.',
      },
      {
        q: 'Is your gold hallmarked?',
        a: 'Yes. Every gold piece is BIS hallmarked for its purity, so it can be checked by anyone, anywhere.',
      },
      {
        q: 'Why can the final price differ from the website?',
        a: 'The gold rate changes every day, and the final price uses the rate and the weight measured at the counter on the day you buy.',
      },
    ],
    hero: slot('gold-hero', 'Gold jewellery, hero', 'A temple gold Lakshmi coin necklace on a clay pot beside two Lakshmi pendants on gold chains, burgundy satin and a carved wooden panel', '16:9', '1600 × 900', 'Several gold pieces on velvet, warm low light, space on one side for the title.'),
    card: slot('gold-card', 'Gold, card', 'A temple gold Lakshmi coin necklace on a clay pot beside two Lakshmi pendants on gold chains, burgundy satin and a carved wooden panel', '4:5', '800 × 1000', 'One hero gold piece, close up.'),
  },
  silver: {
    type: 'silver',
    label: 'Silver',
    title: 'Silver Jewellery',
    path: '/silver-jewellery',
    eyebrow: '925 sterling · 999 fine',
    headline: 'Silver jewellery,',
    accent: 'bright and everyday',
    metaTitle: 'Silver Jewellery in Coimbatore',
    metaDescription:
      'Silver jewellery at Sakthi Chains, Town Hall, Coimbatore, in 925 sterling and 999 fine silver, priced from today’s silver rate. Book a visit to see the range in person.',
    intro: [
      'Alongside gold, Sakthi Chains carries silver jewellery at our showroom at Town Hall, Coimbatore: lighter pieces for everyday wear, gifts, and designs for children.',
      'We work with two purities. 925 sterling silver is silver strengthened with a small amount of other metal, so it keeps its shape for rings, chains and earrings that are worn often. 999 fine silver is almost pure silver, softer and brighter, and is used where purity matters most.',
      'Like gold, silver is priced from the day’s rate, which our team updates. Each piece shows its silver weight, purity and price breakdown, and the final price is confirmed at the counter when the piece is weighed.',
    ],
    faqs: [
      {
        q: 'What is the difference between 925 and 999 silver?',
        a: '925 sterling silver is 92.5% silver with a small amount of other metal added for strength, which makes it suit jewellery worn every day. 999 fine silver is 99.9% silver: brighter, but softer.',
      },
      {
        q: 'How is the price of silver jewellery worked out?',
        a: 'The net silver weight is multiplied by today’s silver rate for its purity, then wastage, making charges and GST are added. The breakdown is shown on each product page.',
      },
      {
        q: 'Why does silver darken, and how do I clean it?',
        a: 'Silver reacts slowly with the air and turns darker over time. Wipe it with a soft dry cloth after wearing, keep it in a closed pouch, and ask us at the showroom about cleaning a darkened piece.',
      },
      {
        q: 'Does the silver rate change every day?',
        a: 'Yes. Our team updates the silver rate, and website prices follow it. The final price is confirmed at the counter.',
      },
    ],
    hero: slot('silver-hero', 'Silver jewellery, hero', 'Silver peacock jhumkas, an elephant figurine, a lamp, a bell and a plate on terracotta steps in warm light', '16:9', '1600 × 900', 'Silver pieces on a light, cool background, soft daylight, space on one side for the title.'),
    card: slot('silver-card', 'Silver, card', 'Silver peacock jhumkas, an elephant figurine, a lamp, a bell and a plate on terracotta steps in warm light', '4:5', '800 × 1000', 'Silver jewellery and silver articles on terracotta steps, warm light.'),
  },
  diamond: {
    type: 'diamond',
    label: 'Diamond',
    title: 'Diamond Jewellery',
    path: '/diamond-jewellery',
    eyebrow: 'Certified diamonds',
    headline: 'Diamond jewellery,',
    accent: 'certified and set in gold',
    metaTitle: 'Diamond Jewellery in Coimbatore',
    metaDescription:
      'Certified diamond jewellery set in gold at Sakthi Chains, Town Hall, Coimbatore. Each piece comes with its diamond certificate. Book a visit to see the range in person.',
    intro: [
      'Sakthi Chains carries diamond jewellery at our showroom at Town Hall, Coimbatore: earrings, rings, pendants and necklaces with diamonds set in gold.',
      'Every diamond piece comes with a certificate. The certifying lab and certificate number are listed on each product page, together with the total diamond weight, the number of stones and, where available, their clarity, colour and cut, so you know exactly what you are looking at before you visit.',
      'Diamond prices depend on the individual stones, so they are given on request. Book a visit, and we will show you the pieces and their certificates in person and confirm the price at the showroom.',
    ],
    faqs: [
      {
        q: 'Do your diamonds come with a certificate?',
        a: 'Yes. Every diamond piece comes with a certificate. The lab and certificate number are shown on the product page, and our team will show you the certificate at the showroom.',
      },
      {
        q: 'Why is the price shown as “on request”?',
        a: 'The price of diamond jewellery depends on the exact stones in each piece, so we confirm it at the showroom rather than show a figure that might not match. Call, WhatsApp or book a visit to ask.',
      },
      {
        q: 'What do clarity, colour and cut mean?',
        a: 'Clarity describes how free a diamond is from tiny marks inside it, colour describes how colourless it is, and cut describes how well it is shaped to reflect light. Together with carat weight they describe a diamond, and they are printed on its certificate.',
      },
      {
        q: 'What metal are the diamonds set in?',
        a: 'Our diamond jewellery is set in gold. The gold purity of the setting is shown on each product page.',
      },
    ],
    hero: slot('diamond-hero', 'Diamond jewellery, hero', 'A diamond necklace with a pear-shaped drop and matching earrings on a burgundy velvet bust', '16:9', '1600 × 900', 'Diamond pieces set in gold on dark velvet, a single soft light, space on one side for the title.'),
    card: slot('diamond-card', 'Diamond, card', 'A diamond necklace with a pear-shaped drop and matching earrings on a burgundy velvet bust', '4:5', '800 × 1000', 'Diamond necklace and earrings on a burgundy velvet bust.'),
  },
};

export const TYPE_ORDER: JewelleryType[] = ['gold', 'silver', 'diamond'];

export function isJewelleryType(value: string | undefined): value is JewelleryType {
  return value === 'gold' || value === 'silver' || value === 'diamond';
}

interface Typed {
  metal: Metal;
  has_diamond: boolean;
  karat: Karat | null;
  silver_purity: SilverPurity | null;
}

export function typeOf(p: Typed): JewelleryType {
  return p.has_diamond ? 'diamond' : p.metal;
}

export function purityValue(p: Typed): string | null {
  return p.metal === 'silver' ? p.silver_purity : p.karat;
}

export function purityText(value: string): string {
  if (value === '925') return '925 sterling silver';
  if (value === '999') return '999 fine silver';
  return `${value} gold`;
}

export function materialLabel(p: Typed): string {
  const purity = purityValue(p);
  const metal = purity ? purityText(purity) : p.metal === 'silver' ? 'silver' : 'gold';
  return p.has_diamond ? `Diamond, ${metal}` : metal;
}
