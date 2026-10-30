// Mirrors the :root block in app/globals.css. Change a colour there and here together.

export const PALETTE = {
  sage: '#E8D6B3',
  icing: '#F0E2CA',
  blush: '#F5EADA',
  ivory: '#FDFAF5',
  sageTint: '#F5EADA',
  sageDeep: '#800022',
  sageDeeper: '#5E001A',
  blushDeep: '#6E2630',
  blushDeeper: '#551D25',
  icingDeep: '#9A6B2F',
  text: '#241012',
  textSoft: '#5A4A42',
  card: '#FFFFFF',
  onSage: '#F7ECD9',
} as const;

export const SURFACE = {
  page: { bg: PALETTE.ivory, text: PALETTE.text },
  alt: { bg: PALETTE.sageTint, text: PALETTE.text },
  card: { bg: PALETTE.card, text: PALETTE.text },
  panel: { bg: PALETTE.icing, text: PALETTE.text },
  blockSage: { bg: PALETTE.sageDeep, text: PALETTE.onSage },
  blockBlush: { bg: PALETTE.blushDeep, text: PALETTE.sage },
} as const;
