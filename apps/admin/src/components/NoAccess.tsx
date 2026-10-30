'use client';

// Shown to someone who can sign in but is not on the staff list (removed, or created outside the Staff page): explains why and offers sign-out.

import { useTransition } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { ShieldOff } from 'lucide-react';

import { logout } from '@/app/actions/auth';
import { PALETTE } from '@/constants/palette';

export default function NoAccess({ email }: { email: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3, bgcolor: PALETTE.sageTint }}>
      <Paper variant="outlined" sx={{ maxWidth: 420, p: { xs: 3, sm: 5 }, textAlign: 'center' }}>
        <ShieldOff size={32} color={PALETTE.sageDeep} aria-hidden="true" />
        <Typography variant="h1" sx={{ fontSize: '1.4rem', mt: 2 }}>No access to the admin</Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.88rem', mt: 1.5, lineHeight: 1.7 }}>
          <strong>{email}</strong> can sign in but is not on the staff list. Ask an Admin to add you from the Staff page.
        </Typography>
        <Button variant="contained" sx={{ mt: 3 }} disabled={pending} onClick={() => startTransition(() => logout())}>
          Sign out
        </Button>
      </Paper>
    </Box>
  );
}
