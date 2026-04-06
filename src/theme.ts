'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#D4AF37',
      light: '#E8C84E',
      dark: '#B8962E',
      contrastText: '#121212',
    },
    secondary: {
      main: '#722F37',
      dark: '#5B252C',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#121212',
      paper: '#1A1A1A',
    },
    text: {
      primary: '#FAF9F6',
      secondary: '#D6D3CE',
    },
    divider: 'rgba(212, 175, 55, 0.2)',
  },
  typography: {
    fontFamily: 'var(--font-inter), var(--font-montserrat), sans-serif',
    h1: {
      fontFamily: 'var(--font-playfair-display), Georgia, serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'var(--font-playfair-display), Georgia, serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: 'var(--font-playfair-display), Georgia, serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: 'var(--font-playfair-display), Georgia, serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: 'var(--font-playfair-display), Georgia, serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: 'var(--font-playfair-display), Georgia, serif',
      fontWeight: 600,
    },
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
          backgroundColor: '#D4AF37',
          color: '#121212',
          '&:hover': {
            backgroundColor: '#E8C84E',
            boxShadow: '0 8px 32px rgba(212, 175, 55, 0.45)',
          },
        },
        outlinedPrimary: {
          borderColor: '#D4AF37',
          color: '#D4AF37',
          '&:hover': {
            backgroundColor: '#D4AF37',
            color: '#121212',
            boxShadow: '0 0 24px rgba(212, 175, 55, 0.4)',
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#121212',
          color: '#FAF9F6',
          scrollbarColor: '#D4AF37 #121212',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#121212',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#D4AF37',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#E8C84E',
          },
        },
      },
    },
  },
});

export default theme;
