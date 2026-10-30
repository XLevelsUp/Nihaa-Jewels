'use server';

import { revalidatePath } from 'next/cache';
import sharp from 'sharp';
import { z } from 'zod';

import { createAdminClient } from '@/lib/supabase-server';
import { authorize } from '@/lib/supabase-auth';
import { can, deniedMessage } from '@/lib/permissions';
import { slugify } from '@/lib/pricing';

const productSchema = z.object({
  id: z.string().uuid().optional().or(z.literal('')),
  sku: z.string().trim().min(1, 'SKU is required').max(50),
  name: z.string().trim().min(2, 'Name is required').max(200),
  slug: z.string().trim().max(200).optional().or(z.literal('')),
  description: z.string().trim().max(5000).optional().or(z.literal('')),
  categoryId: z.string().uuid('Choose a collection'),
  karat: z.enum(['18K', '22K', '24K']),
  grossWeightG: z.coerce.number().positive('Gross weight must be greater than zero'),
  netWeightG: z.coerce.number().positive('Net weight must be greater than zero'),
  wastagePct: z.coerce.number().min(0).max(100),
  makingChargeType: z.enum(['per_gram', 'flat', 'percentage']),
  makingChargeValue: z.coerce.number().min(0),
  stoneCharges: z.coerce.number().min(0),
  hallmarkCharges: z.coerce.number().min(0),
  discountType: z.enum(['percentage', 'flat']),
  discountValue: z.coerce.number().min(0, 'Discount cannot be negative'),
  occasion: z.string().optional().or(z.literal('')),
  gender: z.string().optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived']),
  isFeatured: z.coerce.boolean().optional(),
  metalColour: z.enum(['yellow', 'rose', 'white']).optional().or(z.literal('')),
  huid: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{6}$/, 'HUID is 6 letters or digits')
    .optional()
    .or(z.literal('')),
  sizeLabel: z.string().trim().max(60).optional().or(z.literal('')),
  dimensions: z.string().trim().max(120).optional().or(z.literal('')),
  closure: z.string().trim().max(60).optional().or(z.literal('')),
  careInstructions: z.string().trim().max(1000).optional().or(z.literal('')),
});

const MIN_IMAGE_SIDE = 800;
const MAX_IMAGE_SIDE = 2000;

const STATUS_MESSAGES: Record<'draft' | 'published' | 'archived', string> = {
  draft: 'Saved as a draft, hidden from the website.',
  published: 'Published on the website.',
  archived: 'Archived and hidden from the website.',
};

export interface ActionResult {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
  id?: string;
}

function readForm(formData: FormData) {
  return {
    id: (formData.get('id') as string) ?? '',
    sku: (formData.get('sku') as string) ?? '',
    name: (formData.get('name') as string) ?? '',
    slug: (formData.get('slug') as string) ?? '',
    description: (formData.get('description') as string) ?? '',
    categoryId: (formData.get('categoryId') as string) ?? '',
    karat: (formData.get('karat') as string) ?? '',
    grossWeightG: formData.get('grossWeightG'),
    netWeightG: formData.get('netWeightG'),
    wastagePct: formData.get('wastagePct') || 0,
    makingChargeType: (formData.get('makingChargeType') as string) ?? 'per_gram',
    makingChargeValue: formData.get('makingChargeValue') || 0,
    stoneCharges: formData.get('stoneCharges') || 0,
    hallmarkCharges: formData.get('hallmarkCharges') || 0,
    discountType: (formData.get('discountType') as string) || 'percentage',
    discountValue: formData.get('discountValue') || 0,
    occasion: (formData.get('occasion') as string) ?? '',
    gender: (formData.get('gender') as string) ?? '',
    status: (formData.get('status') as string) || 'draft',
    isFeatured: formData.get('isFeatured') === 'true',
    metalColour: (formData.get('metalColour') as string) ?? '',
    huid: (formData.get('huid') as string) ?? '',
    sizeLabel: (formData.get('sizeLabel') as string) ?? '',
    dimensions: (formData.get('dimensions') as string) ?? '',
    closure: (formData.get('closure') as string) ?? '',
    careInstructions: (formData.get('careInstructions') as string) ?? '',
  };
}

