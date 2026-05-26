import type { Metadata } from 'next';
import Script from 'next/script';
import Navigation from '@/components/sections/Navigation';
import StaticBrandHero from '@/components/sections/StaticBrandHero';
import PromotionalHero from '@/components/sections/PromotionalHero';
import dynamic from 'next/dynamic';

const NewLaunch = dynamic(() => import('@/components/sections/NewLaunch'));
const CategoryDiscoveryGrid = dynamic(() => import('@/components/sections/CategoryDiscoveryGrid'));
const ShopByGender = dynamic(() => import('@/components/sections/ShopByGender'));
const NihaaAssurance = dynamic(() => import('@/components/sections/NihaaAssurance'));
const Testimonials = dynamic(() => import('@/components/sections/Testimonials'));
const Footer = dynamic(() => import('@/components/sections/Footer'));

export const metadata: Metadata = {
  title: "Nihaa Jewels | Gold & Diamond Jewellery Shop in Coimbatore",
  description: "Shop BIS hallmarked gold, IGI-certified diamond & bridal jewellery at Nihaa Jewels, Coimbatore. Four generations of master goldsmiths. Visit us in RS Puram.",
  keywords: [
    "jewellery shop Coimbatore", "luxury gold jewellery", "bespoke goldsmiths",
    "best jewellery shop near me", "gold jewellery shop near me", "Nihaa Jewels",
    "fine jewellery", "luxury jewels", "gold rings", "diamond necklaces",
    "bridal jewellery Coimbatore", "impon jewellery Coimbatore", "BIS Hallmarked gold",
    "IGI certified diamonds", "bespoke jewellery design", "diamond jewellery Coimbatore",
    "lightweight gold jewellery daily wear", "gold gifting Coimbatore",
    "lab grown diamond jewellery Coimbatore", "gold rings Coimbatore",
    "buy gold bangles Coimbatore"
  ],
};

export default function Home() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "name": "Nihaa Jewels",
    "image": [
      "https://nihaajewels.com/images/bridaljewel.webp",
      "https://nihaajewels.com/images/rings.webp",
      "https://nihaajewels.com/images/earring2.webp"
    ],
    "@id": "https://nihaajewels.com/#store",
    "url": "https://nihaajewels.com",
    "telephone": "+914222542026",
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "42, DB Road, RS Puram",
      "addressLocality": "Coimbatore",
      "addressRegion": "Tamil Nadu",
      "postalCode": "641002",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 11.0116,
      "longitude": 76.9490
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "10:00",
        "closes": "20:30"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "5"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Priya"
        },
        "datePublished": "2026-05-15",
        "reviewBody": "I found Nihaa Jewels when searching for the best bridal jewellery Coimbatore has to offer. Their BIS Hallmarked gold collection is absolutely stunning! It is truly the best jewellery shop near me, with gorgeous designs and incredible craftsmanship. My wedding gold set was perfect!",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Rajesh"
        },
        "datePublished": "2026-05-18",
        "reviewBody": "Visited the RS Puram showroom in Coimbatore for some gold gifting. The experience was wonderful, and I found the perfect gift. The craftsmanship and collection of luxury jewels are exceptional. Full satisfaction!",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Ananya"
        },
        "datePublished": "2026-05-20",
        "reviewBody": "I was looking for lightweight gold jewellery daily wear and was amazed by their collection. I also appreciated their traditional impon jewellery Coimbatore sets. The BIS Hallmarked gold gives total peace of mind regarding quality and purity.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Vikram"
        },
        "datePublished": "2026-05-22",
        "reviewBody": "Wanted a bespoke jewellery design for my mother and Nihaa Jewels delivered beautifully. They crafted a custom gold ring with IGI certified diamonds. Real luxury jewels made with extreme care. The best bespoke goldsmiths in Coimbatore!",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Divya"
        },
        "datePublished": "2026-05-24",
        "reviewBody": "Bought IGI certified diamond jewellery and gold rings in Coimbatore from Nihaa Jewels. The staff was incredibly warm and knowledgeable, guiding me through the certified diamonds and hallmarking process. High-quality diamond jewellery Coimbatore loves!",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5",
          "worstRating": "1"
        }
      }
    ]
  };

  return (
    <main className="bg-[#121212] min-h-screen">
      <Script
        id="home-localbusiness-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Navigation />
      <StaticBrandHero />
      <PromotionalHero />
      <NewLaunch />
      <CategoryDiscoveryGrid />
      <ShopByGender />
      <NihaaAssurance />
      <Testimonials />
      <Footer />
    </main>
  );
}
