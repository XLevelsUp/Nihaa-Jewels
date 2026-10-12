import Link from 'next/link';
import { Box, Button, Paper, Typography } from '@mui/material';

import { PALETTE } from '@/constants/palette';

// Rendered outside the (dashboard) group, so it carries no sidebar and must stand alone.
export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        bgcolor: PALETTE.sageTint,
      }}
    >
      <Paper variant="outlined" sx={{ maxWidth: 440, width: '100%', p: { xs: 3, sm: 5 }, textAlign: 'center' }}>
        <Typography
          sx={{
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'text.secondary',
            mb: 1.5,
          }}
        >
          Error 404
        </Typography>

        <Typography variant="h1" sx={{ fontSize: '1.5rem', mb: 1.5 }}>
          Page not found
        </Typography>

        <Typography sx={{ color: 'text.secondary', fontSize: '0.88rem', lineHeight: 1.8, mb: 4 }}>
          This page does not exist in the admin panel. It may have been moved, or the address
          mistyped.
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button component={Link} href="/" variant="contained">
            Back to dashboard
          </Button>
          <Button component={Link} href="/products" variant="outlined">
            Products
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
