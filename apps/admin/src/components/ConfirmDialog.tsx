'use client';

// One confirm dialog for the whole admin panel — three near-identical copies had drifted
// apart on title size, button wording and whether they could be dismissed mid-action.

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  /** The consequence, stated plainly. */
  body: React.ReactNode;
  /** Optional second line: the gentler alternative to a destructive action. */
  hint?: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  /** Destructive actions get the error colour; ordinary ones the primary. */
  destructive?: boolean;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  body,
  hint,
  confirmLabel,
  cancelLabel = 'Keep it',
  destructive = true,
  pending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      // Not dismissable while the action is running, so a half-finished delete
      // cannot be hidden by clicking away.
      onClose={() => !pending && onCancel()}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ fontSize: '1.1rem' }}>{title}</DialogTitle>
      <DialogContent>
        <Typography sx={{ fontSize: '0.9rem', lineHeight: 1.7 }}>{body}</Typography>
        {hint && (
          <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', mt: 1.5, lineHeight: 1.7 }}>
            {hint}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} disabled={pending}>
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={destructive ? 'error' : 'primary'}
          disabled={pending}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
