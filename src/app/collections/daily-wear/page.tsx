import type { Metadata } from 'next';
import Script from 'next/script';
import DailyWearClient from './DailyWearClient';

export const metadata: Metadata = {
  title: "Lightweight Gold Jewellery Daily Wear | Everyday Gold | Nihaa Jewels",
  description: "Explore lightweight gold jewellery daily wear in Coimbatore. Elevate your everyday style with office wear gold, handcrafted by Nihaa Jewels.",
  keywords: ["lightweight gold jewellery", "everyday gold", "office wear gold", "Lightweight gold jewellery daily wear"],
  alternates: {
    canonical: "/collections/daily-wear",
  },
};

export default function DailyWearPage() {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Nihaa Jewels Daily Wear Collection",
    "image": "https://nihaajewels.com/images/dailywear_image.webp",
    "description": "Explore lightweight gold jewellery daily wear in Coimbatore. Elevate your everyday style with office wear gold, handcrafted by Nihaa Jewels.",
    "brand": {
      "@type": "Brand",
      "name": "Nihaa Jewels"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": "8000",
      "highPrice": "95000",
      "offerCount": "28"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "41"
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
        "name": "Daily Wear",
        "item": "https://nihaajewels.com/collections/daily-wear"
      }
    ]
  };

  return (
    <>
      <Script
        id="daily-wear-product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Script
        id="daily-wear-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <DailyWearClient />
    </>
  );
}
