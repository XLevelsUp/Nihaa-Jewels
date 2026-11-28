// Server loader for featured pieces grouped into Gold, Silver and Diamond tabs.

import SignatureCreationsClient from './SignatureCreationsClient';
import { getProducts, type PricedProduct } from '@/lib/catalogue';
import { typeOf, type JewelleryType } from '@/constants/jewelleryTypes';

export default async function SignatureCreations() {
  let products: PricedProduct[] = [];
  try {
    products = await getProducts({ featuredOnly: true, limit: 24 });
  } catch {
    return null;
  }
  if (products.length === 0) return null;

  const grouped: Record<JewelleryType, PricedProduct[]> = {
    gold: [],
    silver: [],
    diamond: [],
  };

  for (const p of products) {
    grouped[typeOf(p)].push(p);
  }

  return <SignatureCreationsClient grouped={grouped} />;
}
