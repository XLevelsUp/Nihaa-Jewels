'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Chip,
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
import { CheckCircle2, Circle, Tag, X } from 'lucide-react';

import { saveProduct } from '@/app/actions/products';
import { calculatePrice, formatRupees, type DiscountType, type Karat, type MakingChargeType } from '@/lib/pricing';
import { PALETTE } from '@/constants/palette';
import { deniedMessage } from '@/lib/permissions';
import { OCCASIONS, GENDERS } from '@/constants/filters';
import type { Category, ProductStatus } from '@/types/database';
import type { ProductRow } from '@/lib/catalogue';

interface ProductFormProps {
  product: ProductRow | null;
  categories: Category[];
  rates: Record<string, number>;
  /** From the signed-in role; the server enforces the same rules, this only avoids offering what will be refused. */
  perms?: { canPublish: boolean; canDiscount: boolean };
}

const KARATS: Karat[] = ['22K', '18K', '24K'];

// New products start as drafts so nothing reaches the website half-finished.
const STATUSES: { value: ProductStatus; label: string; hint: string }[] = [
  { value: 'draft', label: 'Draft', hint: 'Hidden from the website while you finish it' },
  { value: 'published', label: 'Published', hint: 'Live on the website' },
  { value: 'archived', label: 'Archived', hint: 'Retired: hidden, but kept with its history' },
];

const MAKING_TYPES: { value: MakingChargeType; label: string; hint: string }[] = [
  { value: 'per_gram', label: 'Per gram', hint: '₹ per gram of gold' },
  { value: 'flat', label: 'Fixed amount', hint: 'One flat ₹ amount' },
  { value: 'percentage', label: 'Percentage', hint: '% of the gold value' },
];

