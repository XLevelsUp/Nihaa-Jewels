'use client';

// The only CTA in the catalogue — there is no cart or checkout anywhere on this site.

import { useState } from 'react';
import { Box, Button, alpha, useTheme } from '@mui/material';
import { CalendarCheck, MessageCircle } from 'lucide-react';

import BookAppointmentDialog from './BookAppointmentDialog';

interface BookAppointmentButtonProps {
  productId?: string | null;
  productName?: string;
  quotedPrice?: number | null;
  whatsappNumber?: string;
}

export default function BookAppointmentButton({
  productId = null,
  productName,
  quotedPrice = null,
  whatsappNumber = '914228000000',
}: BookAppointmentButtonProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    productName
      ? `Hello Nihaa Jewels, I'd like to know more about "${productName}".`
      : "Hello Nihaa Jewels, I'd like to enquire about your collection.",
  )}`;

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          className="btn-gold-shimmer"
          startIcon={<CalendarCheck size={16} strokeWidth={1.5} />}
          sx={{ py: 2, px: 4, fontSize: '0.75rem', letterSpacing: '0.15em', fontWeight: 600, flex: 1 }}
        >
          Book an Appointment
        </Button>

        <Button
          component="a"
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          variant="outlined"
          startIcon={<MessageCircle size={16} strokeWidth={1.5} />}
          sx={{
            py: 2,
            px: 4,
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            fontWeight: 600,
            borderColor: alpha(theme.palette.primary.main, 0.4),
            color: 'primary.main',
          }}
        >
          Enquire on WhatsApp
        </Button>
      </Box>

      <BookAppointmentDialog
        open={open}
        onClose={() => setOpen(false)}
        productId={productId}
        productName={productName}
        quotedPrice={quotedPrice}
      />
    </>
  );
}
