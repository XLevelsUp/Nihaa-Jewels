import type { Metadata } from 'next';
import Navigation from '@/components/sections/Navigation';
import StaticBrandHero from '@/components/sections/StaticBrandHero';
import PromotionalHero from '@/components/sections/PromotionalHero';
import dynamic from 'next/dynamic';

const NewLaunch = dynamic(() => import('@/components/sections/NewLaunch'));
const CategoryDiscoveryGrid = dynamic(() => import('@/components/sections/CategoryDiscoveryGrid'));
const ShopByGender = dynamic(() => import('@/components/sections/ShopByGender'));
const NihaaAssurance = dynamic(() => import('@/components/sections/NihaaAssurance'));
const Footer = dynamic(() => import('@/components/sections/Footer'));

export const metadata: Metadata = {
  title: "Nihaa Jewels — Fine Luxury Jewellery & Bespoke Goldsmiths",
  description: "Explore Coimbatore's finest collection of handcrafted gold, diamond, and bridal jewellery. Four generations of mastery in every piece.",
};

export default function Home() {
  return (
    <main className="bg-[#121212] min-h-screen">
      <Navigation />
      <StaticBrandHero />
      <PromotionalHero />
      <NewLaunch />
      <CategoryDiscoveryGrid />
      <ShopByGender />
      <NihaaAssurance />
      <Footer />
    </main>
  );
}
