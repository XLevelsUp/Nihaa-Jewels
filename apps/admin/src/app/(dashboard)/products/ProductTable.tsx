'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
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
  Tooltip,
  Typography,
} from '@mui/material';
import { Search, Pencil, Trash2, Star } from 'lucide-react';

import { toggleProductActive, deleteProduct } from '@/app/actions/products';
import { calculatePrice, formatRupees, type Karat } from '@/lib/pricing';
import { PALETTE } from '@/constants/palette';
import type { ProductRow } from '@/lib/catalogue';

interface ProductTableProps {
  products: ProductRow[];
  rates: Record<string, number>;
  initialSearch: string;
}

export default function ProductTable({ products, rates, initialSearch }: ProductTableProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState(initialSearch);
  const [toast, setToast] = useState<{ ok: boolean; message: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ProductRow | null>(null);

  const runSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(search.trim() ? `/products?q=${encodeURIComponent(search.trim())}` : '/products');
  };

  const handleToggle = (product: ProductRow, next: boolean) => {
    startTransition(async () => {
      const result = await toggleProductActive(product.id, next);
      setToast(result);
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    const target = confirmDelete;
    setConfirmDelete(null);
    startTransition(async () => {
      const result = await deleteProduct(target.id);
      setToast(result);
      router.refresh();
    });
  };

  const priceOf = (product: ProductRow): number | null => {
    const rate = rates[product.karat];
    if (!rate) return null;
    const breakdown = calculatePrice(
      {
        netWeightG: Number(product.net_weight_g),
        karat: product.karat as Karat,
        wastagePct: Number(product.wastage_pct),
        makingChargeType: product.making_charge_type,
        makingChargeValue: Number(product.making_charge_value),
        stoneCharges: Number(product.stone_charges),
        hallmarkCharges: Number(product.hallmark_charges),
      },
      rate,
    );
    return breakdown?.total ?? null;
  };

  return (
    <>
      <Box component="form" onSubmit={runSearch} sx={{ mb: 2.5, maxWidth: 420 }}>
        <TextField
          fullWidth
          placeholder="Search by name or SKU"
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

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Collection</TableCell>
              <TableCell>Purity</TableCell>
              <TableCell align="right">Net weight</TableCell>
              <TableCell align="right">Price today</TableCell>
              <TableCell align="center">On website</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                  {initialSearch
                    ? `No products match “${initialSearch}”.`
                    : 'No products yet. Use “Add product” to create the first one.'}
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
                          <Typography sx={{ fontSize: '0.86rem', fontWeight: 500 }}>
                            {product.name}
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                            {product.sku}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.82rem' }}>
                      {product.category?.name ?? '—'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.karat}
                        size="small"
                        sx={{ height: 20, fontSize: '0.68rem', bgcolor: PALETTE.icingWash }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.82rem' }}>
                      {product.net_weight_g} g
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      {price !== null ? (
                        formatRupees(price)
                      ) : (
                        <Typography
                          component="span"
                          sx={{ fontSize: '0.75rem', color: 'text.secondary', fontStyle: 'italic' }}
                        >
                          no {product.karat} rate
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        size="small"
                        checked={product.is_active}
                        disabled={pending}
                        onChange={(e) => handleToggle(product, e.target.checked)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={Link}
                        href={`/products/${product.id}`}
                        size="small"
                        aria-label={`Edit ${product.name}`}
                      >
                        <Pencil size={15} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => setConfirmDelete(product)}
                        aria-label={`Delete ${product.name}`}
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

      <Dialog open={Boolean(confirmDelete)} onClose={() => setConfirmDelete(null)}>
        <DialogTitle sx={{ fontSize: '1.1rem' }}>Delete this product?</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '0.9rem' }}>
            <strong>{confirmDelete?.name}</strong> and its photographs will be permanently removed.
            This cannot be undone.
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', mt: 1.5 }}>
            To take it off the website without losing it, switch &ldquo;On website&rdquo; off
            instead.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={pending}>
            Delete permanently
          </Button>
        </DialogActions>
      </Dialog>

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
