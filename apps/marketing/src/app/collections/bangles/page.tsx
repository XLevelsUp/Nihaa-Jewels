import type { Metadata } from 'next';
import Script from 'next/script';
import BanglesClient from './BanglesClient';

export const metadata: Metadata = {
  title: "Gold Bangles Coimbatore | Bridal & Impon Bangles | Nihaa Jewels",
  description: "Buy gold bangles in Coimbatore. Discover stunning bridal bangles and traditional impon bangles, handcrafted to perfection at Nihaa Jewels.",
  keywords: ["gold bangles Coimbatore", "bridal bangles", "impon bangles", "buy gold bangles Coimbatore"],
  alternates: {
    canonical: "/collections/bangles",
  },
};

export default function BanglesPage() {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Nihaa Jewels Signature Bangles",
    "image": "https://nihaajewels.com/images/bangles1.webp",
    "description": "Buy gold bangles in Coimbatore. Discover stunning bridal bangles and traditional impon bangles, handcrafted to perfection at Nihaa Jewels.",
    "brand": {
      "@type": "Brand",
      "name": "Nihaa Jewels"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": "40000",
      "highPrice": "450000",
      "offerCount": "16"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "22"
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
        "name": "Bangles",
        "item": "https://nihaajewels.com/collections/bangles"
      }
    ]
  };

  return (
    <>
      <Script
        id="bangles-product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Script
        id="bangles-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BanglesClient />
    </>
  );
}
