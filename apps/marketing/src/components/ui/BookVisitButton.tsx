'use client';

// A general "book a visit" button in the homepage style, so server-rendered pages can open the booking dialog without becoming client components.

import { useState } from 'react';
import { CalendarCheck } from 'lucide-react';

import BookAppointmentDialog from '@/components/catalogue/BookAppointmentDialog';

interface BookVisitButtonProps {
  label?: string;
  tone?: 'solid' | 'ghost' | 'light';
  className?: string;
}

export default function BookVisitButton({ label = 'Book a visit', tone = 'solid', className = '' }: BookVisitButtonProps) {
  const [open, setOpen] = useState(false);
  const toneClass =
    tone === 'ghost' ? 'lux-button lux-button-ghost' : tone === 'light' ? 'lux-button' : 'lux-button';
  const lightStyle = tone === 'light' ? { background: 'var(--c-ivory)', color: 'var(--c-burgundy)', borderColor: 'var(--c-ivory)' } : undefined;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`${toneClass} ${className}`} style={lightStyle}>
        <CalendarCheck size={15} strokeWidth={1.5} aria-hidden="true" />
        {label}
      </button>
      <BookAppointmentDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
