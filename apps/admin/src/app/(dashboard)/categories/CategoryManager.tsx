'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Plus, Pencil, Trash2, ChevronDown } from 'lucide-react';

import { saveCategory, toggleCategoryActive, deleteCategory } from '@/app/actions/categories';
import { PALETTE } from '@/constants/palette';
import type { Category } from '@/types/database';

interface CategoryManagerProps {
  categories: Category[];
  productCounts: Record<string, number>;
}

const EMPTY = {
  id: '',
  name: '',
  slug: '',
  description: '',
  heroEyebrow: '',
  heroImagePath: '',
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  displayOrder: '0',
  isActive: true,
};

export default function CategoryManager({ categories, productCounts }: CategoryManagerProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<typeof EMPTY | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ ok: boolean; message: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Category | null>(null);

  const openNew = () => {
    setErrors({});
    setEditing({ ...EMPTY, displayOrder: String(categories.length + 1) });
  };

  const openEdit = (c: Category) => {
    setErrors({});
    setEditing({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description ?? '',
      heroEyebrow: c.hero_eyebrow ?? '',
      heroImagePath: c.hero_image_path ?? '',
      metaTitle: c.meta_title ?? '',
      metaDescription: c.meta_description ?? '',
      metaKeywords: c.meta_keywords?.join(', ') ?? '',
      displayOrder: String(c.display_order),
      isActive: c.is_active,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const formData = new FormData();
    Object.entries(editing).forEach(([k, v]) => formData.set(k, String(v)));

    startTransition(async () => {
      const result = await saveCategory(formData);
      setErrors(result.fieldErrors ?? {});
      setToast(result);
      if (result.ok) {
        setEditing(null);
        router.refresh();
      }
    });
  };

  const run = (fn: () => Promise<{ ok: boolean; message: string }>) => {
    startTransition(async () => {
      setToast(await fn());
      router.refresh();
    });
  };

  const set = (key: keyof typeof EMPTY, value: string | boolean) => {
    setEditing((prev) => (prev ? { ...prev, [key]: value } : prev));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  return (
    <>
      <Box sx={{ mb: 2.5 }}>
        <Button variant="contained" startIcon={<Plus size={16} />} onClick={openNew}>
          Add collection
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Collection</TableCell>
              <TableCell>Web address</TableCell>
              <TableCell align="right">Products</TableCell>
              <TableCell align="center">On website</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                  No collections yet.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell>
                    <Typography sx={{ fontSize: '0.86rem', fontWeight: 500 }}>{c.name}</Typography>
                    {c.description && (
                      <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                        {c.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`/collections/${c.slug}`}
                      size="small"
                      sx={{ height: 20, fontSize: '0.68rem', bgcolor: PALETTE.icingWash }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: '0.82rem' }}>
                    {productCounts[c.id] ?? 0}
                  </TableCell>
                  <TableCell align="center">
                    <Switch
                      size="small"
                      checked={c.is_active}
                      disabled={pending}
                      onChange={(e) => run(() => toggleCategoryActive(c.id, e.target.checked))}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(c)} aria-label={`Edit ${c.name}`}>
                      <Pencil size={15} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setConfirmDelete(c)}
                      aria-label={`Delete ${c.name}`}
                    >
                      <Trash2 size={15} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={Boolean(editing)} onClose={() => !pending && setEditing(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontSize: '1.15rem' }}>
          {editing?.id ? 'Edit collection' : 'Add collection'}
        </DialogTitle>
        <Box component="form" onSubmit={handleSave}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              label="Name"
              value={editing?.name ?? ''}
              onChange={(e) => set('name', e.target.value)}
              required
              fullWidth
              autoFocus
              error={Boolean(errors.name)}
              helperText={errors.name || 'e.g. Anklets'}
            />

            <TextField
              label="Web address"
              value={editing?.slug ?? ''}
              onChange={(e) => set('slug', e.target.value)}
              fullWidth
              error={Boolean(errors.slug)}
              helperText={errors.slug || 'Leave blank to generate from the name'}
              slotProps={{ input: { startAdornment: <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', mr: 0.5 }}>/collections/</Typography> } }}
            />

            <TextField
              label="Short description"
              value={editing?.description ?? ''}
              onChange={(e) => set('description', e.target.value)}
              multiline
              rows={2}
              fullWidth
              helperText="Shown under the heading on the collection page"
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
              <TextField
                label="Eyebrow text"
                value={editing?.heroEyebrow ?? ''}
                onChange={(e) => set('heroEyebrow', e.target.value)}
                helperText="Small label above the title"
              />
              <TextField
                label="Order"
                value={editing?.displayOrder ?? '0'}
                onChange={(e) => set('displayOrder', e.target.value)}
                type="number"
                helperText="Lower numbers appear first"
              />
            </Box>

            <Accordion variant="outlined" disableGutters sx={{ '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                <Typography sx={{ fontSize: '0.85rem' }}>Search engine settings</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                  Controls how this collection appears in Google results. Leave blank to generate
                  automatically.
                </Typography>
                <TextField
                  label="Page title"
                  value={editing?.metaTitle ?? ''}
                  onChange={(e) => set('metaTitle', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Description"
                  value={editing?.metaDescription ?? ''}
                  onChange={(e) => set('metaDescription', e.target.value)}
                  multiline
                  rows={2}
                  fullWidth
                  helperText="Around 155 characters"
                />
                <TextField
                  label="Keywords"
                  value={editing?.metaKeywords ?? ''}
                  onChange={(e) => set('metaKeywords', e.target.value)}
                  fullWidth
                  helperText="Separate with commas"
                />
                <TextField
                  label="Hero image path"
                  value={editing?.heroImagePath ?? ''}
                  onChange={(e) => set('heroImagePath', e.target.value)}
                  fullWidth
                  helperText="e.g. /images/rings.webp"
                />
              </AccordionDetails>
            </Accordion>

            <FormControlLabel
              control={
                <Switch
                  checked={editing?.isActive ?? true}
                  onChange={(e) => set('isActive', e.target.checked)}
                />
              }
              label={<Typography sx={{ fontSize: '0.88rem' }}>Show on website</Typography>}
            />

            {toast && !toast.ok && <Alert severity="error">{toast.message}</Alert>}
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setEditing(null)} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={pending}>
              {pending ? <CircularProgress size={18} color="inherit" /> : 'Save'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={Boolean(confirmDelete)} onClose={() => setConfirmDelete(null)}>
        <DialogTitle sx={{ fontSize: '1.1rem' }}>Delete this collection?</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '0.9rem' }}>
            <strong>{confirmDelete?.name}</strong> and its page will be removed from the website.
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', mt: 1.5 }}>
            To hide it without deleting, switch &ldquo;On website&rdquo; off instead.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            disabled={pending}
            onClick={() => {
              const target = confirmDelete;
              setConfirmDelete(null);
              if (target) run(() => deleteCategory(target.id));
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(toast?.ok)}
        autoHideDuration={5000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setToast(null)}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </>
  );
}
