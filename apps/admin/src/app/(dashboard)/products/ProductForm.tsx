'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Paper,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import { saveProduct } from '@/app/actions/products';
import { calculatePrice, formatRupees, type Karat, type MakingChargeType } from '@/lib/pricing';
import { PALETTE } from '@/constants/palette';
import type { Category } from '@/types/database';
import type { ProductRow } from '@/lib/catalogue';

interface ProductFormProps {
  product: ProductRow | null;
  categories: Category[];
  rates: Record<string, number>;
}

const KARATS: Karat[] = ['22K', '18K', '24K'];

const MAKING_TYPES: { value: MakingChargeType; label: string; hint: string }[] = [
  { value: 'per_gram', label: 'Per gram', hint: '₹ per gram of gold' },
  { value: 'flat', label: 'Fixed amount', hint: 'One flat ₹ amount' },
  { value: 'percentage', label: 'Percentage', hint: '% of the gold value' },
];

export default function ProductForm({ product, categories, rates }: ProductFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ ok: boolean; message: string } | null>(null);

  const [form, setForm] = useState({
    sku: product?.sku ?? '',
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    categoryId: product?.category_id ?? categories[0]?.id ?? '',
    karat: (product?.karat ?? '22K') as Karat,
    grossWeightG: product ? String(product.gross_weight_g) : '',
    netWeightG: product ? String(product.net_weight_g) : '',
    wastagePct: product ? String(product.wastage_pct) : '10',
    makingChargeType: (product?.making_charge_type ?? 'per_gram') as MakingChargeType,
    makingChargeValue: product ? String(product.making_charge_value) : '',
    stoneCharges: product ? String(product.stone_charges) : '0',
    hallmarkCharges: product ? String(product.hallmark_charges) : '45',
    occasion: product?.occasion?.join(', ') ?? '',
    gender: product?.gender ?? '',
    isActive: product?.is_active ?? true,
    isFeatured: product?.is_featured ?? false,
  });

  const set = (key: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  // Recomputed as fields change, so staff see the customer-facing price before saving.
  const preview = useMemo(() => {
    const rate = rates[form.karat];
    if (!rate) return null;
    return calculatePrice(
      {
        netWeightG: Number(form.netWeightG),
        karat: form.karat,
        wastagePct: Number(form.wastagePct) || 0,
        makingChargeType: form.makingChargeType,
        makingChargeValue: Number(form.makingChargeValue) || 0,
        stoneCharges: Number(form.stoneCharges) || 0,
        hallmarkCharges: Number(form.hallmarkCharges) || 0,
      },
      rate,
    );
  }, [form, rates]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    if (product) formData.set('id', product.id);
    Object.entries(form).forEach(([k, v]) => formData.set(k, String(v)));

    startTransition(async () => {
      const result = await saveProduct(formData);
      setErrors(result.fieldErrors ?? {});
      setToast(result);
      if (result.ok) {
        router.push('/products');
        router.refresh();
      }
    });
  };

  const makingHint = MAKING_TYPES.find((t) => t.value === form.makingChargeType)?.hint;

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' }, gap: 3, alignItems: 'start' }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h3" sx={{ fontSize: '1rem', mb: 2.5 }}>
              Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr' }, gap: 2.5 }}>
                <TextField
                  label="Product name"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  required
                  fullWidth
                  error={Boolean(errors.name)}
                  helperText={errors.name}
                />
                <TextField
                  label="SKU"
                  value={form.sku}
                  onChange={(e) => set('sku', e.target.value)}
                  required
                  fullWidth
                  placeholder="NJ-RNG-001"
                  error={Boolean(errors.sku)}
                  helperText={errors.sku || 'Your own reference code'}
                />
              </Box>

              <TextField
                label="Description"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                multiline
                rows={3}
                fullWidth
                helperText="Shown on the product page"
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                <TextField
                  select
                  label="Collection"
                  value={form.categoryId}
                  onChange={(e) => set('categoryId', e.target.value)}
                  required
                  fullWidth
                  error={Boolean(errors.categoryId)}
                  helperText={errors.categoryId}
                >
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                      {!c.is_active && ' (hidden)'}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Gold purity"
                  value={form.karat}
                  onChange={(e) => set('karat', e.target.value)}
                  required
                  fullWidth
                  helperText={rates[form.karat] ? `Rate: ${formatRupees(rates[form.karat])}/g` : 'No rate set for this purity'}
                >
                  {KARATS.map((k) => (
                    <MenuItem key={k} value={k}>
                      {k}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>
          </Paper>

          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h3" sx={{ fontSize: '1rem', mb: 0.5 }}>
              Weight &amp; charges
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', mb: 2.5 }}>
              These determine the price shown to customers.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2.5 }}>
                <TextField
                  label="Gross weight"
                  value={form.grossWeightG}
                  onChange={(e) => set('grossWeightG', e.target.value)}
                  type="number"
                  required
                  slotProps={{
                    input: { endAdornment: <InputAdornment position="end">g</InputAdornment> },
                    htmlInput: { step: '0.001', min: 0 },
                  }}
                  error={Boolean(errors.grossWeightG)}
                  helperText={errors.grossWeightG || 'Including stones'}
                />
                <TextField
                  label="Net gold weight"
                  value={form.netWeightG}
                  onChange={(e) => set('netWeightG', e.target.value)}
                  type="number"
                  required
                  slotProps={{
                    input: { endAdornment: <InputAdornment position="end">g</InputAdornment> },
                    htmlInput: { step: '0.001', min: 0 },
                  }}
                  error={Boolean(errors.netWeightG)}
                  helperText={errors.netWeightG || 'Gold only — this sets the price'}
                />
                <TextField
                  label="Wastage"
                  value={form.wastagePct}
                  onChange={(e) => set('wastagePct', e.target.value)}
                  type="number"
                  slotProps={{
                    input: { endAdornment: <InputAdornment position="end">%</InputAdornment> },
                    htmlInput: { step: '0.01', min: 0, max: 100 },
                  }}
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                <TextField
                  select
                  label="Making charge type"
                  value={form.makingChargeType}
                  onChange={(e) => set('makingChargeType', e.target.value)}
                  helperText={makingHint}
                >
                  {MAKING_TYPES.map((t) => (
                    <MenuItem key={t.value} value={t.value}>
                      {t.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Making charge"
                  value={form.makingChargeValue}
                  onChange={(e) => set('makingChargeValue', e.target.value)}
                  type="number"
                  slotProps={{
                    input: {
                      startAdornment:
                        form.makingChargeType === 'percentage' ? undefined : (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      endAdornment:
                        form.makingChargeType === 'percentage' ? (
                          <InputAdornment position="end">%</InputAdornment>
                        ) : undefined,
                    },
                    htmlInput: { step: '0.01', min: 0 },
                  }}
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                <TextField
                  label="Stone charges"
                  value={form.stoneCharges}
                  onChange={(e) => set('stoneCharges', e.target.value)}
                  type="number"
                  slotProps={{
                    input: { startAdornment: <InputAdornment position="start">₹</InputAdornment> },
                    htmlInput: { step: '0.01', min: 0 },
                  }}
                />
                <TextField
                  label="Hallmarking"
                  value={form.hallmarkCharges}
                  onChange={(e) => set('hallmarkCharges', e.target.value)}
                  type="number"
                  slotProps={{
                    input: { startAdornment: <InputAdornment position="start">₹</InputAdornment> },
                    htmlInput: { step: '0.01', min: 0 },
                  }}
                />
              </Box>
            </Box>
          </Paper>

          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h3" sx={{ fontSize: '1rem', mb: 2.5 }}>
              Visibility &amp; tags
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                <TextField
                  label="Occasions"
                  value={form.occasion}
                  onChange={(e) => set('occasion', e.target.value)}
                  placeholder="wedding, daily-wear"
                  helperText="Separate with commas"
                />
                <TextField
                  select
                  label="Worn by"
                  value={form.gender}
                  onChange={(e) => set('gender', e.target.value)}
                >
                  <MenuItem value="">Not specified</MenuItem>
                  <MenuItem value="women">Women</MenuItem>
                  <MenuItem value="men">Men</MenuItem>
                  <MenuItem value="unisex">Unisex</MenuItem>
                  <MenuItem value="kids">Kids</MenuItem>
                </TextField>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.isActive}
                      onChange={(e) => set('isActive', e.target.checked)}
                    />
                  }
                  label={
                    <Box>
                      <Typography sx={{ fontSize: '0.88rem' }}>Show on website</Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                        Customers can see it
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.isFeatured}
                      onChange={(e) => set('isFeatured', e.target.checked)}
                    />
                  }
                  label={
                    <Box>
                      <Typography sx={{ fontSize: '0.88rem' }}>Featured</Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                        Highlighted as a signature piece
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            </Box>
          </Paper>
        </Box>

        <Box sx={{ position: { lg: 'sticky' }, top: { lg: 88 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Paper variant="outlined" sx={{ p: 3, bgcolor: PALETTE.icingWash }}>
            <Typography variant="h3" sx={{ fontSize: '0.95rem', mb: 0.5 }}>
              Price the customer sees
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 2 }}>
              Updates as you type.
            </Typography>

            {preview ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  { label: `Gold (${form.karat})`, value: preview.metalCost },
                  { label: 'Wastage', value: preview.wastageCost },
                  { label: 'Making', value: preview.makingCharges },
                  ...(preview.stoneCharges > 0 ? [{ label: 'Stones', value: preview.stoneCharges }] : []),
                  ...(preview.hallmarkCharges > 0 ? [{ label: 'Hallmarking', value: preview.hallmarkCharges }] : []),
                ].map((row) => (
                  <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                      {row.label}
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem' }}>{formatRupees(row.value)}</Typography>
                  </Box>
                ))}

                <Divider sx={{ my: 0.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>GST (3%)</Typography>
                  <Typography sx={{ fontSize: '0.8rem' }}>{formatRupees(preview.gst)}</Typography>
                </Box>
                <Divider sx={{ my: 0.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Total</Typography>
                  <Typography sx={{ fontSize: '1.3rem', fontWeight: 600, color: 'primary.main' }}>
                    {formatRupees(preview.total)}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary', fontStyle: 'italic' }}>
                {rates[form.karat]
                  ? 'Enter a net weight to see the price.'
                  : `No ${form.karat} rate is set. Set one under Gold Rates.`}
              </Typography>
            )}
          </Paper>

          <Button type="submit" variant="contained" size="large" disabled={pending} sx={{ py: 1.25 }}>
            {pending ? <CircularProgress size={22} color="inherit" /> : product ? 'Save changes' : 'Create product'}
          </Button>
          <Button variant="outlined" onClick={() => router.push('/products')} disabled={pending}>
            Cancel
          </Button>

          {toast && !toast.ok && <Alert severity="error">{toast.message}</Alert>}
        </Box>
      </Box>

      <Snackbar
        open={Boolean(toast?.ok)}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success">{toast?.message}</Alert>
      </Snackbar>
    </>
  );
}
