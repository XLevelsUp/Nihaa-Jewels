'use server';

import { revalidatePath } from 'next/cache';
import sharp from 'sharp';
import { z } from 'zod';

import { createAdminClient } from '@/lib/supabase-server';
import { authorize } from '@/lib/supabase-auth';
import { slugify } from '@/lib/pricing';

// Admin and marketing deploy separately, so this cannot clear the public site's
// cache. The menu and collection pages pick up changes within the hour; see
// docs/e-catalogue-plan.md for the webhook that would make it instant.
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
  parentId: z.string().uuid().optional().or(z.literal('')),
  badge: z.string().trim().max(30).optional().or(z.literal('')),
  showInNav: z.coerce.boolean().optional(),
  displayOrder: z.coerce.number().int().min(0).max(999),
  isActive: z.coerce.boolean().optional(),
});

export async function saveCategory(formData: FormData): Promise<ActionResult> {
  const auth = await authorize('categories.edit');
  if (!auth.user) return { ok: false, message: auth.error };

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
    parentId: (formData.get('parentId') as string) ?? '',
    badge: (formData.get('badge') as string) ?? '',
    showInNav: formData.get('showInNav') === 'true',
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

  // One level only: a sub-category cannot itself be a parent, and nothing may
  // parent itself. Either would produce a menu that recurses forever.
  if (input.parentId) {
    if (input.parentId === input.id) {
      return {
        ok: false,
        message: 'A collection cannot be its own parent.',
        fieldErrors: { parentId: 'Choose a different parent' },
      };
    }

    const { data: parent } = await supabase
      .from('categories')
      .select('parent_id')
      .eq('id', input.parentId)
      .maybeSingle();

    if (parent?.parent_id) {
      return {
        ok: false,
        message: 'That collection is already a sub-collection. Only one level of nesting is supported.',
        fieldErrors: { parentId: 'Pick a top-level collection' },
      };
    }

    if (input.id) {
      const { count } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true })
        .eq('parent_id', input.id);

      if ((count ?? 0) > 0) {
        return {
          ok: false,
          message: 'This collection already has sub-collections, so it cannot become one itself.',
          fieldErrors: { parentId: 'Move its sub-collections first' },
        };
      }
    }
  }

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
    parent_id: input.parentId || null,
    badge: input.badge || null,
    show_in_nav: input.showInNav ?? true,
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

// Collection photos share the product-images bucket under categories/, re-encoded to WebP like product photos; the returned path is saved with the collection.
export async function uploadCategoryImage(formData: FormData): Promise<ActionResult & { path?: string }> {
  const auth = await authorize('categories.edit');
  if (!auth.user) return { ok: false, message: auth.error };

  const file = formData.get('file') as File | null;
  if (!file || file.size === 0) return { ok: false, message: 'Choose a photo to upload.' };
  if (file.size > 10 * 1024 * 1024) return { ok: false, message: 'Photo must be under 10 MB.' };

  let webp: Buffer;
  try {
    const source = sharp(Buffer.from(await file.arrayBuffer()), { failOn: 'error' }).rotate();
    const { width = 0, height = 0 } = await source.metadata();
    if (Math.min(width, height) < 800) {
      return { ok: false, message: `This photo is ${width} × ${height}px. Use one at least 800px on its shorter side.` };
    }
    webp = await source.resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toBuffer();
  } catch {
    return { ok: false, message: 'That file could not be read as an image.' };
  }

  const supabase = createAdminClient();
  const path = `categories/${crypto.randomUUID()}.webp`;
  const { error } = await supabase.storage.from('product-images').upload(path, webp, { contentType: 'image/webp', upsert: false });
  if (error) {
    console.error('[uploadCategoryImage]', error);
    return { ok: false, message: 'Could not upload the photo. Please try again.' };
  }
  return { ok: true, message: 'Photo uploaded. Save the collection to use it.', path };
}

export async function reorderCategories(orderedIds: string[]): Promise<ActionResult> {
  const auth = await authorize('categories.edit');
  if (!auth.user) return { ok: false, message: auth.error };

  const supabase = createAdminClient();
  const results = await Promise.all(orderedIds.map((id, i) => supabase.from('categories').update({ display_order: i + 1 }).eq('id', id)));
  if (results.some((r) => r.error)) {
    console.error('[reorderCategories]', results.find((r) => r.error)?.error);
    return { ok: false, message: 'Could not save the new order.' };
  }

  revalidatePath('/categories');
  return { ok: true, message: 'Collection order saved. The website menu follows this order.' };
}

export async function toggleCategoryActive(id: string, isActive: boolean): Promise<ActionResult> {
  const auth = await authorize('categories.edit');
  if (!auth.user) return { ok: false, message: auth.error };

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
  const auth = await authorize('categories.edit');
  if (!auth.user) return { ok: false, message: auth.error };

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
