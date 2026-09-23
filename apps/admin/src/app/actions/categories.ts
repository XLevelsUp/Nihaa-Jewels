'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { createAdminClient } from '@/lib/supabase-server';
import { getCurrentUser } from '@/lib/supabase-auth';
import { slugify } from '@/lib/pricing';
import type { ActionResult } from './products';

const categorySchema = z.object({
  id: z.string().uuid().optional().or(z.literal('')),
  name: z.string().trim().min(2, 'Name is required').max(100),
  slug: z.string().trim().max(100).optional().or(z.literal('')),
  description: z.string().trim().max(1000).optional().or(z.literal('')),
  heroEyebrow: z.string().trim().max(60).optional().or(z.literal('')),
  heroImagePath: z.string().trim().max(500).optional().or(z.literal('')),
  metaTitle: z.string().trim().max(200).optional().or(z.literal('')),
  metaDescription: z.string().trim().max(500).optional().or(z.literal('')),
  metaKeywords: z.string().trim().max(500).optional().or(z.literal('')),
  displayOrder: z.coerce.number().int().min(0).max(999),
  isActive: z.coerce.boolean().optional(),
});

export async function saveCategory(formData: FormData): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: 'Your session has expired. Please sign in again.' };

  const parsed = categorySchema.safeParse({
    id: (formData.get('id') as string) ?? '',
    name: (formData.get('name') as string) ?? '',
    slug: (formData.get('slug') as string) ?? '',
    description: (formData.get('description') as string) ?? '',
    heroEyebrow: (formData.get('heroEyebrow') as string) ?? '',
    heroImagePath: (formData.get('heroImagePath') as string) ?? '',
    metaTitle: (formData.get('metaTitle') as string) ?? '',
    metaDescription: (formData.get('metaDescription') as string) ?? '',
    metaKeywords: (formData.get('metaKeywords') as string) ?? '',
    displayOrder: formData.get('displayOrder') || 0,
    isActive: formData.get('isActive') === 'true',
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, message: 'Please check the highlighted fields.', fieldErrors };
  }

  const input = parsed.data;
  const supabase = createAdminClient();
  const slug = slugify(input.slug || input.name);

  const row = {
    name: input.name,
    slug,
    description: input.description || null,
    hero_eyebrow: input.heroEyebrow || null,
    hero_image_path: input.heroImagePath || null,
    meta_title: input.metaTitle || null,
    meta_description: input.metaDescription || null,
    meta_keywords: input.metaKeywords
      ? input.metaKeywords.split(',').map((s) => s.trim()).filter(Boolean)
      : [],
    display_order: input.displayOrder,
    is_active: input.isActive ?? false,
  };

  const { data, error } = input.id
    ? await supabase.from('categories').update(row).eq('id', input.id).select('id').single()
    : await supabase.from('categories').insert(row).select('id').single();

  if (error) {
    if (error.code === '23505') {
      return {
        ok: false,
        message: 'A collection with that web address already exists.',
        fieldErrors: { slug: 'Already in use' },
      };
    }
    console.error('[saveCategory]', error);
    return { ok: false, message: 'Could not save the collection. Please try again.' };
  }

  revalidatePath('/categories');
  return {
    ok: true,
    message: input.id ? 'Collection updated.' : `Collection created — its page is live at /collections/${slug}`,
    id: data.id,
  };
}

export async function toggleCategoryActive(id: string, isActive: boolean): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: 'Your session has expired.' };

  const supabase = createAdminClient();
  const { error } = await supabase.from('categories').update({ is_active: isActive }).eq('id', id);

  if (error) {
    console.error('[toggleCategoryActive]', error);
    return { ok: false, message: 'Could not update the collection.' };
  }

  revalidatePath('/categories');
  return {
    ok: true,
    message: isActive ? 'Collection is now visible on the website.' : 'Collection hidden from the website.',
  };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: 'Your session has expired.' };

  const supabase = createAdminClient();

  // products.category_id is ON DELETE RESTRICT, so check first to give a useful message
  // instead of a foreign-key error.
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', id);

  if ((count ?? 0) > 0) {
    return {
      ok: false,
      message: `This collection still has ${count} product${count === 1 ? '' : 's'}. Move or delete them first, or hide the collection instead.`,
    };
  }

  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) {
    console.error('[deleteCategory]', error);
    return { ok: false, message: 'Could not delete the collection.' };
  }

  revalidatePath('/categories');
  return { ok: true, message: 'Collection deleted.' };
}
