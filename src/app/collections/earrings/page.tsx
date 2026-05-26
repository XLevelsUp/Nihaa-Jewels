import type { Metadata } from 'next';
import Script from 'next/script';
import EarringsClient from './EarringsClient';

export const metadata: Metadata = {
  title: "Gold & Diamond Earrings Coimbatore | Jhumkas | Nihaa Jewels",
  description: "Browse our collection of gold earrings in Coimbatore, exquisite jhumkas, and premium diamond earrings. All pieces are BIS hallmarked or IGI certified.",
  keywords: ["gold earrings Coimbatore", "jhumkas Coimbatore", "diamond earrings"],
  alternates: {
    canonical: "/collections/earrings",
  },
};

export default function EarringsPage() {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Nihaa Jewels Sculpted Earrings",
    "image": "https://nihaajewels.com/images/earring2.webp",
    "description": "Browse our collection of gold earrings in Coimbatore, exquisite jhumkas, and premium diamond earrings. All pieces are BIS hallmarked or IGI certified.",
    "brand": {
      "@type": "Brand",
      "name": "Nihaa Jewels"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": "12000",
      "highPrice": "180000",
      "offerCount": "22"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "19"
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
        "name": "Earrings",
        "item": "https://nihaajewels.com/collections/earrings"
      }
    ]
  };

  return (
    <>
      <Script
        id="earrings-product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Script
        id="earrings-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <EarringsClient />
    </>
  );
}
