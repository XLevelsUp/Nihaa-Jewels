import type { Metadata } from 'next';
import Script from 'next/script';
import RingsClient from './RingsClient';

export const metadata: Metadata = {
  title: "Gold & Diamond Rings Coimbatore | Nihaa Jewels",
  description: "Discover exquisite gold rings in Coimbatore, stunning diamond rings, and engagement rings. Handcrafted with BIS hallmarked gold & IGI certified diamonds.",
  keywords: ["gold rings Coimbatore", "diamond rings Coimbatore", "engagement ring"],
  alternates: {
    canonical: "/collections/rings",
  },
};

export default function RingsPage() {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Nihaa Jewels Signature Rings",
    "image": "https://nihaajewels.com/images/rings.webp",
    "description": "Explore our stunning collection of gold rings in Coimbatore, elegant diamond rings, and engagement rings. Handcrafted with BIS hallmarked gold & IGI certified diamonds.",
    "brand": {
      "@type": "Brand",
      "name": "Nihaa Jewels"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": "15000",
      "highPrice": "250000",
      "offerCount": "18"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "24"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://nihaajewels.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Collections",
        "item": "https://nihaajewels.com/collections"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Rings",
        "item": "https://nihaajewels.com/collections/rings"
      }
    ]
  };

  return (
    <>
      <Script
        id="rings-product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Script
        id="rings-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <RingsClient />
    </>
  );
}
