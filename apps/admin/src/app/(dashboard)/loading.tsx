// Shown while any admin page loads its data, in the rough shape of a page, so the screen never goes blank.

import { Box, Paper, Skeleton } from '@mui/material';

export default function Loading() {
  return (
    <Box aria-busy="true" aria-label="Loading">
      <Skeleton variant="text" width={220} height={44} />
      <Skeleton variant="text" width={340} height={22} sx={{ mb: 3 }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rounded" height={88} />
        ))}
      </Box>
      <Paper variant="outlined" sx={{ p: 2 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.25 }}>
            <Skeleton variant="rounded" width={44} height={44} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="25%" />
            </Box>
            <Skeleton variant="text" width={80} />
          </Box>
        ))}
      </Paper>
    </Box>
  );
}
