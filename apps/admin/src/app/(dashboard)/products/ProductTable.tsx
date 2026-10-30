'use client';

// The catalogue at a glance: status tabs, search by name, SKU or HUID, and the everyday actions inline in each row.

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Copy, ImageOff, Pencil, RotateCcw, Search, SlidersHorizontal, Star, Trash2, X } from 'lucide-react';

import { deleteProduct, duplicateProduct, restoreProduct, setProductStatus } from '@/app/actions/products';
import { calculatePrice, formatRupees, type Karat } from '@/lib/pricing';
import ConfirmDialog from '@/components/ConfirmDialog';
import { PALETTE } from '@/constants/palette';
import { imageSrc } from '@/lib/site';
import type { ProductRow, ProductView } from '@/lib/catalogue';
import type { ProductStatus } from '@/types/database';

export interface ProductTableFilters {
  category: string;
  colour: '' | 'yellow' | 'rose' | 'white' | 'none';
  karat: string;
  discount: '' | 'with' | 'without';
  missing: '' | 'photo' | 'huid' | 'stale-draft';
}

const MISSING_LABELS: Record<Exclude<ProductTableFilters['missing'], ''>, string> = {
  photo: 'Needs a photo',
  huid: 'Needs a HUID',
  'stale-draft': 'Untouched drafts',
};

interface ProductTableProps {
  products: ProductRow[];
  rates: Record<string, number>;
  initialSearch: string;
  view: ProductView;
  counts: Record<ProductView, number>;
  filters: ProductTableFilters;
  categories: { id: string; name: string; isChild: boolean }[];
  perms: { canDelete: boolean; canPublish: boolean };
}

const COLOURS: { value: ProductTableFilters['colour']; label: string; swatch?: string }[] = [
  { value: 'yellow', label: 'Yellow gold', swatch: '#D4A62A' },
  { value: 'rose', label: 'Rose gold', swatch: '#D8957A' },
  { value: 'white', label: 'White gold', swatch: '#D9D9D6' },
  { value: 'none', label: 'Colour not set' },
];

const DISCOUNTS: { value: ProductTableFilters['discount']; label: string }[] = [
  { value: 'with', label: 'With a discount' },
  { value: 'without', label: 'No discount' },
];

const EMPTY_FILTERS: ProductTableFilters = { category: '', colour: '', karat: '', discount: '', missing: '' };

const VIEWS: { value: ProductView; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
  { value: 'archived', label: 'Archived' },
  { value: 'deleted', label: 'Deleted' },
];

const STATUS_STYLE: Record<ProductStatus, { label: string; bg: string; fg: string }> = {
  published: { label: 'Published', bg: 'rgba(46, 125, 83, 0.12)', fg: '#2E7D53' },
  draft: { label: 'Draft', bg: PALETTE.icingWash, fg: PALETTE.inkSoft },
  archived: { label: 'Archived', bg: 'rgba(90, 74, 66, 0.1)', fg: PALETTE.inkSoft },
};

