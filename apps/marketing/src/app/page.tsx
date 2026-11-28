import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Navigation from '@/components/sections/NavigationServer';
import StaticBrandHero from '@/components/sections/StaticBrandHero';
import BrandStatement from '@/components/sections/BrandStatement';
import OpeningCurtain from '@/components/ui/OpeningCurtain';
import { homeSlot } from '@/lib/imageSlots';
const DiscoverByCategory = dynamic(() => import('@/components/sections/DiscoverByCategoryServer'));
const ShopByType = dynamic(() => import('@/components/sections/ShopByType'));
const TodaysRates = dynamic(() => import('@/components/sections/TodaysRates'));
const ShopByPrice = dynamic(() => import('@/components/sections/ShopByPrice'));
const CampaignDiptych = dynamic(() => import('@/components/sections/CampaignDiptych'));
const SignatureCreations = dynamic(() => import('@/components/sections/SignatureCreations'));
const Occasions = dynamic(() => import('@/components/sections/Occasions'));
const EditorialBand = dynamic(() => import('@/components/sections/EditorialBand'));
const WornBy = dynamic(() => import('@/components/sections/WornBy'));
const Atelier = dynamic(() => import('@/components/sections/Atelier'));
const UpClose = dynamic(() => import('@/components/sections/UpClose'));
const HousePromise = dynamic(() => import('@/components/sections/HousePromise'));
const MadeForYou = dynamic(() => import('@/components/sections/MadeForYou'));
const InstagramFeed = dynamic(() => import('@/components/sections/InstagramFeed'));
const LocalGuide = dynamic(() => import('@/components/sections/LocalGuide'));
const VisitUs = dynamic(() => import('@/components/sections/VisitUs'));
const Footer = dynamic(() => import('@/components/sections/Footer'));

export const metadata: Metadata = {
  title: { absolute: 'Sakthi Chains | Gold, Diamond & Silver Jewellery Shop in Coimbatore' },
  description:
    'Sakthi Chains, a gold jewellery shop in Coimbatore: gold chains for men and women, earrings, bangles and bridal sets, plus diamond and silver. Book a visit.',
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <div className="landing-bg min-h-screen">
      <OpeningCurtain />
      <Navigation />
      <StaticBrandHero />
      <BrandStatement />
      <ShopByType />
      <TodaysRates />
      <DiscoverByCategory />
      <ShopByPrice />
      <CampaignDiptych />
      <SignatureCreations />
      <Occasions />
      <EditorialBand />
      <WornBy />
      <Atelier />
      <UpClose />
      <HousePromise />
      <MadeForYou />
      <InstagramFeed />
      <LocalGuide />
      <VisitUs showroom={homeSlot('visitShowroom')} />
      <Footer />
    </div>
  );
}
