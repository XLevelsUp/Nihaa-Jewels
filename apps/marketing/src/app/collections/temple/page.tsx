import type { Metadata } from 'next';
import Script from 'next/script';
import TempleClient from './TempleClient';

export const metadata: Metadata = {
  title: "Sacred Temple Jewellery Coimbatore | Nihaa Jewels",
  description: "Discover our collection of sacred, heritage temple jewellery in Coimbatore. Exquisite handcrafted bridal pieces inspired by classic ancient art at Nihaa Jewels.",
  keywords: ["temple jewellery Coimbatore", "bridal jewellery Coimbatore", "traditional gold set", "antique jewellery"],
  alternates: {
    canonical: "/collections/temple",
  },
};

export default function TemplePage() {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Nihaa Jewels Sacred Temple Jewellery",
    "image": "https://nihaajewels.com/images/temple.webp",
    "description": "Discover our collection of sacred, heritage temple jewellery in Coimbatore. Exquisite handcrafted bridal pieces inspired by classic ancient art at Nihaa Jewels.",
    "brand": {
      "@type": "Brand",
      "name": "Nihaa Jewels"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": "75000",
      "highPrice": "950000",
      "offerCount": "12"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "14"
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
        "name": "Temple Jewellery",
        "item": "https://nihaajewels.com/collections/temple"
      }
    ]
  };

  return (
    <>
      <Script
        id="temple-product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Script
        id="temple-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <TempleClient />
    </>
  );
}
