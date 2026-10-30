// Every About page photograph slot: drop a file named <file>.(webp|avif|jpg|jpeg|png) into public/images/about/ and it replaces the placeholder.

import type { ImageSlotSpec } from '@/constants/homepageImages';

export const ABOUT_SLOTS = {
  hero: {
    file: 'about-hero',
    label: 'About, hero',
    alt: 'A temple gold Lakshmi coin necklace on burgundy velvet beside a carved wooden box and a lit brass lamp',
    ratio: '16:9',
    size: '2400 × 1350',
    brief: 'A signature piece in low warm light, jewellery to the right, the left side dark for the title.',
  },
  origin: {
    file: 'about-origin',
    label: 'How it began',
    alt: 'An old goldsmith’s bench with brass scales, a lit lamp, coils of gold wire and a half-made gold chain',
    ratio: '4:5',
    size: '1200 × 1500',
    brief: 'The early workshop or a family photograph; a real archive photo is best.',
  },
  craftThread: {
    file: 'about-craft-1',
    label: 'The thread',
    alt: 'Gold wire being drawn through a steel draw plate with pliers',
    ratio: '4:5',
    size: '1000 × 1250',
    brief: 'Gold wire drawn through a draw plate, warm side light.',
  },
  craftShaping: {
    file: 'about-craft-2',
    label: 'The shaping',
    alt: 'A goldsmith joining the links of a gold chain with pliers beside a soldering flame',
    ratio: '4:5',
    size: '1000 × 1250',
    brief: 'Hands shaping or soldering a chain at the bench.',
  },
  craftFinish: {
    file: 'about-craft-3',
    label: 'The finish',
    alt: 'A craftsman polishing a carved gold bangle with a cloth beside a gold chain on velvet',
    ratio: '4:5',
    size: '1000 × 1250',
    brief: 'A finished piece being polished on burgundy velvet.',
  },
  hands: {
    file: 'about-hands',
    label: 'The hands behind it',
    alt: 'Three goldsmiths at a long wooden bench working on a gold chain, a bangle and a pendant',
    ratio: '2:1',
    size: '2000 × 1000',
    brief: 'Goldsmiths at work in the workshop; a real photograph of the team is best.',
  },
} satisfies Record<string, ImageSlotSpec>;

export type AboutSlotKey = keyof typeof ABOUT_SLOTS;
