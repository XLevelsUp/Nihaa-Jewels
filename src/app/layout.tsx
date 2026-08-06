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
  other: {
    'p:domain_verify': 'f03d3f2bb52681970ca5897915465c57',
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
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable} ${montserrat.variable}`}
    >
      <body className="min-h-screen antialiased">
        <ThemeRegistry>
          <script>
            {`
              if (typeof window !== 'undefined' && window.trustedTypes && window.trustedTypes.createPolicy) {
                try {
                  window.trustedTypes.createPolicy('default', {
                    createHTML: function(s) { return s; },
                    createScriptURL: function(s) { return s; },
                    createScript: function(s) { return s; }
                  });
                } catch (e) {
                  console.warn('Trusted Types default policy already exists.');
                }
              }
            `}
          </script>
          {gaId && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
              />
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());

                  gtag('config', '${gaId}');
                `}
              </Script>
            </>
          )}
          {/* Meta Pixel Code */}
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2661483640913484');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src="https://www.facebook.com/tr?id=2661483640913484&ev=PageView&noscript=1"
              alt=""
            />
          </noscript>
          {/* End Meta Pixel Code */}
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
