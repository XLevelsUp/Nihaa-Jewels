import 'server-only';

// gold_rates is append-only: an override inserts a new row, never updates one, so history is preserved.

import { revalidatePath, revalidateTag } from 'next/cache';

import { createAdminClient } from './supabase-server';
import type { GoldRate, Karat } from '@/types/database';

export const KARATS: Karat[] = ['22K', '18K', '24K'];

export const MAX_DEVIATION_PCT = 5;

export interface CurrentRate {
  karat: Karat;
  ratePerGram: number;
  source: string;
  effectiveFrom: string;
  note: string | null;
}

export function validateRateChange(
  newRate: number,
  previousRate: number | null,
  maxDeviationPct = MAX_DEVIATION_PCT,
): string | null {
  if (!Number.isFinite(newRate) || newRate <= 0) {
    return `Rate must be a positive number, received ${newRate}`;
  }
  if (previousRate === null) return null;

  const deviationPct = Math.abs((newRate - previousRate) / previousRate) * 100;
  if (deviationPct > maxDeviationPct) {
    return `${formatRupees(newRate)} is ${deviationPct.toFixed(1)}% away from the current ${formatRupees(previousRate)} — over the ${maxDeviationPct}% safety limit.`;
  }
  return null;
}

export function formatRupees(amount: number, showPaise = false): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showPaise ? 2 : 0,
    maximumFractionDigits: showPaise ? 2 : 0,
  }).format(amount);
}

export async function getCurrentRates(): Promise<Map<Karat, CurrentRate>> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('gold_rates')
    .select('karat, rate_per_gram, source, effective_from, note')
    .order('effective_from', { ascending: false });

  if (error) throw new Error(`Failed to load gold rates: ${error.message}`);

  const current = new Map<Karat, CurrentRate>();
  for (const row of data ?? []) {
    const karat = row.karat as Karat;
    if (!current.has(karat)) {
      current.set(karat, {
        karat,
        ratePerGram: Number(row.rate_per_gram),
        source: row.source,
        effectiveFrom: row.effective_from,
        note: row.note,
      });
    }
  }
  return current;
}

export async function getRateHistory(limit = 50): Promise<GoldRate[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('gold_rates')
    .select('*')
    .order('effective_from', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to load rate history: ${error.message}`);
  return (data ?? []) as GoldRate[];
}

export async function publishRate(params: {
  karat: Karat;
  ratePerGram: number;
  note: string | null;
  createdBy: string | null;
}): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase.from('gold_rates').insert({
    karat: params.karat,
    rate_per_gram: params.ratePerGram,
    source: 'manual',
    note: params.note,
    created_by: params.createdBy,
  });

  if (error) throw new Error(`Failed to publish rate: ${error.message}`);

  // Without this the public site keeps serving the old price for up to an hour.
  revalidateTag('gold-rate');
  revalidatePath('/gold-rates');
}