export default function ProductTable({ products, rates, initialSearch, view, counts, filters, categories, perms }: ProductTableProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState(initialSearch);
  const [toast, setToast] = useState<{ ok: boolean; message: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ProductRow | null>(null);

  // Every navigation carries the tab, search and filters together, so changing one never resets the others.
  const go = (next: { view?: ProductView; q?: string; filters?: Partial<ProductTableFilters> } = {}) => {
    const v = next.view ?? view;
    const q = (next.q ?? search).trim();
    const f = { ...filters, ...next.filters };
    const params = new URLSearchParams();
    if (v !== 'all') params.set('view', v);
    if (q) params.set('q', q);
    for (const [key, value] of Object.entries(f)) if (value) params.set(key, value);
    const qs = params.toString();
    router.push(qs ? `/products?${qs}` : '/products');
  };

  const active = [
    filters.category && { key: 'category' as const, label: categories.find((c) => c.id === filters.category)?.name ?? 'Collection' },
    filters.colour && { key: 'colour' as const, label: COLOURS.find((c) => c.value === filters.colour)?.label ?? filters.colour },
    filters.karat && { key: 'karat' as const, label: filters.karat },
    filters.discount && { key: 'discount' as const, label: DISCOUNTS.find((d) => d.value === filters.discount)?.label ?? '' },
    filters.missing && { key: 'missing' as const, label: MISSING_LABELS[filters.missing] },
  ].filter(Boolean) as { key: keyof ProductTableFilters; label: string }[];

  const filterSx = {
    minWidth: 170,
    '& .MuiInputBase-root': { fontSize: '0.84rem', bgcolor: 'background.paper' },
  };

  const run = (action: () => Promise<{ ok: boolean; message: string; id?: string }>, then?: (id?: string) => void) => {
    startTransition(async () => {
      const result = await action();
      setToast(result);
      if (result.ok && then) then(result.id);
      else router.refresh();
    });
  };

  const priceOf = (product: ProductRow) => {
    const rate = rates[product.karat];
    if (!rate) return null;
    return calculatePrice(
      {
        netWeightG: Number(product.net_weight_g),
        karat: product.karat as Karat,
        wastagePct: Number(product.wastage_pct),
        makingChargeType: product.making_charge_type,
        makingChargeValue: Number(product.making_charge_value),
        stoneCharges: Number(product.stone_charges),
        hallmarkCharges: Number(product.hallmark_charges),
        discountType: product.discount_type,
        discountValue: Number(product.discount_value ?? 0),
      },
      rate,
    );
  };

  const deleted = view === 'deleted';

  // Shared by the desktop table and the phone cards, so both offer exactly the same controls.
  const statusControl = (product: ProductRow) => {
    if (deleted) return <Chip label="Deleted" size="small" sx={{ height: 22, fontSize: '0.7rem' }} />;
    const style = STATUS_STYLE[product.status];
    return (
      <Select
        size="small"
        value={product.status}
        disabled={pending}
        onChange={(e) => run(() => setProductStatus(product.id, e.target.value as ProductStatus))}
        aria-label={`Status of ${product.name}`}
        sx={{
          fontSize: '0.75rem',
          fontWeight: 600,
          bgcolor: style.bg,
          color: style.fg,
          '& .MuiSelect-select': { py: 0.5, pl: 1.25 },
          '& fieldset': { border: 'none' },
        }}
      >
        {(Object.keys(STATUS_STYLE) as ProductStatus[]).map((s) => (
          <MenuItem key={s} value={s} sx={{ fontSize: '0.82rem' }} disabled={s === 'published' && !perms.canPublish && product.status !== 'published'}>
            {STATUS_STYLE[s].label}
          </MenuItem>
        ))}
      </Select>
    );
  };

  const rowActions = (product: ProductRow) =>
    deleted ? (
      <Tooltip title="Restore">
        <IconButton size="small" disabled={pending} onClick={() => run(() => restoreProduct(product.id))} aria-label={`Restore ${product.name}`}>
          <RotateCcw size={15} />
        </IconButton>
      </Tooltip>
    ) : (
      <>
        <Tooltip title="Edit">
          <IconButton component={Link} href={`/products/${product.id}`} size="small" aria-label={`Edit ${product.name}`}>
            <Pencil size={15} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Duplicate">
          <IconButton
            size="small"
            disabled={pending}
            onClick={() => run(() => duplicateProduct(product.id), (id) => id && router.push(`/products/${id}`))}
            aria-label={`Duplicate ${product.name}`}
          >
            <Copy size={15} />
          </IconButton>
        </Tooltip>
        {perms.canDelete && (
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => setConfirmDelete(product)} aria-label={`Delete ${product.name}`}>
              <Trash2 size={15} />
            </IconButton>
          </Tooltip>
        )}
      </>
    );

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, mb: 2 }}>
        <Tabs
          value={view}
          onChange={(_, v: ProductView) => go({ view: v })}
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{ minHeight: 40, '& .MuiTab-root': { minHeight: 40, textTransform: 'none', fontSize: '0.85rem' } }}
        >
          {VIEWS.filter((v) => v.value !== 'deleted' || perms.canDelete).map((v) => (
            <Tab key={v.value} value={v.value} label={`${v.label} (${counts[v.value]})`} />
          ))}
        </Tabs>

        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            go();
          }}
          sx={{ width: { xs: '100%', sm: 340 } }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search name, SKU or HUID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      </Box>

      <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: PALETTE.blushWash }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: '0.8rem', fontWeight: 600, mr: 0.5 }}>
            <SlidersHorizontal size={15} aria-hidden="true" />
            Filter
          </Typography>

          <TextField
            select
            size="small"
            label="Collection"
            value={filters.category}
            onChange={(e) => go({ filters: { category: e.target.value } })}
            sx={filterSx}
          >
            <MenuItem value="">All collections</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id} sx={{ pl: c.isChild ? 4 : 2 }}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Gold colour"
            value={filters.colour}
            onChange={(e) => go({ filters: { colour: e.target.value as ProductTableFilters['colour'] } })}
            sx={filterSx}
          >
            <MenuItem value="">Any colour</MenuItem>
            {COLOURS.map((c) => (
              <MenuItem key={c.value} value={c.value}>
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    component="span"
                    aria-hidden="true"
                    sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c.swatch ?? 'transparent', border: c.swatch ? 'none' : `1px dashed ${PALETTE.inkSoft}` }}
                  />
                  {c.label}
                </Box>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Purity"
            value={filters.karat}
            onChange={(e) => go({ filters: { karat: e.target.value } })}
            sx={{ ...filterSx, minWidth: 120 }}
          >
            <MenuItem value="">Any purity</MenuItem>
            {['22K', '18K', '24K'].map((k) => (
              <MenuItem key={k} value={k}>{k}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Discount"
            value={filters.discount}
            onChange={(e) => go({ filters: { discount: e.target.value as ProductTableFilters['discount'] } })}
            sx={filterSx}
          >
            <MenuItem value="">With or without</MenuItem>
            {DISCOUNTS.map((d) => (
              <MenuItem key={d.value} value={d.value}>{d.label}</MenuItem>
            ))}
          </TextField>

          <Typography sx={{ ml: 'auto', fontSize: '0.8rem', color: 'text.secondary' }}>
            Showing {products.length} {products.length === 1 ? 'product' : 'products'}
          </Typography>
        </Box>

        {active.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mt: 1.5 }}>
            {active.map((a) => (
              <Chip
                key={a.key}
                label={a.label}
                size="small"
                onDelete={() => go({ filters: { [a.key]: '' } })}
                deleteIcon={<X size={13} />}
                sx={{ bgcolor: 'background.paper', border: `1px solid ${PALETTE.icing}`, fontSize: '0.75rem' }}
              />
            ))}
            <Button size="small" onClick={() => go({ filters: EMPTY_FILTERS })} sx={{ fontSize: '0.75rem' }}>
              Clear filters
            </Button>
          </Box>
        )}
      </Paper>

      <TableContainer component={Paper} variant="outlined" sx={{ display: { xs: 'none', md: 'block' } }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Collection</TableCell>
              <TableCell>Purity</TableCell>
              <TableCell align="right">Net weight</TableCell>
              <TableCell align="right">Price today</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                  {initialSearch || active.length > 0
                    ? 'No products match this search and these filters.'
                    : deleted
                      ? 'Nothing has been deleted.'
                      : 'No products here yet. Use “Add product” to create one.'}
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const price = priceOf(product);
                return (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {product.is_featured && (
                          <Tooltip title="Featured on the homepage">
                            <Star size={13} fill={PALETTE.sage} color={PALETTE.sageDeep} />
                          </Tooltip>
                        )}
                        <Box>
                          <Typography sx={{ fontSize: '0.86rem', fontWeight: 500 }}>{product.name}</Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                            {product.sku}
                            {product.huid && ` · HUID ${product.huid}`}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.82rem' }}>{product.category?.name ?? '—'}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Chip label={product.karat} size="small" sx={{ height: 20, fontSize: '0.68rem', bgcolor: PALETTE.icingWash }} />
                        {product.metal_colour && (
                          <Tooltip title={COLOURS.find((c) => c.value === product.metal_colour)?.label ?? ''}>
                            <Box
                              component="span"
                              aria-label={COLOURS.find((c) => c.value === product.metal_colour)?.label}
                              sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLOURS.find((c) => c.value === product.metal_colour)?.swatch }}
                            />
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.82rem' }}>{product.net_weight_g} g</TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {price ? (
                        <>
                          {formatRupees(price.total)}
                          {price.percentOff > 0 && (
                            <Typography component="span" sx={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: 'primary.main' }}>
                              {price.percentOff}% off
                            </Typography>
                          )}
                        </>
                      ) : (
                        <Typography component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', fontStyle: 'italic' }}>
                          no {product.karat} rate
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{statusControl(product)}</TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      {rowActions(product)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phones: the wide table becomes cards with a thumbnail, so the list is usable from the shop floor. */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 1.5 }}>
        {products.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', color: 'text.secondary', fontSize: '0.85rem' }}>
            {initialSearch || active.length > 0 ? 'No products match this search and these filters.' : 'No products here yet.'}
          </Paper>
        ) : (
          products.map((product) => {
            const price = priceOf(product);
            const image = product.images[0];
            return (
              <Paper key={product.id} variant="outlined" sx={{ p: 1.5, display: 'flex', gap: 1.5 }}>
                <Box
                  component={Link}
                  href={`/products/${product.id}`}
                  sx={{ width: 72, height: 72, flexShrink: 0, borderRadius: 1, overflow: 'hidden', bgcolor: PALETTE.icingWash, display: 'grid', placeItems: 'center' }}
                >
                  {image ? (
                    <Box component="img" src={imageSrc(image.storage_path)} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ImageOff size={18} color={PALETTE.inkSoft} aria-label="No photo" />
                  )}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography component={Link} href={`/products/${product.id}`} sx={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'text.primary', textDecoration: 'none' }} noWrap>
                    {product.name}
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }} noWrap>
                    {product.sku} · {product.karat} · {product.net_weight_g} g
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mt: 0.25 }}>
                    {price ? formatRupees(price.total) : `no ${product.karat} rate`}
                    {price && price.percentOff > 0 && (
                      <Typography component="span" sx={{ fontSize: '0.7rem', color: 'primary.main', ml: 0.75 }}>{price.percentOff}% off</Typography>
                    )}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.75 }}>
                    {statusControl(product)}
                    <Box>{rowActions(product)}</Box>
                  </Box>
                </Box>
              </Paper>
            );
          })
        )}
      </Box>

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Delete this product?"
        body={
          <>
            <strong>{confirmDelete?.name}</strong> will be removed from the website and moved to the Deleted tab.
          </>
        }
        hint="Its photos and history are kept, and you can restore it at any time."
        confirmLabel="Delete"
        pending={pending}
        onConfirm={() => {
          const target = confirmDelete;
          setConfirmDelete(null);
          if (target) run(() => deleteProduct(target.id));
        }}
        onCancel={() => setConfirmDelete(null)}
      />

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={5000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast?.ok ? 'success' : 'error'} onClose={() => setToast(null)}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </>
  );
}
