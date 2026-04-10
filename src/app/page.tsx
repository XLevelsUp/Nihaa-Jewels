import type { Metadata } from 'next';
import Navigation from '@/components/sections/Navigation';
import StaticBrandHero from '@/components/sections/StaticBrandHero';
import PromotionalHero from '@/components/sections/PromotionalHero';
import CategoryDiscoveryGrid from '@/components/sections/CategoryDiscoveryGrid';
import NewLaunch from '@/components/sections/NewLaunch';
import ShopByGender from '@/components/sections/ShopByGender';
import NihaaAssurance from '@/components/sections/NihaaAssurance';
import Footer from '@/components/sections/Footer';

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
