'use server';

import { z } from 'zod';

import { authorize } from '@/lib/supabase-auth';
import { getCurrentRates, getCurrentSilverRates, publishRate, publishSilverRate, validateRateChange } from '@/lib/rates';
import type { Karat, SilverPurity } from '@/types/database';

const schema = z.object({
  karat: z.enum(['22K', '18K', '24K']),
  ratePerGram: z.coerce.number().positive('Enter a rate greater than zero').max(1000000),
  note: z.string().trim().max(500).optional().or(z.literal('')),
  // Set only when the user has seen the deviation warning and chosen to continue.
  confirmed: z.coerce.boolean().optional(),
});

export interface PublishRateResult {
  ok: boolean;
  message: string;
  needsConfirmation?: boolean;
}

export async function publishGoldRate(formData: FormData): Promise<PublishRateResult> {
  const auth = await authorize('rates.edit');
  if (!auth.user) return { ok: false, message: auth.error };
  const { user } = auth;

  const parsed = schema.safeParse({
    karat: formData.get('karat'),
    ratePerGram: formData.get('ratePerGram'),
    note: formData.get('note') ?? '',
    confirmed: formData.get('confirmed') === 'true',
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check the rate you entered.' };
  }

  const { karat, ratePerGram, note, confirmed } = parsed.data;

  const current = await getCurrentRates();
  const previous = current.get(karat as Karat)?.ratePerGram ?? null;

  // A mistyped rate (72500 for 7250) would otherwise reach customers within seconds.
  const deviationError = validateRateChange(ratePerGram, previous);
  if (deviationError && !confirmed) {
    return { ok: false, message: deviationError, needsConfirmation: true };
  }

  try {
    await publishRate({
      karat: karat as Karat,
      ratePerGram,
      note: note || null,
      createdBy: user.id,
    });
  } catch (error) {
    console.error('[publishGoldRate]', error);
    return { ok: false, message: 'Could not save the rate. Please try again.' };
  }

  return { ok: true, message: `${karat} rate updated. The website now shows the new price.` };
}

const silverSchema = schema.omit({ karat: true }).extend({ purity: z.enum(['925', '999']) });

export async function publishSilverRateAction(formData: FormData): Promise<PublishRateResult> {
  const auth = await authorize('rates.edit');
  if (!auth.user) return { ok: false, message: auth.error };
  const { user } = auth;

  const parsed = silverSchema.safeParse({
    purity: formData.get('purity'),
    ratePerGram: formData.get('ratePerGram'),
    note: formData.get('note') ?? '',
    confirmed: formData.get('confirmed') === 'true',
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check the rate you entered.' };
  }

  const { purity, ratePerGram, note, confirmed } = parsed.data;
  const current = await getCurrentSilverRates();
  const previous = current.get(purity as SilverPurity)?.ratePerGram ?? null;

  const deviationError = validateRateChange(ratePerGram, previous);
  if (deviationError && !confirmed) {
    return { ok: false, message: deviationError, needsConfirmation: true };
  }

  try {
    await publishSilverRate({ purity: purity as SilverPurity, ratePerGram, note: note || null, createdBy: user.id });
  } catch (error) {
    console.error('[publishSilverRate]', error);
    return { ok: false, message: 'Could not save the silver rate. Please try again.' };
  }

  return { ok: true, message: `${purity} silver rate updated. The website now shows the new price.` };
}
