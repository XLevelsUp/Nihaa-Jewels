import type { Metadata } from "next";
import { Playfair_Display, Inter, Montserrat } from "next/font/google";
import Script from "next/script";
import ThemeRegistry from "@/components/ThemeRegistry";
import "./globals.css";

/* ── Font loading ─────────────────────────────────────── */
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

/* ── Global SEO metadata ──────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL('https://nihaajewels.com'),
  title: {
    template: "%s | Nihaa Jewels",
    default: "Nihaa Jewels — Best Luxury Jewellery Shop in Coimbatore",
  },
  description:
    "Nihaa Jewels offers handcrafted gold, diamond, and bridal jewellery in Coimbatore. Four generations of master goldsmiths creating timeless heirlooms with BIS hallmarking and conflict-free diamonds.",
  keywords: [
    "best jewellery shop near me",
    "gold jewellery shop near me",
    "jewellery shop in Coimbatore",
    "Nihaa Jewels",
    "fine jewellery",
    "luxury jewels",
    "gold rings",
    "diamond necklaces",
    "bridal jewellery Coimbatore",
    "impon jewellery Coimbatore",
    "BIS Hallmarked gold",
    "IGI certified diamonds",
    "bespoke jewellery design",
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Nihaa Jewels — Fine Luxury Jewellery & Bespoke Goldsmiths",
    description:
      "Legacy of four generations in gold craftsmanship. Discover bridal collections, diamond jewellery, and bespoke designs in Coimbatore.",
    type: "website",
    locale: "en_IN",
    siteName: "Nihaa Jewels",
    url: 'https://nihaajewels.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  "name": "Nihaa Jewels",
  "image": "https://nihaajewels.com/og-image.jpg",
  "@id": "https://nihaajewels.com",
  "url": "https://nihaajewels.com",
  "telephone": "+914222800000",
  "priceRange": "$$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "42, Jewellers Street, RS Puram",
    "addressLocality": "Coimbatore",
    "addressRegion": "TN",
    "postalCode": "641002",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 11.0116,
    "longitude": 76.9490
  },
  "openingHoursSpecification": {
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
    "closes": "20:00"
  },
  "sameAs": [
    "https://instagram.com/nihaajewels",
    "https://pinterest.com/nihaajewels"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable} ${montserrat.variable}`}
    >
      <body className="min-h-screen antialiased">
        <ThemeRegistry>
          <Script
            id="structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <a href="#main-content" id="skip-to-content">
            Skip to main content
          </a>
          <main id="main-content">
            {children}
          </main>
        </ThemeRegistry>
      </body>
    </html>
  );
}
