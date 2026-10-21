'use client';

// Every recorded change to this product, newest first, in plain words with the old and new value; each change can be undone in one click.

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Box, Button, Paper, Snackbar, Typography } from '@mui/material';
import { History, Undo2 } from 'lucide-react';

import { undoChange } from '@/app/actions/products';
import ConfirmDialog from '@/components/ConfirmDialog';
import { PALETTE } from '@/constants/palette';
import type { ProductAudit } from '@/types/database';

const FIELD_LABELS: Record<string, string> = {
  name: 'Name', sku: 'SKU', slug: 'Web address', description: 'Description', category_id: 'Collection',
  karat: 'Purity', gross_weight_g: 'Gross weight (g)', net_weight_g: 'Net weight (g)', wastage_pct: 'Wastage %',
  making_charge_type: 'Making charge type', making_charge_value: 'Making charge', stone_charges: 'Stone charges',
  hallmark_charges: 'Hallmarking', discount_type: 'Discount type', discount_value: 'Discount', occasion: 'Occasions',
  gender: 'Worn by', status: 'Status', is_featured: 'Featured', deleted_at: 'Deleted', metal_colour: 'Gold colour',
  huid: 'HUID', size_label: 'Size or length', dimensions: 'Dimensions', closure: 'Closure', care_instructions: 'Care instructions',
};

const ACTION_LABELS: Record<ProductAudit['action'], string> = {
  created: 'Created the product',
  updated: 'Edited',
  deleted: 'Deleted',
  restored: 'Restored',
};

function show(value: unknown, field: string): string {
  if (value === null || value === undefined || value === '') return '—';
  if (field === 'category_id') return 'another collection';
  if (field === 'deleted_at') return 'yes';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—';
  const text = String(value);
  return text.length > 60 ? `${text.slice(0, 60)}…` : text;
}

const when = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

export default function ProductHistory({ entries, canUndoDelete }: { entries: ProductAudit[]; canUndoDelete: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirm, setConfirm] = useState<ProductAudit | null>(null);
  const [toast, setToast] = useState<{ ok: boolean; message: string } | null>(null);

  const undo = () => {
    const entry = confirm;
    setConfirm(null);
    if (!entry) return;
    startTransition(async () => {
      const result = await undoChange(entry.id);
      setToast(result);
      if (result.ok) router.refresh();
    });
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
      <Typography variant="h3" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '1rem', mb: 0.5 }}>
        <History size={17} aria-hidden="true" />
        History
      </Typography>
      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 2.5 }}>
        Every change is recorded with who made it. Undo puts the old values back and is itself recorded.
      </Typography>

      {entries.length === 0 ? (
        <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', fontStyle: 'italic' }}>
          No changes recorded yet. History starts from the first save after this feature was switched on.
        </Typography>
      ) : (
        <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {entries.map((e) => {
            const fields = Object.entries(e.changes).filter(([f]) => f !== 'updated_at');
            return (
              <Box component="li" key={e.id} sx={{ py: 1.75, borderTop: `1px solid ${PALETTE.icing}`, '&:first-of-type': { borderTop: 'none', pt: 0 } }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 1 }}>
                  <Typography sx={{ fontSize: '0.84rem' }}>
                    <strong>{e.changed_by ?? 'Unknown'}</strong> · {ACTION_LABELS[e.action]}
                    <Typography component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', ml: 1 }}>
                      {when.format(new Date(e.created_at))}
                    </Typography>
                  </Typography>
                  {e.action !== 'created' && (canUndoDelete || (e.action !== 'deleted' && e.action !== 'restored')) && (
                    <Button size="small" startIcon={<Undo2 size={14} />} disabled={pending} onClick={() => setConfirm(e)}>
                      Undo
                    </Button>
                  )}
                </Box>
                {e.action === 'updated' && fields.length > 0 && (
                  <Box component="ul" sx={{ m: 0, mt: 0.75, pl: 2.5 }}>
                    {fields.map(([field, change]) => (
                      <Typography component="li" key={field} sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                        {FIELD_LABELS[field] ?? field}: <s>{show(change.from, field)}</s> → <strong style={{ color: PALETTE.ink }}>{show(change.to, field)}</strong>
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      )}

      <ConfirmDialog
        open={Boolean(confirm)}
        title="Undo this change?"
        body={
          confirm?.action === 'deleted'
            ? 'The product will be restored.'
            : confirm?.action === 'restored'
              ? 'The product will be deleted again.'
              : `${Object.keys(confirm?.changes ?? {}).map((f) => FIELD_LABELS[f] ?? f).join(', ')} will go back to the earlier values.`
        }
        hint="Anything changed after this will stay as it is."
        confirmLabel="Undo change"
        pending={pending}
        onConfirm={undo}
        onCancel={() => setConfirm(null)}
      />

      <Snackbar open={Boolean(toast)} autoHideDuration={5000} onClose={() => setToast(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={toast?.ok ? 'success' : 'error'} onClose={() => setToast(null)}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
