'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Snackbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { Upload, Trash2, Star } from 'lucide-react';

import { uploadProductImage, deleteProductImage, setPrimaryImage } from '@/app/actions/products';
import { PALETTE } from '@/constants/palette';
import type { ProductImage } from '@/types/database';

interface ImageManagerProps {
  productId: string;
  images: ProductImage[];
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

// Seeded rows hold site-relative paths like /images/x.webp; uploads hold a storage key.
function imageSrc(storagePath: string): string {
  if (storagePath.startsWith('/')) return `http://localhost:3000${storagePath}`;
  return `${SUPABASE_URL}/storage/v1/object/public/product-images/${storagePath}`;
}

export default function ImageManager({ productId, images }: ImageManagerProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ ok: boolean; message: string } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleUpload = (file: File) => {
    const formData = new FormData();
    formData.set('productId', productId);
    formData.set('file', file);
    formData.set('altText', '');

    startTransition(async () => {
      const result = await uploadProductImage(formData);
      setToast(result);
      if (fileInput.current) fileInput.current.value = '';
      router.refresh();
    });
  };

  const run = (fn: () => Promise<{ ok: boolean; message: string }>) => {
    startTransition(async () => {
      setToast(await fn());
      router.refresh();
    });
  };

  return (
    <>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ fontSize: '1rem' }}>
              Photographs
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', mt: 0.25 }}>
              The starred image is shown first on the website.
            </Typography>
          </Box>

          <Button
            component="label"
            variant="outlined"
            startIcon={pending ? <CircularProgress size={14} /> : <Upload size={15} />}
            disabled={pending}
          >
            Upload
            <input
              ref={fileInput}
              type="file"
              hidden
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
          </Button>
        </Box>

        {images.length === 0 ? (
          <Box
            sx={{
              py: 5,
              textAlign: 'center',
              border: `1px dashed ${PALETTE.sage}`,
              borderRadius: 1.5,
              color: 'text.secondary',
            }}
          >
            <Typography sx={{ fontSize: '0.85rem' }}>No photographs yet.</Typography>
            <Typography sx={{ fontSize: '0.75rem', mt: 0.5 }}>
              JPEG, PNG, WebP or AVIF, up to 10 MB.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {images.map((image) => (
              <Box
                key={image.id}
                sx={{
                  position: 'relative',
                  width: 132,
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  border: `1px solid ${image.is_primary ? PALETTE.sageDeep : PALETTE.icing}`,
                }}
              >
                <Box
                  component="img"
                  src={imageSrc(image.storage_path)}
                  alt={image.alt_text || 'Product photograph'}
                  sx={{ width: '100%', height: 132, objectFit: 'cover', display: 'block', bgcolor: PALETTE.icingWash }}
                />

                {image.is_primary && (
                  <Chip
                    label="Main"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 6,
                      left: 6,
                      height: 20,
                      fontSize: '0.65rem',
                      bgcolor: PALETTE.sageDeep,
                      color: PALETTE.ivory,
                    }}
                  />
                )}

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, py: 0.5, bgcolor: 'background.paper' }}>
                  {!image.is_primary && (
                    <Tooltip title="Make this the main image">
                      <IconButton
                        size="small"
                        disabled={pending}
                        onClick={() => run(() => setPrimaryImage(image.id, productId))}
                      >
                        <Star size={14} />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Remove">
                    <IconButton
                      size="small"
                      disabled={pending}
                      onClick={() => run(() => deleteProductImage(image.id))}
                    >
                      <Trash2 size={14} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
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
