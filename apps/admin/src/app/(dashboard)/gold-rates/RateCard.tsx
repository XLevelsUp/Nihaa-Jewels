'use client';

import { useState, useTransition } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { TriangleAlert } from 'lucide-react';

import { publishGoldRate } from '@/app/actions/gold-rates';
import { PALETTE } from '@/constants/palette';
import type { Karat } from '@/types/database';

interface RateCardProps {
  karat: Karat;
  currentRate: number | null;
  source: string | null;
  effectiveFrom: string | null;
}

function formatRupees(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function RateCard({ karat, currentRate, source, effectiveFrom }: RateCardProps) {
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState('');
  const [note, setNote] = useState('');
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [awaitingConfirm, setAwaitingConfirm] = useState(false);

  const submit = (confirmed: boolean) => {
    const formData = new FormData();
    formData.set('karat', karat);
    formData.set('ratePerGram', value);
    formData.set('note', note);
    if (confirmed) formData.set('confirmed', 'true');

    startTransition(async () => {
      const result = await publishGoldRate(formData);
      setFeedback(result);
      setAwaitingConfirm(Boolean(result.needsConfirmation));
      if (result.ok) {
        setValue('');
        setNote('');
      }
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit(false);
  };

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h3" sx={{ fontSize: '1.05rem', mb: 0.5 }}>
          {karat} Gold
        </Typography>
        {currentRate ? (
          <>
            <Typography sx={{ fontSize: '1.6rem', fontWeight: 600, color: 'primary.main', lineHeight: 1.2 }}>
              {formatRupees(currentRate)}
              <Typography component="span" sx={{ fontSize: '0.8rem', color: 'text.secondary', ml: 0.5 }}>
                / gram
              </Typography>
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', mt: 0.5 }}>
              {source === 'manual' ? 'Set by staff' : 'From rate feed'}
              {effectiveFrom &&
                ` · ${new Date(effectiveFrom).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: 'numeric',
                  minute: '2-digit',
                })}`}
            </Typography>
          </>
        ) : (
          <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', fontStyle: 'italic' }}>
            No rate set — products in {karat} show &ldquo;price on enquiry&rdquo;.
          </Typography>
        )}
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2.5, borderTop: `1px solid ${PALETTE.icing}` }}
      >
        <TextField
          label="New rate per gram"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setAwaitingConfirm(false);
            setFeedback(null);
          }}
          type="number"
          required
          fullWidth
          slotProps={{
            input: { startAdornment: <InputAdornment position="start">₹</InputAdornment> },
            htmlInput: { min: 0, step: 1 },
          }}
        />

        <TextField
          label="Note (optional)"
          placeholder="e.g. Morning association rate"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          fullWidth
        />

        {feedback && !feedback.ok && (
          <Alert
            severity={awaitingConfirm ? 'warning' : 'error'}
            icon={awaitingConfirm ? <TriangleAlert size={20} /> : undefined}
          >
            {feedback.message}
            {awaitingConfirm && (
              <Typography sx={{ fontSize: '0.78rem', mt: 1 }}>
                Check for a typing mistake. If this rate is correct, confirm below.
              </Typography>
            )}
          </Alert>
        )}

        {feedback?.ok && <Alert severity="success">{feedback.message}</Alert>}

        {awaitingConfirm ? (
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="contained"
              color="secondary"
              disabled={pending}
              onClick={() => submit(true)}
              sx={{ flex: 1 }}
            >
              {pending ? <CircularProgress size={20} color="inherit" /> : 'Yes, publish this rate'}
            </Button>
            <Button
              variant="outlined"
              disabled={pending}
              onClick={() => {
                setAwaitingConfirm(false);
                setFeedback(null);
              }}
            >
              Cancel
            </Button>
          </Box>
        ) : (
          <Button type="submit" variant="contained" disabled={pending || !value}>
            {pending ? <CircularProgress size={20} color="inherit" /> : 'Publish rate'}
          </Button>
        )}
      </Box>
    </Paper>
  );
}
