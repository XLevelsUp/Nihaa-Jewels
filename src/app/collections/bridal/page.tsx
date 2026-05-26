import type { Metadata } from 'next';
import Script from 'next/script';
import BridalClient from './BridalClient';

export const metadata: Metadata = {
  title: "Bridal Jewellery Coimbatore | Wedding Gold Set & Bridal Necklace",
  description: "Explore bridal jewellery in Coimbatore at Nihaa Jewels. Find the perfect wedding gold set and bridal necklace, beautifully handcrafted by master goldsmiths.",
  keywords: ["bridal jewellery Coimbatore", "wedding gold set", "bridal necklace"],
  alternates: {
    canonical: "/collections/bridal",
  },
};

export default function BridalPage() {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Nihaa Jewels Bridal Collection",
    "image": "https://nihaajewels.com/images/bridaljewel.webp",
    "description": "Explore bridal jewellery in Coimbatore at Nihaa Jewels. Find the perfect wedding gold set and bridal necklace, beautifully handcrafted by master goldsmiths.",
    "brand": {
      "@type": "Brand",
      "name": "Nihaa Jewels"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": "150000",
      "highPrice": "1200000",
      "offerCount": "25"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "32"
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
        "name": "Bridal",
        "item": "https://nihaajewels.com/collections/bridal"
      }
    ]
  };

  return (
    <>
      <Script
        id="bridal-product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Script
        id="bridal-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BridalClient />
    </>
  );
}