export async function saveProduct(formData: FormData): Promise<ActionResult> {
  const auth = await authorize('products.edit');
  if (!auth.user) return { ok: false, message: auth.error };
  const { user } = auth;

  const parsed = productSchema.safeParse(readForm(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, message: 'Please check the highlighted fields.', fieldErrors };
  }

  const input = parsed.data;

  // The DB enforces this too, but the constraint error would be opaque to staff.
  if (input.netWeightG > input.grossWeightG) {
    return {
      ok: false,
      message: 'Net weight cannot be more than gross weight.',
      fieldErrors: { netWeightG: 'Cannot exceed gross weight' },
    };
  }

  if (input.discountType === 'percentage' && input.discountValue > 100) {
    return {
      ok: false,
      message: 'A percentage discount cannot exceed 100%.',
      fieldErrors: { discountValue: 'Cannot exceed 100%' },
    };
  }

  const supabase = createAdminClient(user.email);
  const slug = slugify(input.slug || input.name);

  // Publishing and discounts carry their own permissions, so either can be narrowed to one role in permissions.ts alone.
  const { data: existing } = input.id
    ? await supabase.from('products').select('status, discount_type, discount_value').eq('id', input.id).maybeSingle()
    : { data: null };
  if (input.status === 'published' && existing?.status !== 'published' && !can(user.role, 'products.publish')) {
    return { ok: false, message: deniedMessage('products.publish'), fieldErrors: { status: 'Not allowed for your role' } };
  }
  const discountChanged = existing
    ? existing.discount_type !== input.discountType || Number(existing.discount_value) !== input.discountValue
    : input.discountValue > 0;
  if (discountChanged && !can(user.role, 'discounts.edit')) {
    return { ok: false, message: deniedMessage('discounts.edit'), fieldErrors: { discountValue: 'Not allowed for your role' } };
  }

  if (input.status === 'published') {
    const blocker = input.id ? await publishBlocker(supabase, input.id) : 'Create the product as a draft and add a photo before publishing.';
    if (blocker) return { ok: false, message: blocker, fieldErrors: { status: blocker } };
  }

  const row = {
    sku: input.sku,
    slug,
    name: input.name,
    description: input.description || null,
    category_id: input.categoryId,
    karat: input.karat,
    gross_weight_g: input.grossWeightG,
    net_weight_g: input.netWeightG,
    wastage_pct: input.wastagePct,
    making_charge_type: input.makingChargeType,
    making_charge_value: input.makingChargeValue,
    stone_charges: input.stoneCharges,
    hallmark_charges: input.hallmarkCharges,
    discount_type: input.discountType,
    discount_value: input.discountValue,
    occasion: input.occasion ? input.occasion.split(',').map((s) => s.trim()).filter(Boolean) : [],
    gender: input.gender || null,
    status: input.status,
    is_featured: input.isFeatured ?? false,
    metal_colour: input.metalColour || null,
    huid: input.huid || null,
    size_label: input.sizeLabel || null,
    dimensions: input.dimensions || null,
    closure: input.closure || null,
    care_instructions: input.careInstructions || null,
  };

  const { data, error } = input.id
    ? await supabase.from('products').update(row).eq('id', input.id).select('id').single()
    : await supabase.from('products').insert(row).select('id').single();

  if (error) {
    const conflict = uniqueConflict(error);
    if (conflict) return conflict;
    console.error('[saveProduct]', error);
    return { ok: false, message: 'Could not save the product. Please try again.' };
  }

  revalidateCatalogue();
  return { ok: true, message: input.id ? `Product updated. ${STATUS_MESSAGES[input.status]}` : 'Product created.', id: data.id };
}

// The same rule the form's checklist shows, enforced here so the quick status menu in the list cannot skip it.
async function publishBlocker(supabase: ReturnType<typeof createAdminClient>, id: string): Promise<string | null> {
  const { count } = await supabase.from('product_images').select('id', { count: 'exact', head: true }).eq('product_id', id);
  return count ? null : 'Add at least one photo before publishing.';
}

function uniqueConflict(error: { code?: string; message: string }): ActionResult | null {
  if (error.code !== '23505') return null;
  const field = error.message.includes('huid') ? 'huid' : error.message.includes('sku') ? 'sku' : 'slug';
  const label = field === 'huid' ? 'HUID' : field === 'sku' ? 'SKU' : 'web address (slug)';
  return { ok: false, message: `That ${label} is already used by another product.`, fieldErrors: { [field]: 'Already in use' } };
}

