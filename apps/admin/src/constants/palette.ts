// Plain values, no 'use client' — server components can import these; MUI's alpha() cannot run in one. Sakthi champagne + burgundy, mirroring the marketing site; the token names are inherited and no longer describe their colour.

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
  ink: '#241012',
  inkSoft: '#5A4A42',
  icingDeep: '#9A6B2F',
  sageWash: 'rgba(232, 214, 179, 0.35)',
  icingWash: 'rgba(240, 226, 202, 0.55)',
  blushWash: 'rgba(245, 234, 218, 0.6)',
} as const;
