import type { Metadata } from 'next';

import JewelleryTypePage from '@/components/sections/JewelleryTypePage';
import { JEWELLERY_TYPES } from '@/constants/jewelleryTypes';

const spec = JEWELLERY_TYPES.gold;

export const revalidate = 3600;

export const metadata: Metadata = {
  title: spec.metaTitle,
  description: spec.metaDescription,
  alternates: { canonical: spec.path },
  openGraph: { title: `${spec.metaTitle} | Sakthi Chains`, description: spec.metaDescription, type: 'website' },
};

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  return <JewelleryTypePage type="gold" searchParams={await searchParams} />;
}
