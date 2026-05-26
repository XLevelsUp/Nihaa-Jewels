import type { Metadata } from 'next';
import Script from 'next/script';
import NecklacesClient from './NecklacesClient';

export const metadata: Metadata = {
  title: "Gold & Diamond Necklaces Coimbatore | Nihaa Jewels",
  description: "Explore our collection of exquisite gold necklaces and premium diamond necklaces in Coimbatore. Handcrafted masterpieces with BIS hallmarked gold & certified diamonds.",
  keywords: ["gold necklaces Coimbatore", "diamond necklaces Coimbatore", "luxury gold jewellery", "diamond necklaces"],
  alternates: {
    canonical: "/collections/necklaces",
  },
};

export default function NecklacesPage() {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Nihaa Jewels Sculpted Necklaces",
    "image": "https://nihaajewels.com/images/necklace1.webp",
    "description": "Explore our collection of exquisite gold necklaces and premium diamond necklaces in Coimbatore. Handcrafted masterpieces with BIS hallmarked gold & certified diamonds.",
    "brand": {
      "@type": "Brand",
      "name": "Nihaa Jewels"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": "45000",
      "highPrice": "650000",
      "offerCount": "15"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "21"
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
        "name": "Necklaces",
        "item": "https://nihaajewels.com/collections/necklaces"
      }
    ]
  };

  return (
    <>
      <Script
        id="necklaces-product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Script
        id="necklaces-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <NecklacesClient />
    </>
  );
}