export async function setProductStatus(id: string, status: 'draft' | 'published' | 'archived'): Promise<ActionResult> {
  const auth = await authorize('products.edit');
  if (!auth.user) return { ok: false, message: auth.error };
  const { user } = auth;

  const supabase = createAdminClient(user.email);
  if (status === 'published') {
    if (!can(user.role, 'products.publish')) return { ok: false, message: deniedMessage('products.publish') };
    const blocker = await publishBlocker(supabase, id);
    if (blocker) return { ok: false, message: blocker };
  }
  const { error } = await supabase.from('products').update({ status }).eq('id', id);

  if (error) {
    console.error('[setProductStatus]', error);
    return { ok: false, message: 'Could not update the product.' };
  }

  revalidateCatalogue();
  return { ok: true, message: STATUS_MESSAGES[status] };
}

export async function restoreProduct(id: string): Promise<ActionResult> {
  const auth = await authorize('products.delete');
  if (!auth.user) return { ok: false, message: auth.error };
  const { user } = auth;

  const supabase = createAdminClient(user.email);
  const { error } = await supabase.from('products').update({ deleted_at: null }).eq('id', id);

  if (error) {
    const conflict = uniqueConflict(error);
    if (conflict) return { ok: false, message: `${conflict.message} Change it on the other product first.` };
    console.error('[restoreProduct]', error);
    return { ok: false, message: 'Could not restore the product.' };
  }

  revalidateCatalogue();
  return { ok: true, message: 'Product restored with its previous status.' };
}

// Columns a copy must not inherit: identity, timestamps, and anything tied to one physical piece.
const NOT_COPIED = ['id', 'created_at', 'updated_at', 'is_active', 'deleted_at', 'huid', 'images'];

export async function duplicateProduct(id: string): Promise<ActionResult> {
  const auth = await authorize('products.edit');
  if (!auth.user) return { ok: false, message: auth.error };
  const { user } = auth;

  const supabase = createAdminClient(user.email);
  const { data: source } = await supabase
    .from('products')
    .select('*, images:product_images ( storage_path, alt_text, display_order, is_primary )')
    .eq('id', id)
    .maybeSingle();
  if (!source) return { ok: false, message: 'Product not found.' };

  const free = async (column: 'sku' | 'slug', base: string) => {
    for (let n = 1; n < 50; n++) {
      const candidate = n === 1 ? base : `${base}-${n}`;
      const { count } = await supabase.from('products').select('id', { count: 'exact', head: true }).eq(column, candidate);
      if (!count) return candidate;
    }
    return `${base}-${Date.now()}`;
  };

  const copy: Record<string, unknown> = Object.fromEntries(Object.entries(source).filter(([k]) => !NOT_COPIED.includes(k)));
  copy.sku = await free('sku', `${source.sku}-COPY`);
  copy.slug = await free('slug', `${source.slug}-copy`);
  copy.name = `${source.name} (copy)`;
  copy.status = 'draft';
  copy.is_featured = false;

  const { data: created, error } = await supabase.from('products').insert(copy).select('id').single();
  if (error || !created) {
    console.error('[duplicateProduct]', error);
    return { ok: false, message: 'Could not duplicate the product.' };
  }

  // The copy points at the same photo files; deleteProductImage only removes a file once nothing references it.
  const images = (source.images ?? []) as { storage_path: string; alt_text: string; display_order: number; is_primary: boolean }[];
  if (images.length > 0) {
    await supabase.from('product_images').insert(images.map((img) => ({ ...img, product_id: created.id })));
  }

  revalidateCatalogue();
  return { ok: true, message: 'Copy created as a draft. Set its SKU, HUID and weight, then publish.', id: created.id };
}

// History columns that are never written back by an undo.
const NOT_UNDOABLE = ['id', 'created_at', 'updated_at', 'is_active'];

