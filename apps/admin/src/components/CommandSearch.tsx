'use client';

// Ctrl+K (or ⌘K) from any admin screen opens one search box for products and bookings; arrow keys move, Enter opens.

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, CircularProgress, Dialog, InputBase, Typography } from '@mui/material';
import { CalendarClock, Gem, Search } from 'lucide-react';

import { globalSearch, type SearchHit } from '@/app/actions/search';
import { PALETTE } from '@/constants/palette';

export default function CommandSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [active, setActive] = useState(0);
  const [pending, startTransition] = useTransition();
  const latest = useRef('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Debounced so typing a SKU does not fire a request per keystroke; stale replies are discarded.
  useEffect(() => {
    if (query.trim().length < 2) {
      setHits([]);
      return;
    }
    latest.current = query;
    const timer = setTimeout(() => {
      startTransition(async () => {
        const result = await globalSearch(query);
        if (latest.current === query) {
          setHits(result);
          setActive(0);
        }
      });
    }, 220);
    return () => clearTimeout(timer);
  }, [query]);

  const close = () => {
    setOpen(false);
    setQuery('');
    setHits([]);
  };

  const go = (hit: SearchHit) => {
    close();
    router.push(hit.href);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outlined"
        color="inherit"
        startIcon={<Search size={15} />}
        sx={{
          justifyContent: 'flex-start',
          minWidth: { xs: 0, sm: 260 },
          color: 'text.secondary',
          borderColor: PALETTE.icing,
          fontWeight: 400,
          '& .MuiButton-startIcon': { mr: { xs: 0, sm: 1 } },
        }}
        aria-label="Search products and bookings"
      >
        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, flex: 1, textAlign: 'left' }}>
          Search products, HUID, customers…
        </Box>
        <Box component="kbd" sx={{ display: { xs: 'none', sm: 'inline' }, fontSize: '0.68rem', px: 0.75, py: 0.25, borderRadius: 0.75, bgcolor: PALETTE.icingWash, fontFamily: 'inherit' }}>
          Ctrl K
        </Box>
      </Button>

      <Dialog open={open} onClose={close} fullWidth maxWidth="sm" PaperProps={{ sx: { position: 'fixed', top: { xs: 16, sm: 80 }, m: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, borderBottom: `1px solid ${PALETTE.icing}` }}>
          {pending ? <CircularProgress size={18} /> : <Search size={18} />}
          <InputBase
            autoFocus
            fullWidth
            placeholder="Product name, SKU, HUID, customer name or phone"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive((i) => Math.min(i + 1, hits.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive((i) => Math.max(i - 1, 0));
              } else if (e.key === 'Enter' && hits[active]) {
                e.preventDefault();
                go(hits[active]);
              }
            }}
            inputProps={{ 'aria-label': 'Search', role: 'combobox', 'aria-expanded': hits.length > 0, 'aria-controls': 'search-results' }}
            sx={{ fontSize: '0.95rem' }}
          />
        </Box>

        <Box id="search-results" role="listbox" sx={{ maxHeight: 420, overflowY: 'auto', py: hits.length ? 1 : 0 }}>
          {query.trim().length >= 2 && !pending && hits.length === 0 && (
            <Typography sx={{ px: 2.5, py: 3, fontSize: '0.85rem', color: 'text.secondary' }}>Nothing found for “{query.trim()}”.</Typography>
          )}
          {query.trim().length < 2 && (
            <Typography sx={{ px: 2.5, py: 3, fontSize: '0.8rem', color: 'text.secondary' }}>
              Type at least two characters. ↑ ↓ to move, Enter to open, Esc to close.
            </Typography>
          )}
          {hits.map((hit, i) => (
            <Box
              key={`${hit.kind}-${hit.id}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(hit)}
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.25, cursor: 'pointer', bgcolor: i === active ? PALETTE.sageWash : 'transparent' }}
            >
              <Box sx={{ color: 'primary.main', display: 'grid' }}>{hit.kind === 'product' ? <Gem size={16} /> : <CalendarClock size={16} />}</Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.88rem', fontWeight: 500 }} noWrap>{hit.title}</Typography>
                <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }} noWrap>
                  {hit.kind === 'product' ? 'Product' : 'Booking'} · {hit.subtitle}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Dialog>
    </>
  );
}
