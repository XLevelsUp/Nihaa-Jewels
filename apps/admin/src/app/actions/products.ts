'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { createAdminClient } from '@/lib/supabase-server';
import { getCurrentUser } from '@/lib/supabase-auth';
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
  occasion: z.string().optional().or(z.literal('')),
  gender: z.string().optional().or(z.literal('')),
  isActive: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
});

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
    occasion: (formData.get('occasion') as string) ?? '',
    gender: (formData.get('gender') as string) ?? '',
    isActive: formData.get('isActive') === 'true',
    isFeatured: formData.get('isFeatured') === 'true',
  };
}

export async function saveProduct(formData: FormData): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: 'Your session has expired. Please sign in again.' };

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

  const supabase = createAdminClient();
  const slug = slugify(input.slug || input.name);

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
    occasion: input.occasion ? input.occasion.split(',').map((s) => s.trim()).filter(Boolean) : [],
    gender: input.gender || null,
    is_active: input.isActive ?? false,
    is_featured: input.isFeatured ?? false,
  };

  const { data, error } = input.id
    ? await supabase.from('products').update(row).eq('id', input.id).select('id').single()
    : await supabase.from('products').insert(row).select('id').single();

  if (error) {
    if (error.code === '23505') {
      const field = error.message.includes('sku') ? 'sku' : 'slug';
      return {
        ok: false,
        message: `That ${field} is already used by another product.`,
        fieldErrors: { [field]: 'Already in use' },
      };
    }
    console.error('[saveProduct]', error);
    return { ok: false, message: 'Could not save the product. Please try again.' };
  }

  revalidateCatalogue();
  return { ok: true, message: input.id ? 'Product updated.' : 'Product created.', id: data.id };
}

export async function toggleProductActive(id: string, isActive: boolean): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: 'Your session has expired.' };

  const supabase = createAdminClient();
  const { error } = await supabase.from('products').update({ is_active: isActive }).eq('id', id);

  if (error) {
    console.error('[toggleProductActive]', error);
    return { ok: false, message: 'Could not update the product.' };
  }

  revalidateCatalogue();
  return { ok: true, message: isActive ? 'Product is now visible on the website.' : 'Product hidden from the website.' };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: 'Your session has expired.' };

  const supabase = createAdminClient();

  // Remove the stored files too, or the bucket accumulates orphans nothing references.
  const { data: images } = await supabase
    .from('product_images')
    .select('storage_path')
    .eq('product_id', id);

  const uploaded = (images ?? [])
    .map((i) => i.storage_path)
    .filter((p) => !p.startsWith('/'));
  if (uploaded.length > 0) {
    await supabase.storage.from('product-images').remove(uploaded);
  }

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    console.error('[deleteProduct]', error);
    return { ok: false, message: 'Could not delete the product.' };
  }

  revalidateCatalogue();
  return { ok: true, message: 'Product deleted.' };
}

export async function uploadProductImage(formData: FormData): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: 'Your session has expired.' };

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

  const supabase = createAdminClient();
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${productId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error('[uploadProductImage]', uploadError);
    return { ok: false, message: 'Could not upload the image. Please try again.' };
  }

  const { count } = await supabase
    .from('product_images')
    .select('*', { count: 'exact', head: true })
    .eq('product_id', productId);

  const { error: insertError } = await supabase.from('product_images').insert({
    product_id: productId,
    storage_path: path,
    alt_text: altText,
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

export async function deleteProductImage(imageId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: 'Your session has expired.' };

  const supabase = createAdminClient();
  const { data: image } = await supabase
    .from('product_images')
    .select('storage_path, product_id, is_primary')
    .eq('id', imageId)
    .maybeSingle();

  if (!image) return { ok: false, message: 'Image not found.' };

  await supabase.from('product_images').delete().eq('id', imageId);

  if (!image.storage_path.startsWith('/')) {
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
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: 'Your session has expired.' };

  const supabase = createAdminClient();
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
