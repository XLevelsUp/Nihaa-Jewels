'use client';

// Photos for one product: drop several at once, drag (or use the arrows) to reorder, star the main one, and describe each for screen readers and image search.

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  Paper,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { ChevronLeft, ChevronRight, GripVertical, ImagePlus, Star, Trash2, Upload } from 'lucide-react';

import { deleteProductImage, reorderProductImages, setPrimaryImage, updateImageAlt, uploadProductImage } from '@/app/actions/products';
import ConfirmDialog from '@/components/ConfirmDialog';
import { PALETTE } from '@/constants/palette';
import { imageSrc } from '@/lib/site';
import type { ProductImage } from '@/types/database';

interface ImageManagerProps {
  productId: string;
  images: ProductImage[];
}

const ACCEPT = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export default function ImageManager({ productId, images }: ImageManagerProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ ok: boolean; message: string } | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<ProductImage | null>(null);
  const [order, setOrder] = useState(images);
  const [alts, setAlts] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [dropActive, setDropActive] = useState(false);
  const dragIndex = useRef<number | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => setOrder(images), [images]);

  // Uploads run one at a time so the progress is honest and one bad file does not stop the rest.
  const uploadAll = async (files: File[]) => {
    const usable = files.filter((f) => ACCEPT.includes(f.type));
    const skipped = files.length - usable.length;
    if (usable.length === 0) {
      setToast({ ok: false, message: 'Use JPEG, PNG, WebP or AVIF photos.' });
      return;
    }

    setProgress({ done: 0, total: usable.length });
    const failures: string[] = [];
    for (const [i, file] of usable.entries()) {
      const formData = new FormData();
      formData.set('productId', productId);
      formData.set('file', file);
      const result = await uploadProductImage(formData);
      if (!result.ok) failures.push(`${file.name}: ${result.message}`);
      setProgress({ done: i + 1, total: usable.length });
    }
    setProgress(null);
    if (fileInput.current) fileInput.current.value = '';

    const uploaded = usable.length - failures.length;
    setToast(
      failures.length === 0 && skipped === 0
        ? { ok: true, message: `${uploaded} photo${uploaded === 1 ? '' : 's'} uploaded and optimised.` }
        : { ok: uploaded > 0, message: [uploaded && `${uploaded} uploaded.`, skipped && `${skipped} skipped (not an image).`, ...failures].filter(Boolean).join(' ') },
    );
    router.refresh();
  };

  const run = (fn: () => Promise<{ ok: boolean; message: string }>) => {
    startTransition(async () => {
      setToast(await fn());
      router.refresh();
    });
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length || from === to) return;
    const next = [...order];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setOrder(next);
    run(() => reorderProductImages(productId, next.map((i) => i.id)));
  };

  const saveAlt = (image: ProductImage) => {
    const draft = alts[image.id];
    if (draft === undefined || draft.trim() === image.alt_text) return;
    run(async () => {
      const result = await updateImageAlt(image.id, draft);
      if (result.ok) setAlts(({ [image.id]: _, ...rest }) => rest);
      return result;
    });
  };

  const busy = pending || Boolean(progress);

  return (
    <>
      <Paper
        id="photos"
        variant="outlined"
        onDragOver={(e) => {
          if (e.dataTransfer.types.includes('Files')) {
            e.preventDefault();
            setDropActive(true);
          }
        }}
        onDragLeave={() => setDropActive(false)}
        onDrop={(e) => {
          if (!e.dataTransfer.files.length) return;
          e.preventDefault();
          setDropActive(false);
          if (!busy) uploadAll(Array.from(e.dataTransfer.files));
        }}
        sx={{
          p: 3,
          scrollMarginTop: 88,
          outline: dropActive ? `2px dashed ${PALETTE.sageDeep}` : 'none',
          outlineOffset: -6,
          transition: 'outline-color 0.2s',
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ fontSize: '1rem' }}>
              Photographs {order.length > 0 && `(${order.length})`}
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', mt: 0.25 }}>
              Drag photos here or use Upload. Drag to reorder; the starred photo is shown first on the website.
            </Typography>
          </Box>

          <Button component="label" variant="outlined" startIcon={<Upload size={15} />} disabled={busy}>
            Upload photos
            <input
              ref={fileInput}
              type="file"
              hidden
              multiple
              accept={ACCEPT.join(',')}
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                if (files.length) uploadAll(files);
              }}
            />
          </Button>
        </Box>

        {progress && (
          <Box sx={{ mb: 2 }} role="status">
            <Typography sx={{ fontSize: '0.78rem', mb: 0.5 }}>
              Uploading and optimising {Math.min(progress.done + 1, progress.total)} of {progress.total}…
            </Typography>
            <LinearProgress variant="determinate" value={(progress.done / progress.total) * 100} />
          </Box>
        )}

        {order.length === 0 ? (
          <Box
            component="label"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              py: 6,
              textAlign: 'center',
              border: `1px dashed ${PALETTE.sageDeep}`,
              borderRadius: 1.5,
              color: 'text.secondary',
              cursor: busy ? 'default' : 'pointer',
              bgcolor: PALETTE.blushWash,
            }}
          >
            <ImagePlus size={28} aria-hidden="true" />
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: 'text.primary' }}>Drop photos here, or click to choose</Typography>
            <Typography sx={{ fontSize: '0.75rem' }}>
              Several at once is fine. JPEG, PNG, WebP or AVIF up to 10 MB, at least 800px. Converted to WebP automatically.
            </Typography>
            <input
              type="file"
              hidden
              multiple
              accept={ACCEPT.join(',')}
              disabled={busy}
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                if (files.length) uploadAll(files);
              }}
            />
          </Box>
        ) : (
          <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(168px, 1fr))', gap: 2 }}>
            {order.map((image, index) => (
              <Box
                component="li"
                key={image.id}
                draggable={!busy}
                onDragStart={(e) => {
                  dragIndex.current = index;
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onDragOver={(e) => {
                  if (dragIndex.current !== null) e.preventDefault();
                }}
                onDrop={(e) => {
                  if (dragIndex.current === null) return;
                  e.preventDefault();
                  e.stopPropagation();
                  move(dragIndex.current, index);
                  dragIndex.current = null;
                }}
                onDragEnd={() => (dragIndex.current = null)}
                sx={{
                  position: 'relative',
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  border: `1px solid ${image.is_primary ? PALETTE.sageDeep : PALETTE.icing}`,
                  bgcolor: 'background.paper',
                  cursor: busy ? 'default' : 'grab',
                }}
              >
                <Box
                  component="img"
                  src={imageSrc(image.storage_path)}
                  alt={image.alt_text || 'Product photograph'}
                  draggable={false}
                  sx={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block', bgcolor: PALETTE.icingWash }}
                />

                <Box sx={{ position: 'absolute', top: 6, left: 6, right: 6, display: 'flex', justifyContent: 'space-between', pointerEvents: 'none' }}>
                  {image.is_primary ? (
                    <Chip label="Main" size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: PALETTE.sageDeep, color: PALETTE.ivory }} />
                  ) : (
                    <span />
                  )}
                  <Box sx={{ display: 'grid', placeItems: 'center', width: 22, height: 22, borderRadius: 1, bgcolor: 'rgba(253,250,245,0.85)' }}>
                    <GripVertical size={14} aria-hidden="true" />
                  </Box>
                </Box>

                <Box sx={{ p: 1 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Description"
                    value={alts[image.id] ?? image.alt_text}
                    onChange={(e) => setAlts((prev) => ({ ...prev, [image.id]: e.target.value }))}
                    onBlur={() => saveAlt(image)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                    }}
                    slotProps={{ htmlInput: { maxLength: 200, style: { fontSize: '0.75rem' } }, inputLabel: { style: { fontSize: '0.75rem' } } }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                    <Box>
                      <Tooltip title="Move earlier">
                        <span>
                          <IconButton size="small" disabled={busy || index === 0} onClick={() => move(index, index - 1)} aria-label="Move photo earlier">
                            <ChevronLeft size={15} />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Move later">
                        <span>
                          <IconButton size="small" disabled={busy || index === order.length - 1} onClick={() => move(index, index + 1)} aria-label="Move photo later">
                            <ChevronRight size={15} />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                    <Box>
                      {!image.is_primary && (
                        <Tooltip title="Make this the main photo">
                          <IconButton size="small" disabled={busy} onClick={() => run(() => setPrimaryImage(image.id, productId))} aria-label="Make main photo">
                            <Star size={14} />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Remove">
                        <IconButton size="small" disabled={busy} onClick={() => setConfirmRemove(image)} aria-label="Remove photo">
                          <Trash2 size={14} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      <ConfirmDialog
        open={Boolean(confirmRemove)}
        title="Remove this photograph?"
        body={
          <>
            {confirmRemove?.alt_text ? <><strong>{confirmRemove.alt_text}</strong> will be removed</> : 'This photograph will be removed'} from the product
            and the website.
          </>
        }
        hint={confirmRemove?.is_primary ? 'This is the main photograph. The next photo in the list will take its place.' : undefined}
        confirmLabel="Remove photograph"
        pending={pending}
        onConfirm={() => {
          const target = confirmRemove;
          setConfirmRemove(null);
          if (target) run(() => deleteProductImage(target.id));
        }}
        onCancel={() => setConfirmRemove(null)}
      />

      <Snackbar open={Boolean(toast)} autoHideDuration={6000} onClose={() => setToast(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={toast?.ok ? 'success' : 'error'} onClose={() => setToast(null)}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </>
  );
}
