'use client';

// Light palette shared with admin; brand colours sit under 3:1 on ivory, so text uses darker shades of the same hues.

import { createTheme } from '@mui/material/styles';

import { PALETTE } from '@/constants/palette';

export { PALETTE };

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: PALETTE.sageDeep,
      light: PALETTE.sage,
      dark: PALETTE.sageDeeper,
      contrastText: PALETTE.ivory,
    },
    secondary: {
      main: PALETTE.blushDeep,
      light: PALETTE.blush,
      dark: PALETTE.blushDeeper,
      contrastText: PALETTE.ivory,
    },
    background: {
      default: PALETTE.ivory,
      paper: '#FFFFFF',
    },
    text: {
      primary: PALETTE.ink,
      secondary: PALETTE.inkSoft,
    },
    divider: PALETTE.icing,
  },
  typography: {
    fontFamily: 'var(--font-inter), var(--font-montserrat), sans-serif',
    h1: { fontFamily: 'var(--font-playfair-display), Georgia, serif', fontWeight: 700 },
    h2: { fontFamily: 'var(--font-playfair-display), Georgia, serif', fontWeight: 600 },
    h3: { fontFamily: 'var(--font-playfair-display), Georgia, serif', fontWeight: 600 },
    h4: { fontFamily: 'var(--font-playfair-display), Georgia, serif', fontWeight: 600 },
    h5: { fontFamily: 'var(--font-playfair-display), Georgia, serif', fontWeight: 600 },
    h6: { fontFamily: 'var(--font-playfair-display), Georgia, serif', fontWeight: 600 },
    button: {
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '10px 24px',
          transition: 'all 0.3s ease',
        },
        containedPrimary: {
          backgroundColor: PALETTE.sageDeep,
          color: PALETTE.ivory,
          '&:hover': {
            backgroundColor: PALETTE.sageDeeper,
            boxShadow: '0 8px 32px rgba(95, 100, 64, 0.28)',
          },
        },
        outlinedPrimary: {
          borderColor: PALETTE.sageDeep,
          color: PALETTE.sageDeep,
          '&:hover': {
            backgroundColor: PALETTE.sageDeep,
            color: PALETTE.ivory,
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: PALETTE.ivory,
          color: PALETTE.ink,
          scrollbarColor: `${PALETTE.sage} ${PALETTE.ivory}`,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: PALETTE.ivory,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: PALETTE.sage,
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: PALETTE.sageDeep,
          },
        },
      },
    },
  },
});

export default theme;
