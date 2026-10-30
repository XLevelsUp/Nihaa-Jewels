'use client';

// Staff list with role switching and removal, an "Add person" dialog, and a read-only table of what each role can do.

import { useState, useTransition } from 'react';
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
  MenuItem,
  Paper,
  Select,
  Snackbar,
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
import { Check, Minus, Trash2, UserPlus } from 'lucide-react';

import { addStaff, changeStaffRole, removeStaff, type StaffMember } from '@/app/actions/staff';
import ConfirmDialog from '@/components/ConfirmDialog';
import { PALETTE } from '@/constants/palette';
import type { Role } from '@/lib/permissions';

interface StaffManagerProps {
  staff: StaffMember[];
  currentUserId: string;
  matrix: { label: string; roles: boolean[] }[];
  roleNames: string[];
}

export default function StaffManager({ staff, currentUserId, matrix, roleNames }: StaffManagerProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ ok: boolean; message: string } | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', role: 'manager' as Role });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmRemove, setConfirmRemove] = useState<StaffMember | null>(null);

  const run = (fn: () => Promise<{ ok: boolean; message: string; fieldErrors?: Record<string, string> }>, after?: () => void) => {
    startTransition(async () => {
      const result = await fn();
      setToast(result);
      setErrors(result.fieldErrors ?? {});
      if (result.ok) after?.();
      router.refresh();
    });
  };

  const submitAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.set(k, v));
    run(() => addStaff(fd), () => {
      setAdding(false);
      setForm({ email: '', password: '', role: 'manager' });
    });
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<UserPlus size={16} />} onClick={() => setAdding(true)}>
          Add person
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Person</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Added</TableCell>
              <TableCell align="right">Remove</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staff.map((s) => {
              const self = s.user_id === currentUserId;
              return (
                <TableRow key={s.user_id} hover>
                  <TableCell sx={{ fontSize: '0.86rem' }}>
                    {s.email}
                    {self && <Chip label="You" size="small" sx={{ ml: 1, height: 20, fontSize: '0.65rem', bgcolor: PALETTE.icingWash }} />}
                  </TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={s.role}
                      disabled={pending || self}
                      onChange={(e) => run(() => changeStaffRole(s.user_id, e.target.value as Role))}
                      aria-label={`Role of ${s.email}`}
                      sx={{ fontSize: '0.82rem', minWidth: 130 }}
                    >
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="manager">Manager</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                    {new Date(s.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={self ? 'You cannot remove yourself' : 'Remove access'}>
                      <span>
                        <IconButton size="small" disabled={pending || self} onClick={() => setConfirmRemove(s)} aria-label={`Remove ${s.email}`}>
                          <Trash2 size={15} />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h3" sx={{ fontSize: '1rem', mb: 0.5 }}>What each role can do</Typography>
        <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', mb: 2 }}>
          Set in the admin&rsquo;s permission settings. Ask your developer to change what a role may do.
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              {roleNames.map((r) => (
                <TableCell key={r} align="center" sx={{ fontWeight: 600 }}>{r}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {matrix.map((row) => (
              <TableRow key={row.label}>
                <TableCell sx={{ fontSize: '0.84rem' }}>{row.label}</TableCell>
                {row.roles.map((allowed, i) => (
                  <TableCell key={roleNames[i]} align="center">
                    {allowed ? <Check size={16} color="#2E7D53" aria-label="Allowed" /> : <Minus size={16} color={PALETTE.inkSoft} aria-label="Not allowed" />}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={adding} onClose={() => !pending && setAdding(false)} maxWidth="xs" fullWidth>
        <Box component="form" onSubmit={submitAdd}>
          <DialogTitle sx={{ fontSize: '1.1rem' }}>Add a person</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '8px !important' }}>
            <TextField
              label="Email"
              type="email"
              required
              autoFocus
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="Temporary password"
              required
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              error={!!errors.password}
              helperText={errors.password || 'At least 8 characters. Share it privately; they sign in with it.'}
            />
            <TextField select label="Role" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setAdding(false)} disabled={pending}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={pending}>Add person</Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={Boolean(confirmRemove)}
        title="Remove this person?"
        body={<><strong>{confirmRemove?.email}</strong> will be signed out and can no longer use the admin.</>}
        hint="Their past changes stay in each product's history."
        confirmLabel="Remove access"
        pending={pending}
        onConfirm={() => {
          const target = confirmRemove;
          setConfirmRemove(null);
          if (target) run(() => removeStaff(target.user_id));
        }}
        onCancel={() => setConfirmRemove(null)}
      />

      <Snackbar open={Boolean(toast)} autoHideDuration={7000} onClose={() => setToast(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={toast?.ok ? 'success' : 'error'} onClose={() => setToast(null)}>{toast?.message}</Alert>
      </Snackbar>
    </>
  );
}
