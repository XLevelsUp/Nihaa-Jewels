'use client';

// Filters live in the URL so a filtered view can be shared, bookmarked and indexed.

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Box, Chip, MenuItem, TextField, Typography } from '@mui/material';
import { X } from 'lucide-react';

import { PRICE_BANDS, titleCase } from '@/constants/filters';
export { PRICE_BANDS };

interface FilterBarProps {
  occasions: string[];
  genders: string[];
  karats: string[];
  resultCount: number;
}


export default function FilterBar({ occasions, genders, karats, resultCount }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const current = {
    occasion: params.get('occasion') ?? '',
    gender: params.get('gender') ?? '',
    karat: params.get('karat') ?? '',
    price: params.get('price') ?? '',
  };

  const activeCount = Object.values(current).filter(Boolean).length;

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(next.toString() ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  const clearAll = () => router.push(pathname, { scroll: false });

  const selectSx = { minWidth: 150 };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 1.5,
        py: 2.5,
        mb: 4,
        borderTop: '1px solid var(--c-border)',
        borderBottom: '1px solid var(--c-border)',
      }}
    >
      {karats.length > 0 && (
        <TextField
          select
          size="small"
          label="Purity"
          value={current.karat}
          onChange={(e) => update('karat', e.target.value)}
          sx={selectSx}
        >
          <MenuItem value="">All purities</MenuItem>
          {karats.map((k) => (
            <MenuItem key={k} value={k}>{k}</MenuItem>
          ))}
        </TextField>
      )}

      {occasions.length > 0 && (
        <TextField
          select
          size="small"
          label="Occasion"
          value={current.occasion}
          onChange={(e) => update('occasion', e.target.value)}
          sx={selectSx}
        >
          <MenuItem value="">All occasions</MenuItem>
          {occasions.map((o) => (
            <MenuItem key={o} value={o}>{titleCase(o)}</MenuItem>
          ))}
        </TextField>
      )}

      {genders.length > 0 && (
        <TextField
          select
          size="small"
          label="Worn by"
          value={current.gender}
          onChange={(e) => update('gender', e.target.value)}
          sx={selectSx}
        >
          <MenuItem value="">Anyone</MenuItem>
          {genders.map((g) => (
            <MenuItem key={g} value={g}>{titleCase(g)}</MenuItem>
          ))}
        </TextField>
      )}

      <TextField
        select
        size="small"
        label="Price"
        value={current.price}
        onChange={(e) => update('price', e.target.value)}
        sx={selectSx}
      >
        <MenuItem value="">Any price</MenuItem>
        {PRICE_BANDS.map((b) => (
          <MenuItem key={b.label} value={b.label}>{b.label}</MenuItem>
        ))}
      </TextField>

      <Box sx={{ flexGrow: 1 }} />

      <Typography sx={{ color: 'var(--c-text-soft)', fontSize: '0.78rem' }}>
        {resultCount} {resultCount === 1 ? 'piece' : 'pieces'}
      </Typography>

      {activeCount > 0 && (
        <Chip
          label="Clear filters"
          size="small"
          onDelete={clearAll}
          deleteIcon={<X size={14} />}
          onClick={clearAll}
          sx={{ bgcolor: 'var(--c-icing)' }}
        />
      )}
    </Box>
  );
}
