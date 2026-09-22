// Duplicated in apps/admin/src/types/database.ts — no shared package. Change one, change the other.

export type Karat = '18K' | '22K' | '24K';
export type MakingChargeType = 'per_gram' | 'flat' | 'percentage';
export type RateSource = 'api' | 'manual';
export type AppointmentStatus = 'new' | 'confirmed' | 'completed' | 'cancelled';

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  display_order: number;
  is_active: boolean;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[];
  hero_eyebrow: string | null;
  hero_image_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  cover_image_path: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[];
  author_name: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description: string | null;
  category_id: string;
  karat: Karat;
  gross_weight_g: number;
  net_weight_g: number;
  wastage_pct: number;
  making_charge_type: MakingChargeType;
  making_charge_value: number;
  stone_charges: number;
  hallmark_charges: number;
  occasion: string[];
  gender: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  storage_path: string;
  alt_text: string;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface GoldRate {
  id: string;
  karat: Karat;
  rate_per_gram: number;
  source: RateSource;
  effective_from: string;
  note: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Appointment {
  id: string;
  product_id: string | null;
  name: string;
  phone: string;
  email: string | null;
  preferred_date: string;
  preferred_slot: string;
  notes: string | null;
  status: AppointmentStatus;
  quoted_price: number | null;
  quoted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductWithRelations extends Product {
  category: Pick<Category, 'id' | 'slug' | 'name'> | null;
  images: ProductImage[];
}
