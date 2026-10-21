import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Navigation from '@/components/sections/NavigationServer';
import StaticBrandHero from '@/components/sections/StaticBrandHero';
import BrandStatement from '@/components/sections/BrandStatement';
import OpeningCurtain from '@/components/ui/OpeningCurtain';
import { homeSlot } from '@/lib/imageSlots';
const DiscoverByCategory = dynamic(() => import('@/components/sections/DiscoverByCategoryServer'));
const CampaignDiptych = dynamic(() => import('@/components/sections/CampaignDiptych'));
const SignatureCreations = dynamic(() => import('@/components/sections/SignatureCreations'));
const Occasions = dynamic(() => import('@/components/sections/Occasions'));
const EditorialBand = dynamic(() => import('@/components/sections/EditorialBand'));
const WornBy = dynamic(() => import('@/components/sections/WornBy'));
const Atelier = dynamic(() => import('@/components/sections/Atelier'));
const UpClose = dynamic(() => import('@/components/sections/UpClose'));
const HousePromise = dynamic(() => import('@/components/sections/HousePromise'));
const MadeForYou = dynamic(() => import('@/components/sections/MadeForYou'));
const VisitUs = dynamic(() => import('@/components/sections/VisitUs'));
const Footer = dynamic(() => import('@/components/sections/Footer'));

export const metadata: Metadata = {
  title: { absolute: 'Sakthi Chains | Fine Gold Jewellery, Made by Hand' },
  description:
    'Sakthi Chains is a house of fine gold jewellery: necklaces, bangles, earrings, chains and bridal sets, BIS hallmarked and finished by hand. Book a private appointment at our showroom.',
  keywords: [
    'Sakthi Chains', 'gold jewellery', 'BIS hallmarked gold', 'bridal gold jewellery', 'temple jewellery',
    'gold necklaces', 'gold bangles', 'gold earrings', 'gold chains', 'old gold exchange', 'bespoke gold jewellery',
  ],
};

export default function Home() {
  return (
    <div className="landing-bg min-h-screen">
      <OpeningCurtain />
      <Navigation />
      <StaticBrandHero />
      <BrandStatement />
      <DiscoverByCategory />
      <CampaignDiptych />
      <SignatureCreations />
      <Occasions />
      <EditorialBand />
      <WornBy />
      <Atelier />
      <UpClose />
      <HousePromise />
      <MadeForYou />
      <VisitUs showroom={homeSlot('visitShowroom')} />
      <Footer />
    </div>
  );
}
