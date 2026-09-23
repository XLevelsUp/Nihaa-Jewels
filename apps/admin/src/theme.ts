'use client';

// sage/icing/blush are all under 3:1 on ivory, so they carry surfaces and borders only — text uses ink.

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
      default: PALETTE.sageTint,
      paper: PALETTE.ivory,
    },
    text: {
      primary: PALETTE.ink,
      secondary: PALETTE.inkSoft,
    },
    success: { main: '#2E7D53' },
    warning: { main: '#9B5D00' },
    error: { main: '#B3261E' },
    divider: PALETTE.icing,
    action: {
      hover: PALETTE.sageWash,
      selected: 'rgba(172, 176, 135, 0.3)',
    },
  },
  typography: {
    fontFamily: 'var(--font-inter), system-ui, sans-serif',
    h1: { fontFamily: 'var(--font-playfair-display), Georgia, serif', fontWeight: 600, fontSize: '1.75rem' },
    h2: { fontFamily: 'var(--font-playfair-display), Georgia, serif', fontWeight: 600, fontSize: '1.4rem' },
    h3: { fontFamily: 'var(--font-playfair-display), Georgia, serif', fontWeight: 600, fontSize: '1.15rem' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: PALETTE.sageTint, color: PALETTE.ink },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 6, padding: '8px 18px' },
        outlined: { borderColor: PALETTE.sage },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: { borderColor: PALETTE.icing },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: { borderColor: PALETTE.icing },
      },
    },
    MuiChip: {
      styleOverrides: {
        outlined: { borderColor: PALETTE.sage },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: PALETTE.ivory },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: PALETTE.inkSoft,
          fontSize: '0.75rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          backgroundColor: PALETTE.icingWash,
        },
        root: { borderBottomColor: PALETTE.icing },
      },
    },
  },
});

export default theme;
