'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
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
  MenuItem,
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
import { ArrowDown, ArrowUp, ChevronDown, GripVertical, Image as ImageIcon, Pencil, Plus, Trash2, Upload } from 'lucide-react';

import { deleteCategory, reorderCategories, saveCategory, toggleCategoryActive, uploadCategoryImage } from '@/app/actions/categories';
import ConfirmDialog from '@/components/ConfirmDialog';
import { PALETTE } from '@/constants/palette';
import { imageSrc } from '@/lib/site';
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
  parentId: '',
  badge: '',
  showInNav: true,
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
      parentId: c.parent_id ?? '',
      badge: c.badge ?? '',
      showInNav: c.show_in_nav,
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

  const [uploading, setUploading] = useState(false);
  const uploadPhoto = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.set('file', file);
    const result = await uploadCategoryImage(formData);
    setUploading(false);
    setToast(result);
    if (result.ok && result.path) set('heroImagePath', result.path);
  };

  // Collections reorder among their siblings only, so a sub-collection never jumps under a different parent.
  const [order, setOrder] = useState(categories);
  useEffect(() => setOrder(categories), [categories]);
  const dragId = useRef<string | null>(null);

  const moveCategory = (id: string, targetId: string) => {
    const moving = order.find((c) => c.id === id);
    const target = order.find((c) => c.id === targetId);
    if (!moving || !target || moving.id === target.id || moving.parent_id !== target.parent_id) return;
    const siblings = order.filter((c) => c.parent_id === moving.parent_id);
    const from = siblings.findIndex((c) => c.id === moving.id);
    const to = siblings.findIndex((c) => c.id === target.id);
    siblings.splice(to, 0, siblings.splice(from, 1)[0]);
    const rank = new Map(siblings.map((c, i) => [c.id, i]));
    setOrder((prev) => [...prev].sort((a, b) => (rank.has(a.id) && rank.has(b.id) ? rank.get(a.id)! - rank.get(b.id)! : 0)));
    run(() => reorderCategories(siblings.map((c) => c.id)));
  };

  const siblingStep = (c: Category, step: -1 | 1) => {
    const siblings = order.filter((s) => s.parent_id === c.parent_id);
    const target = siblings[siblings.findIndex((s) => s.id === c.id) + step];
    if (target) moveCategory(c.id, target.id);
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
              <TableCell sx={{ width: 84 }}>
                <Typography component="span" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Order</Typography>
              </TableCell>
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
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                  No collections yet. Use “Add collection” to create the first one.
                </TableCell>
              </TableRow>
            ) : (
              order.map((c) => {
                const siblings = order.filter((s) => s.parent_id === c.parent_id);
                const index = siblings.findIndex((s) => s.id === c.id);
                return (
                <TableRow
                  key={c.id}
                  hover
                  draggable={!pending}
                  onDragStart={() => (dragId.current = c.id)}
                  onDragOver={(e) => {
                    const moving = order.find((s) => s.id === dragId.current);
                    if (moving && moving.parent_id === c.parent_id) e.preventDefault();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragId.current) moveCategory(dragId.current, c.id);
                    dragId.current = null;
                  }}
                  onDragEnd={() => (dragId.current = null)}
                  sx={{ cursor: pending ? 'default' : 'grab' }}
                >
                  <TableCell sx={{ whiteSpace: 'nowrap', pl: c.parent_id ? 3 : 1 }}>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', color: 'text.secondary' }}>
                      <GripVertical size={14} aria-hidden="true" />
                      <IconButton size="small" disabled={pending || index === 0} onClick={() => siblingStep(c, -1)} aria-label={`Move ${c.name} up`}>
                        <ArrowUp size={13} />
                      </IconButton>
                      <IconButton size="small" disabled={pending || index === siblings.length - 1} onClick={() => siblingStep(c, 1)} aria-label={`Move ${c.name} down`}>
                        <ArrowDown size={13} />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '0.86rem', fontWeight: 500, pl: c.parent_id ? 2.5 : 0 }}>
                      {c.parent_id && <Box component="span" sx={{ color: 'text.secondary', mr: 0.75 }}>↳</Box>}
                      {c.name}
                    </Typography>
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
                );
              })
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

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
              <TextField
                select
                label="Sits under"
                value={editing?.parentId ?? ''}
                onChange={(e) => set('parentId', e.target.value)}
                error={Boolean(errors.parentId)}
                helperText={errors.parentId || 'Makes this a sub-collection'}
              >
                <MenuItem value="">Top level (its own menu item)</MenuItem>
                {categories
                  .filter((c) => !c.parent_id && c.id !== editing?.id)
                  .map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
              </TextField>

              <TextField
                label="Menu badge"
                value={editing?.badge ?? ''}
                onChange={(e) => set('badge', e.target.value)}
                placeholder="NEW ARRIVAL"
                helperText="Small label on the menu card"
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
              </AccordionDetails>
            </Accordion>

            <Box>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 1 }}>Collection photo</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 96,
                    height: 96,
                    flexShrink: 0,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    bgcolor: PALETTE.icingWash,
                    border: `1px solid ${PALETTE.icing}`,
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {editing?.heroImagePath ? (
                    <Box component="img" src={imageSrc(editing.heroImagePath)} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ImageIcon size={22} color={PALETTE.inkSoft} aria-hidden="true" />
                  )}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
                  <Button component="label" size="small" variant="outlined" startIcon={uploading ? <CircularProgress size={14} /> : <Upload size={14} />} disabled={uploading}>
                    {editing?.heroImagePath ? 'Replace photo' : 'Upload photo'}
                    <input
                      type="file"
                      hidden
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadPhoto(file);
                        e.target.value = '';
                      }}
                    />
                  </Button>
                  {editing?.heroImagePath && (
                    <Button size="small" color="inherit" onClick={() => set('heroImagePath', '')} sx={{ fontSize: '0.75rem' }}>
                      Remove photo
                    </Button>
                  )}
                  <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                    Shown on the homepage, the menu and the collections strip. Square works best.
                  </Typography>
                </Box>
              </Box>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={editing?.isActive ?? true}
                  onChange={(e) => set('isActive', e.target.checked)}
                />
              }
              label={<Typography sx={{ fontSize: '0.88rem' }}>Show on website</Typography>}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={editing?.showInNav ?? true}
                  onChange={(e) => set('showInNav', e.target.checked)}
                />
              }
              label={
                <Box>
                  <Typography sx={{ fontSize: '0.88rem' }}>Show in menu</Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                    Off keeps the page live but hides it from the main menu
                  </Typography>
                </Box>
              }
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

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Delete this collection?"
        body={
          <>
            <strong>{confirmDelete?.name}</strong> and its page will be removed from the website.
          </>
        }
        hint={'To hide it without deleting, switch "On website" off instead.'}
        confirmLabel="Delete permanently"
        pending={pending}
        onConfirm={() => {
          const target = confirmDelete;
          setConfirmDelete(null);
          if (target) run(() => deleteCategory(target.id));
        }}
        onCancel={() => setConfirmDelete(null)}
      />

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