export default function ProductForm({ product, categories, rates, perms = { canPublish: true, canDiscount: true } }: ProductFormProps) {
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
    discountType: (product?.discount_type ?? 'percentage') as DiscountType,
    discountValue: product ? String(product.discount_value ?? 0) : '0',
    occasion: product?.occasion?.join(', ') ?? '',
    gender: product?.gender ?? '',
    status: (product?.status ?? 'draft') as ProductStatus,
    isFeatured: product?.is_featured ?? false,
    metalColour: product?.metal_colour ?? '',
    huid: product?.huid ?? '',
    sizeLabel: product?.size_label ?? '',
    dimensions: product?.dimensions ?? '',
    closure: product?.closure ?? '',
    careInstructions: product?.care_instructions ?? '',
  });

  const set = (key: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  // The discount fields stay out of the way behind "Apply discount" until a product actually has an offer.
  const [discountOpen, setDiscountOpen] = useState(() => Number(product?.discount_value ?? 0) > 0);
  const removeDiscount = () => {
    set('discountValue', '0');
    setDiscountOpen(false);
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
        discountType: form.discountType,
        discountValue: Number(form.discountValue) || 0,
      },
      rate,
    );
  }, [form, rates]);

  // Unsaved-changes tracking: compared against the last saved state, so saving clears the warning.
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(form));
  const dirty = JSON.stringify(form) !== savedSnapshot;
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // What a piece needs before customers see it; publishing stays locked until the essentials are in.
  const photoCount = product?.images.length ?? 0;
  const checklist = [
    { label: 'Name and collection', done: Boolean(form.name.trim() && form.categoryId), essential: true },
    { label: 'Net gold weight', done: Number(form.netWeightG) > 0, essential: true },
    { label: `Price (needs a ${form.karat} gold rate)`, done: Boolean(preview), essential: true },
    { label: product ? 'At least one photo' : 'At least one photo (add after creating)', done: photoCount > 0, essential: true },
    { label: 'HUID', done: /^[A-Z0-9]{6}$/.test(form.huid), essential: false },
    { label: 'Description', done: form.description.trim().length > 0, essential: false },
  ];
  const readyToPublish = checklist.every((c) => c.done || !c.essential);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.status === 'published' && !readyToPublish) {
      setToast({ ok: false, message: 'This product is not ready to publish yet. Complete the checklist, or save it as a draft.' });
      return;
    }
    const formData = new FormData();
    if (product) formData.set('id', product.id);
    Object.entries(form).forEach(([k, v]) => formData.set(k, String(v)));

    startTransition(async () => {
      const result = await saveProduct(formData);
      setErrors(result.fieldErrors ?? {});
      setToast(result);
      if (!result.ok) return;
      setSavedSnapshot(JSON.stringify(form));
      if (product) {
        // Stay on the page: staff usually save and keep refining.
        router.refresh();
      } else if (result.id) {
        // A new product goes straight to its photos, which can only be added once it exists.
        router.push(`/products/${result.id}?created=1#photos`);
      }
    });
  };

  const cancel = () => {
    if (dirty && !window.confirm('You have unsaved changes. Leave without saving?')) return;
    router.push('/products');
  };

  const makingHint = MAKING_TYPES.find((t) => t.value === form.makingChargeType)?.hint;
  const sectionSx = { p: 3, scrollMarginTop: 88 };
  const SECTIONS = [
    { id: 'details', label: 'Details' },
    { id: 'charges', label: 'Weight & charges' },
    { id: 'gold-details', label: 'Gold details' },
    { id: 'status', label: 'Status & visibility' },
  ];

  return (
    <>
      <Box
        component="form"
        ref={formRef}
        onSubmit={handleSubmit}
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' }, gap: 3, alignItems: 'start', pb: { xs: 10, lg: 0 } }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper variant="outlined" id="details" sx={sectionSx}>
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

          <Paper variant="outlined" id="charges" sx={sectionSx}>
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

              {discountOpen ? (
                <Box sx={{ p: 2.5, border: `1px solid ${PALETTE.icing}`, borderRadius: 1, bgcolor: PALETTE.blushWash }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600, fontSize: '0.9rem' }}>
                      <Tag size={16} aria-hidden="true" />
                      Discount
                    </Typography>
                    <Button size="small" color="inherit" startIcon={<X size={14} />} onClick={removeDiscount} disabled={!perms.canDiscount}>
                      Remove discount
                    </Button>
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                    <TextField
                      select
                      label="Discount type"
                      disabled={!perms.canDiscount}
                      value={form.discountType}
                      onChange={(e) => set('discountType', e.target.value)}
                      helperText="Taken off wastage + making only; never the gold value."
                    >
                      <MenuItem value="percentage">Percentage (%)</MenuItem>
                      <MenuItem value="flat">Flat amount (₹)</MenuItem>
                    </TextField>
                    <TextField
                      label={form.discountType === 'flat' ? 'Amount off' : 'Percentage off'}
                      value={form.discountValue === '0' ? '' : form.discountValue}
                      disabled={!perms.canDiscount}
                      onChange={(e) => set('discountValue', e.target.value)}
                      type="number"
                      autoFocus
                      error={!!errors.discountValue}
                      helperText={
                        errors.discountValue ||
                        (form.discountType === 'flat'
                          ? 'Capped at wastage + making.'
                          : 'Up to 100%. GST applies after the discount.')
                      }
                      slotProps={{
                        input:
                          form.discountType === 'flat'
                            ? { startAdornment: <InputAdornment position="start">₹</InputAdornment> }
                            : { endAdornment: <InputAdornment position="end">%</InputAdornment> },
                        htmlInput: { step: form.discountType === 'flat' ? '1' : '0.5', min: 0, max: form.discountType === 'flat' ? undefined : 100 },
                      }}
                    />
                  </Box>
                  {preview && preview.discount > 0 && (
                    <Typography sx={{ mt: 1.5, fontSize: '0.8rem', fontWeight: 600, color: 'primary.main' }}>
                      Customer saves {formatRupees(preview.originalTotal - preview.total)} · shown as {preview.percentOff}% Off
                    </Typography>
                  )}
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Button variant="outlined" startIcon={<Tag size={16} />} onClick={() => setDiscountOpen(true)} disabled={!perms.canDiscount}>
                    Apply discount
                  </Button>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    {perms.canDiscount ? 'Optional. A percentage or flat amount off wastage + making.' : deniedMessage('discounts.edit')}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>

          <Paper variant="outlined" id="gold-details" sx={sectionSx}>
            <Typography variant="h3" sx={{ fontSize: '1rem', mb: 0.5 }}>
              Gold details
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 2.5 }}>
              Shown in the product&rsquo;s specifications on the website. Leave blank what does not apply.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
              <TextField
                select
                label="Gold colour"
                value={form.metalColour}
                onChange={(e) => set('metalColour', e.target.value)}
              >
                <MenuItem value="">Not specified</MenuItem>
                <MenuItem value="yellow">Yellow gold</MenuItem>
                <MenuItem value="rose">Rose gold</MenuItem>
                <MenuItem value="white">White gold</MenuItem>
              </TextField>
              <TextField
                label="HUID"
                value={form.huid}
                onChange={(e) => set('huid', e.target.value.toUpperCase())}
                error={!!errors.huid}
                helperText={errors.huid || 'BIS hallmark ID: 6 letters or digits, unique to this piece'}
                slotProps={{ htmlInput: { maxLength: 6, style: { textTransform: 'uppercase', letterSpacing: '0.15em' } } }}
              />
              <TextField
                label="Size or length"
                value={form.sizeLabel}
                onChange={(e) => set('sizeLabel', e.target.value)}
                helperText="e.g. 18 in, 2.6, Ring size 14"
              />
              <TextField
                label="Dimensions"
                value={form.dimensions}
                onChange={(e) => set('dimensions', e.target.value)}
                helperText="e.g. Pendant 32 × 24 mm"
              />
              <TextField
                label="Closure"
                value={form.closure}
                onChange={(e) => set('closure', e.target.value)}
                helperText="e.g. S-hook, Lobster clasp, Screw back"
              />
              <TextField
                label="Care instructions"
                value={form.careInstructions}
                onChange={(e) => set('careInstructions', e.target.value)}
                multiline
                minRows={2}
                helperText="Leave blank to use the standard care note"
              />
            </Box>
          </Paper>

          <Paper variant="outlined" id="status" sx={sectionSx}>
            <Typography variant="h3" sx={{ fontSize: '1rem', mb: 2.5 }}>
              Status, visibility &amp; tags
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                <TextField
                  select
                  label="Occasions"
                  value={form.occasion ? form.occasion.split(',').map((s) => s.trim()).filter(Boolean) : []}
                  onChange={(e) => {
                    const v = e.target.value as unknown as string[];
                    set('occasion', v.join(', '));
                  }}
                  slotProps={{
                    select: {
                      multiple: true,
                      renderValue: (selected) => {
                        const values = selected as string[];
                        if (values.length === 0) return <span style={{ opacity: 0.6 }}>None selected</span>;
                        return (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {values.map((v) => (
                              <Chip
                                key={v}
                                size="small"
                                label={OCCASIONS.find((o) => o.value === v)?.label ?? v}
                                sx={{ height: 20, fontSize: '0.7rem' }}
                              />
                            ))}
                          </Box>
                        );
                      },
                    },
                  }}
                  helperText="Choose any that apply"
                >
                  {OCCASIONS.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Worn by"
                  value={form.gender}
                  onChange={(e) => set('gender', e.target.value)}
                  helperText="Unisex covers both women and men"
                >
                  <MenuItem value="">Not specified</MenuItem>
                  {GENDERS.map((g) => (
                    <MenuItem key={g.value} value={g.value}>
                      {g.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 3 }}>
                <TextField
                  select
                  label="Status"
                  value={form.status}
                  onChange={(e) => set('status', e.target.value)}
                  helperText={STATUSES.find((s) => s.value === form.status)?.hint}
                  sx={{ minWidth: 220 }}
                >
                  {STATUSES.map((s) => (
                    <MenuItem key={s.value} value={s.value} disabled={s.value === 'published' && (!readyToPublish || !perms.canPublish) && form.status !== 'published'}>
                      {s.label}
                      {s.value === 'published' && !readyToPublish && ' — complete the checklist first'}
                    </MenuItem>
                  ))}
                </TextField>
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
          <Paper variant="outlined" sx={{ p: 2, display: { xs: 'none', lg: 'block' } }}>
            <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'text.secondary', mb: 1 }}>
              On this page
            </Typography>
            <Box component="nav" aria-label="Form sections" sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {SECTIONS.map((s) => (
                <Button key={s.id} size="small" href={`#${s.id}`} sx={{ fontSize: '0.75rem', minWidth: 0, px: 1 }}>
                  {s.label}
                </Button>
              ))}
            </Box>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 1 }}>
              {readyToPublish ? 'Ready to publish' : 'Before publishing'}
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {checklist.map((c) => (
                <Box component="li" key={c.label} sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.8rem', color: c.done ? 'text.primary' : 'text.secondary' }}>
                  {c.done ? (
                    <CheckCircle2 size={15} color="#2E7D53" aria-label="Done" />
                  ) : (
                    <Circle size={15} color={c.essential ? '#B3261E' : PALETTE.inkSoft} aria-label={c.essential ? 'Required' : 'Recommended'} />
                  )}
                  {c.label}
                  {!c.essential && !c.done && (
                    <Typography component="span" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>(recommended)</Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Paper>

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
                  ...(preview.discount > 0
                    ? [{
                        label: form.discountType === 'flat'
                          ? `Discount (flat, off wastage & making)`
                          : `Discount (${Number(form.discountValue)}% off wastage & making)`,
                        value: -preview.discount,
                      }]
                    : []),
                ].map((row) => (
                  <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Typography sx={{ fontSize: '0.8rem', color: row.value < 0 ? 'primary.main' : 'text.secondary' }}>
                      {row.label}
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', whiteSpace: 'nowrap', color: row.value < 0 ? 'primary.main' : undefined }}>
                      {row.value < 0 ? `− ${formatRupees(-row.value)}` : formatRupees(row.value)}
                    </Typography>
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
                  <Box sx={{ textAlign: 'right' }}>
                    {preview.percentOff > 0 && (
                      <Typography component="s" sx={{ fontSize: '0.8rem', color: 'text.secondary', mr: 1 }}>
                        {formatRupees(preview.originalTotal)}
                      </Typography>
                    )}
                    <Typography component="span" sx={{ fontSize: '1.3rem', fontWeight: 600, color: 'primary.main' }}>
                      {formatRupees(preview.total)}
                    </Typography>
                    {preview.percentOff > 0 && (
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'primary.main' }}>
                        {preview.percentOff}% Off on the website
                      </Typography>
                    )}
                  </Box>
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

          <Box sx={{ display: { xs: 'none', lg: 'flex' }, flexDirection: 'column', gap: 2 }}>
            <Button type="submit" variant="contained" size="large" disabled={pending} sx={{ py: 1.25 }}>
              {pending ? <CircularProgress size={22} color="inherit" /> : product ? 'Save changes' : 'Create product'}
            </Button>
            <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', textAlign: 'center', mt: -1 }}>
              {dirty ? 'Unsaved changes · Ctrl+S to save' : 'All changes saved'}
            </Typography>
            <Button variant="outlined" onClick={cancel} disabled={pending}>
              Back to products
            </Button>
          </Box>

          {toast && !toast.ok && <Alert severity="error">{toast.message}</Alert>}
        </Box>

        {/* Phones and tablets: the save action and live price stay on screen however far down the form staff have scrolled. */}
        <Paper
          elevation={8}
          sx={{
            display: { xs: 'flex', lg: 'none' },
            position: 'fixed',
            insetInline: 0,
            bottom: 0,
            zIndex: 1100,
            alignItems: 'center',
            gap: 2,
            px: 2,
            py: 1.5,
            borderRadius: 0,
            borderTop: `1px solid ${PALETTE.icing}`,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: 'primary.main' }}>
              {preview ? formatRupees(preview.total) : '—'}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>{dirty ? 'Unsaved changes' : 'All changes saved'}</Typography>
          </Box>
          <Button type="submit" variant="contained" disabled={pending}>
            {pending ? <CircularProgress size={20} color="inherit" /> : product ? 'Save' : 'Create'}
          </Button>
        </Paper>
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
