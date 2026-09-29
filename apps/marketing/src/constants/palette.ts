// Mirrors the :root block in app/globals.css. Change a colour there and here together.

export const PALETTE = {
  sage: '#ACB087',
  icing: '#F4DFCC',
  blush: '#F4E1E0',
  ivory: '#FFFFF0',
  sageTint: '#E8EAD9',
  sageDeep: '#5F6440',
  sageDeeper: '#4C5133',
  blushDeep: '#7E5653',
  blushDeeper: '#6F4B48',
  icingDeep: '#A87840',
  text: '#2A2520',
  textSoft: '#55524A',
  card: '#FFFFFF',
} as const;

// Semantic pairings. Text colour follows the surface it sits on, so a section
// cannot end up with unreadable text when its fill changes.
export const SURFACE = {
  page: { bg: PALETTE.ivory, text: PALETTE.text },
  alt: { bg: PALETTE.sageTint, text: PALETTE.text },
  card: { bg: PALETTE.card, text: PALETTE.text },
  panel: { bg: PALETTE.icing, text: PALETTE.text },
  blockSage: { bg: PALETTE.sageDeep, text: PALETTE.ivory },
  blockBlush: { bg: PALETTE.blushDeep, text: PALETTE.icing },
} as const;
