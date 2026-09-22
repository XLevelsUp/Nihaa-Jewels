'use client';

import { useState, useTransition } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { X } from 'lucide-react';

import { bookAppointment, type BookingResult } from '@/app/actions/book-appointment';

interface BookAppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  productId?: string | null;
  productName?: string;
  quotedPrice?: number | null;
}

function todayLocal(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function BookAppointmentDialog({
  open,
  onClose,
  productId = null,
  productName,
  quotedPrice = null,
}: BookAppointmentDialogProps) {
  const theme = useTheme();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<BookingResult | null>(null);
  const [toast, setToast] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await bookAppointment(formData);
      setResult(res);
      if (res.ok) {
        setToast(true);
        onClose();
      }
    });
  };

  const fieldStyle = {
    '& .MuiInput-underline:before': { borderBottomColor: alpha(theme.palette.primary.main, 0.2) },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: theme.palette.primary.main },
    '& .MuiInput-underline:after': { borderBottomColor: theme.palette.primary.main },
    '& .MuiInputBase-input': {
      color: theme.palette.text.primary,
      fontFamily: 'var(--font-inter), sans-serif',
      fontSize: '0.875rem',
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.primary.main,
      textTransform: 'uppercase',
      letterSpacing: '0.15em',
      fontSize: '0.65rem',
    },
  };

  const errors = result?.fieldErrors ?? {};

  return (
    <>
      <Dialog
        open={open}
        onClose={pending ? undefined : onClose}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: 'background.paper',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              borderRadius: 0,
              backgroundImage: 'none',
            },
          },
        }}
      >
        <DialogContent sx={{ p: { xs: 3, md: 5 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box>
              <Typography
                variant="h2"
                sx={{
                  fontSize: '1.5rem',
                  color: 'text.primary',
                  fontFamily: 'var(--font-playfair-display), serif',
                }}
              >
                Book an Appointment
              </Typography>
              <Box sx={{ width: 40, height: 1, bgcolor: 'primary.main', mt: 2 }} />
              {productName && (
                <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', mt: 2 }}>
                  To view <strong style={{ color: theme.palette.primary.main }}>{productName}</strong> at
                  our Coimbatore store.
                </Typography>
              )}
            </Box>
            <Button
              onClick={onClose}
              disabled={pending}
              aria-label="Close"
              sx={{ minWidth: 0, p: 1, color: 'text.secondary' }}
            >
              <X size={18} strokeWidth={1.5} />
            </Button>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <input type="hidden" name="productId" value={productId ?? ''} />
            <input type="hidden" name="quotedPrice" value={quotedPrice ?? ''} />

            <Box
              aria-hidden="true"
              sx={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}
            >
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              <TextField
                name="name"
                label="Full Name*"
                placeholder="Priya Sharma"
                required
                fullWidth
                variant="standard"
                sx={fieldStyle}
                InputLabelProps={{ shrink: true }}
                error={Boolean(errors.name)}
                helperText={errors.name}
              />
              <TextField
                name="phone"
                label="Phone Number*"
                placeholder="+91 98000 00000"
                required
                fullWidth
                variant="standard"
                sx={fieldStyle}
                InputLabelProps={{ shrink: true }}
                error={Boolean(errors.phone)}
                helperText={errors.phone}
              />
            </Box>

            <TextField
              name="email"
              type="email"
              label="Email Address"
              placeholder="priya@example.com"
              fullWidth
              variant="standard"
              sx={fieldStyle}
              InputLabelProps={{ shrink: true }}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              <TextField
                name="preferredDate"
                type="date"
                label="Preferred Date*"
                required
                fullWidth
                variant="standard"
                defaultValue={todayLocal()}
                inputProps={{ min: todayLocal() }}
                sx={fieldStyle}
                InputLabelProps={{ shrink: true }}
                error={Boolean(errors.preferredDate)}
                helperText={errors.preferredDate}
              />
              <FormControl fullWidth variant="standard" sx={fieldStyle}>
                <InputLabel shrink sx={{ color: 'primary.main' }}>
                  Preferred Time*
                </InputLabel>
                <Select
                  name="preferredSlot"
                  defaultValue="morning"
                  required
                  sx={{
                    '&:before': { borderBottomColor: alpha(theme.palette.primary.main, 0.2) },
                    '&:after': { borderBottomColor: theme.palette.primary.main },
                    '& .MuiSelect-select': { py: 1, color: theme.palette.text.primary, fontSize: '0.875rem' },
                  }}
                >
                  <MenuItem value="morning">Morning (10am &ndash; 1pm)</MenuItem>
                  <MenuItem value="afternoon">Afternoon (1pm &ndash; 5pm)</MenuItem>
                  <MenuItem value="evening">Evening (5pm &ndash; 8pm)</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              name="notes"
              label="Anything we should know?"
              placeholder="Sizing, budget, or other pieces you'd like to see..."
              multiline
              rows={3}
              fullWidth
              variant="standard"
              sx={fieldStyle}
              InputLabelProps={{ shrink: true }}
            />

            {result && !result.ok && (
              <Alert
                severity="error"
                sx={{ bgcolor: alpha(theme.palette.error.main, 0.08), color: 'text.primary' }}
              >
                {result.message}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={pending}
              className="btn-gold-shimmer"
              sx={{ py: 2, fontSize: '0.75rem', letterSpacing: '0.15em', fontWeight: 600 }}
            >
              {pending ? <CircularProgress size={20} color="inherit" /> : 'Request Appointment'}
            </Button>

            <Typography sx={{ color: 'text.secondary', fontSize: '0.65rem', opacity: 0.65, textAlign: 'center' }}>
              We&rsquo;ll call you to confirm. No payment is taken online.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={toast}
        autoHideDuration={6000}
        onClose={() => setToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToast(false)}
          severity="success"
          sx={{
            bgcolor: 'background.paper',
            color: 'primary.main',
            border: `1px solid ${theme.palette.primary.main}`,
          }}
        >
          {result?.message}
        </Alert>
      </Snackbar>
    </>
  );
}
