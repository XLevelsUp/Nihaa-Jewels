'use server';

// Server action, not a client fetch, so validation cannot be bypassed and failures are detectable.

import { z } from 'zod';

import { supabase } from '@/lib/supabase';
import { STORE } from '@/constants/store';

const SLOTS = ['morning', 'afternoon', 'evening'] as const;

const schema = z.object({
  productId: z.uuid().nullable(),
  name: z.string().trim().min(2, 'Please enter your name').max(100),
  phone: z
    .string()
    .trim()
    .min(8, 'Please enter a valid phone number')
    .max(20)
    .regex(/^[\d\s+()-]+$/, 'Phone number may only contain digits and + ( ) -'),
  email: z.email('Please enter a valid email').max(200).optional().or(z.literal('')),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please choose a date'),
  preferredSlot: z.enum(SLOTS),
  notes: z.string().trim().max(1000).optional().or(z.literal('')),
  quotedPrice: z.number().positive().nullable(),
  // Honeypot: never a validation error (a visitor cannot see or fix it); a filled value is handled as a bot below.
  trap: z.string().optional().or(z.literal('')),
});

// Fields the dialog can highlight; an error on any other field is spelled out in the message instead of hidden.
const VISIBLE_FIELDS = ['name', 'phone', 'email', 'preferredDate', 'preferredSlot', 'notes'];

export interface BookingResult {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
}

export async function bookAppointment(formData: FormData): Promise<BookingResult> {
  const raw = {
    productId: (formData.get('productId') as string) || null,
    name: (formData.get('name') as string) ?? '',
    phone: (formData.get('phone') as string) ?? '',
    email: (formData.get('email') as string) ?? '',
    preferredDate: (formData.get('preferredDate') as string) ?? '',
    preferredSlot: (formData.get('preferredSlot') as string) ?? '',
    notes: (formData.get('notes') as string) ?? '',
    quotedPrice: formData.get('quotedPrice') ? Number(formData.get('quotedPrice')) : null,
    trap: (formData.get('sc_hp_field') as string) ?? '',
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    const hidden = Object.entries(fieldErrors).filter(([key]) => !VISIBLE_FIELDS.includes(key));
    if (hidden.length > 0) {
      console.error('[book-appointment] invalid hidden fields:', hidden);
      return { ok: false, message: `We could not send this request. Please call us on ${STORE.phone}.`, fieldErrors };
    }
    return { ok: false, message: 'Please check the highlighted fields.', fieldErrors };
  }

  const input = parsed.data;

  if (input.trap) {
    return { ok: true, message: 'Thank you — we will call you shortly to confirm.' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(`${input.preferredDate}T00:00:00`) < today) {
    return {
      ok: false,
      message: 'Please choose a date from today onwards.',
      fieldErrors: { preferredDate: 'Date cannot be in the past' },
    };
  }

  const { error } = await supabase.from('appointments').insert({
    product_id: input.productId,
    name: input.name,
    phone: input.phone,
    email: input.email || null,
    preferred_date: input.preferredDate,
    preferred_slot: input.preferredSlot,
    notes: input.notes || null,
    quoted_price: input.quotedPrice,
    quoted_at: input.quotedPrice ? new Date().toISOString() : null,
  });

  if (error) {
    console.error('[book-appointment] insert failed:', error.message);
    return {
      ok: false,
      message: `Something went wrong on our end. Please call us on ${STORE.phone}.`,
    };
  }

  return {
    ok: true,
    message: 'Thank you — your appointment request is received. We will call you to confirm.',
  };
}
