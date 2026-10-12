// Plain values, no 'use client' — server components can import these; MUI's alpha() cannot run in one.

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
  ink: '#2A2520',
  inkSoft: '#55524A',
  icingDeep: '#A87840',
  sageWash: 'rgba(172, 176, 135, 0.22)',
  icingWash: 'rgba(244, 223, 204, 0.55)',
  blushWash: 'rgba(244, 225, 224, 0.6)',
} as const;