export async function undoChange(auditId: number): Promise<ActionResult> {
  const auth = await authorize('products.edit');
  if (!auth.user) return { ok: false, message: auth.error };
  const { user } = auth;

  const supabase = createAdminClient(user.email);
  const { data: entry } = await supabase.from('product_audit').select('*').eq('id', auditId).maybeSingle();
  if (!entry) return { ok: false, message: 'That history entry no longer exists.' };
  if (entry.action === 'created') return { ok: false, message: 'A creation cannot be undone; delete the product instead.' };

  const changes = entry.changes as Record<string, { from: unknown; to: unknown }>;
  // An undo is itself an edit, so it needs whatever permission the edit it reverses would need.
  if ((entry.action === 'deleted' || entry.action === 'restored') && !can(user.role, 'products.delete')) {
    return { ok: false, message: deniedMessage('products.delete') };
  }
  if (('discount_type' in changes || 'discount_value' in changes) && !can(user.role, 'discounts.edit')) {
    return { ok: false, message: deniedMessage('discounts.edit') };
  }
  if (changes.status?.from === 'published' && !can(user.role, 'products.publish')) {
    return { ok: false, message: deniedMessage('products.publish') };
  }
  const patch: Record<string, unknown> = Object.fromEntries(
    Object.entries(changes)
      .filter(([field]) => !NOT_UNDOABLE.includes(field))
      .map(([field, change]) => [field, change.from]),
  );
  if (Object.keys(patch).length === 0) return { ok: false, message: 'Nothing in that change can be undone.' };

  const { error } = await supabase.from('products').update(patch).eq('id', entry.product_id);
  if (error) {
    const conflict = uniqueConflict(error);
    if (conflict) return { ok: false, message: `Cannot undo: ${conflict.message.charAt(0).toLowerCase()}${conflict.message.slice(1)}` };
    console.error('[undoChange]', error);
    return { ok: false, message: 'Could not undo that change.' };
  }

  revalidateCatalogue();
  revalidatePath(`/products/${entry.product_id}`);
  return { ok: true, message: 'Change undone. The undo itself is recorded in the history.' };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const auth = await authorize('products.delete');
  if (!auth.user) return { ok: false, message: auth.error };
  const { user } = auth;

  // Soft delete: the row, its photos and its history stay, and Restore brings it back exactly as it was.
  const supabase = createAdminClient(user.email);
  const { error } = await supabase
    .from('products')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);
  if (error) {
    console.error('[deleteProduct]', error);
    return { ok: false, message: 'Could not delete the product.' };
  }

  revalidateCatalogue();
  return { ok: true, message: 'Product moved to Deleted. You can restore it from the Deleted tab.' };
}

