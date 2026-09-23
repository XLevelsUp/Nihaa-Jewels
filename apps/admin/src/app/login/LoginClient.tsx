'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

import { login } from '@/app/actions/auth';
import { PALETTE } from '@/theme';

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);

    startTransition(async () => {
      const result = await login(formData);
      if (result.ok) {
        const next = searchParams.get('next');
        // Only same-origin relative paths, so ?next= cannot redirect to another site.
        router.replace(next?.startsWith('/') && !next.startsWith('//') ? next : '/');
        router.refresh();
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        background: `linear-gradient(160deg, ${PALETTE.blush} 0%, ${PALETTE.icing} 40%, ${PALETTE.ivory} 100%)`,
      }}
    >
      <Paper variant="outlined" sx={{ width: '100%', maxWidth: 400, p: { xs: 3, sm: 5 } }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            component="img"
            src="/logo.svg"
            alt=""
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
            sx={{ height: 40, mb: 2 }}
          />
          <Typography variant="h1" sx={{ fontSize: '1.4rem', mb: 0.5 }}>
            Nihaa Jewels
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
            Staff sign in
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            name="email"
            type="email"
            label="Email"
            autoComplete="username"
            required
            fullWidth
            autoFocus
          />
          <TextField
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            required
            fullWidth
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button type="submit" variant="contained" disabled={pending} sx={{ py: 1.25, mt: 0.5 }}>
            {pending ? <CircularProgress size={20} color="inherit" /> : 'Sign in'}
          </Button>
        </Box>

        <Typography
          sx={{ mt: 3, textAlign: 'center', color: 'text.secondary', fontSize: '0.75rem', lineHeight: 1.7 }}
        >
          Accounts are created by your administrator. Contact them if you cannot sign in.
        </Typography>
      </Paper>
    </Box>
  );
}