export async function uploadProductImage(formData: FormData): Promise<ActionResult> {
  const auth = await authorize('products.edit');
  if (!auth.user) return { ok: false, message: auth.error };
  const { user } = auth;

  const productId = formData.get('productId') as string;
  const file = formData.get('file') as File | null;
  const altText = ((formData.get('altText') as string) ?? '').trim();

  if (!productId || !file || file.size === 0) {
    return { ok: false, message: 'Choose an image to upload.' };
  }

  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  if (!allowed.includes(file.type)) {
    return { ok: false, message: 'Use a JPEG, PNG, WebP or AVIF image.' };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { ok: false, message: 'Image must be under 10 MB.' };
  }

  // Every upload is checked and re-encoded here, so staff can drop in a raw 8 MB photo and the site still serves a light WebP.
  let webp: Buffer;
  try {
    const source = sharp(Buffer.from(await file.arrayBuffer()), { failOn: 'error' }).rotate();
    const { width = 0, height = 0 } = await source.metadata();
    if (Math.min(width, height) < MIN_IMAGE_SIDE) {
      return {
        ok: false,
        message: `This photo is ${width} × ${height}px. Use one at least ${MIN_IMAGE_SIDE}px on its shorter side so it stays sharp on the website.`,
      };
    }
    webp = await source
      .resize({ width: MAX_IMAGE_SIDE, height: MAX_IMAGE_SIDE, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toBuffer();
  } catch (e) {
    console.error('[uploadProductImage] decode', e);
    return { ok: false, message: 'That file could not be read as an image.' };
  }

  const supabase = createAdminClient(user.email);
  const path = `${productId}/${crypto.randomUUID()}.webp`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(path, webp, { contentType: 'image/webp', upsert: false });

  if (uploadError) {
    console.error('[uploadProductImage]', uploadError);
    return { ok: false, message: 'Could not upload the image. Please try again.' };
  }

  const [{ count }, { data: owner }] = await Promise.all([
    supabase.from('product_images').select('*', { count: 'exact', head: true }).eq('product_id', productId),
    supabase.from('products').select('name').eq('id', productId).maybeSingle(),
  ]);

  // Alt text is never left empty: it falls back to the product name, so every photo is described for screen readers and image search.
  const fallbackAlt = owner?.name ? `${owner.name}${count ? ` (view ${count + 1})` : ''}` : 'Gold jewellery photograph';

  const { error: insertError } = await supabase.from('product_images').insert({
    product_id: productId,
    storage_path: path,
    alt_text: altText || fallbackAlt,
    display_order: count ?? 0,
    is_primary: (count ?? 0) === 0,
  });

  if (insertError) {
    // Roll back the upload so a failed insert does not leave an orphan file.
    await supabase.storage.from('product-images').remove([path]);
    console.error('[uploadProductImage] insert', insertError);
    return { ok: false, message: 'Could not save the image.' };
  }

  revalidateCatalogue();
  revalidatePath(`/products/${productId}`);
  return { ok: true, message: 'Image uploaded.' };
}

export async function reorderProductImages(productId: string, orderedIds: string[]): Promise<ActionResult> {
  const auth = await authorize('products.edit');
  if (!auth.user) return { ok: false, message: auth.error };
  const { user } = auth;

  const supabase = createAdminClient(user.email);
  const results = await Promise.all(
    orderedIds.map((id, i) => supabase.from('product_images').update({ display_order: i }).eq('id', id).eq('product_id', productId)),
  );
  if (results.some((r) => r.error)) {
    console.error('[reorderProductImages]', results.find((r) => r.error)?.error);
    return { ok: false, message: 'Could not save the new order.' };
  }

  revalidateCatalogue();
  revalidatePath(`/products/${productId}`);
  return { ok: true, message: 'Photo order saved.' };
}

export async function updateImageAlt(imageId: string, altText: string): Promise<ActionResult> {
  const auth = await authorize('products.edit');
  if (!auth.user) return { ok: false, message: auth.error };
  const { user } = auth;

  const alt = altText.trim().slice(0, 200);
  if (!alt) return { ok: false, message: 'Describe the photo in a few words; it cannot be empty.' };

  const supabase = createAdminClient(user.email);
  const { error } = await supabase.from('product_images').update({ alt_text: alt }).eq('id', imageId);
  if (error) {
    console.error('[updateImageAlt]', error);
    return { ok: false, message: 'Could not save the description.' };
  }

  revalidateCatalogue();
  return { ok: true, message: 'Photo description saved.' };
}

export async function deleteProductImage(imageId: string): Promise<ActionResult> {
  const auth = await authorize('products.edit');
  if (!auth.user) return { ok: false, message: auth.error };
  const { user } = auth;

  const supabase = createAdminClient(user.email);
  const { data: image } = await supabase
    .from('product_images')
    .select('storage_path, product_id, is_primary')
    .eq('id', imageId)
    .maybeSingle();

  if (!image) return { ok: false, message: 'Image not found.' };

  await supabase.from('product_images').delete().eq('id', imageId);

  // A duplicated product shares its source's files, so a file goes only when no other image row points at it.
  const { count: stillUsed } = await supabase
    .from('product_images')
    .select('id', { count: 'exact', head: true })
    .eq('storage_path', image.storage_path);
  if (!image.storage_path.startsWith('/') && !stillUsed) {
    await supabase.storage.from('product-images').remove([image.storage_path]);
  }

  // Promote another image so the product does not end up with none marked primary.
  if (image.is_primary) {
    const { data: next } = await supabase
      .from('product_images')
      .select('id')
      .eq('product_id', image.product_id)
      .order('display_order')
      .limit(1)
      .maybeSingle();
    if (next) {
      await supabase.from('product_images').update({ is_primary: true }).eq('id', next.id);
    }
  }

  revalidateCatalogue();
  revalidatePath(`/products/${image.product_id}`);
  return { ok: true, message: 'Image removed.' };
}

export async function setPrimaryImage(imageId: string, productId: string): Promise<ActionResult> {
  const auth = await authorize('products.edit');
  if (!auth.user) return { ok: false, message: auth.error };
  const { user } = auth;

  const supabase = createAdminClient(user.email);
  // Clear first: a unique partial index allows only one primary per product.
  await supabase.from('product_images').update({ is_primary: false }).eq('product_id', productId);
  const { error } = await supabase
    .from('product_images')
    .update({ is_primary: true })
    .eq('id', imageId);

  if (error) {
    console.error('[setPrimaryImage]', error);
    return { ok: false, message: 'Could not set the main image.' };
  }

  revalidateCatalogue();
  revalidatePath(`/products/${productId}`);
  return { ok: true, message: 'Main image updated.' };
}

function revalidateCatalogue() {
  revalidatePath('/products');
  revalidatePath('/');
}
