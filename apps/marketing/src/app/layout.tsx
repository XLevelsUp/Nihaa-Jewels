import type { Metadata } from "next";
import { Playfair_Display, Inter, Montserrat, Cinzel, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import ThemeRegistry from "@/components/ThemeRegistry";
import { SHOWROOMS, SITE_URL, STORE, socialLinksWithInstagram } from "@/constants/store";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
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

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

/* ── Global SEO metadata ──────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${STORE.name}`,
    default: `${STORE.name} | Gold, Diamond & Silver Jewellery Shop in Coimbatore`,
  },
  description:
    "BIS hallmarked gold, 925/999 silver and certified diamond jewellery at Town Hall, Coimbatore. Priced at today's rates; book a showroom visit.",
  openGraph: {
    title: `${STORE.name} | Gold, Diamond & Silver Jewellery in Coimbatore`,
    description:
      "BIS hallmarked gold, diamond and silver jewellery in Coimbatore. Explore the catalogue and book a visit to our showroom.",
    type: "website",
    locale: "en_IN",
    siteName: STORE.name,
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

// One JewelryStore per showroom, both tied to the brand, so each location can appear in Maps and "near me" results with its own address and hours.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#brand`,
      "name": STORE.name,
      "url": SITE_URL,
      "logo": `${SITE_URL}/images/brand/logo-amber.png`,
      "sameAs": socialLinksWithInstagram().map((l) => l.href),
    },
    ...SHOWROOMS.map((s) => ({
      "@type": "JewelryStore",
      "@id": `${SITE_URL}/stores#${s.id}`,
      "name": `${STORE.name}, ${s.name}`,
      "parentOrganization": { "@id": `${SITE_URL}/#brand` },
      "url": `${SITE_URL}/stores`,
      "image": `${SITE_URL}/images/home/visit-showroom.webp`,
      "description": `BIS hallmarked gold, 925/999 silver and certified diamond jewellery shop at ${s.name}, Coimbatore.`,
      "telephone": s.phoneSchema,
      "priceRange": "₹₹₹",
      "areaServed": { "@type": "City", "name": "Coimbatore" },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Jewellery Catalogue",
        "itemListElement": [
          { "@type": "OfferCatalog", "name": "Gold Jewellery", "url": `${SITE_URL}/gold-jewellery` },
          { "@type": "OfferCatalog", "name": "Silver Jewellery", "url": `${SITE_URL}/silver-jewellery` },
          { "@type": "OfferCatalog", "name": "Diamond Jewellery", "url": `${SITE_URL}/diamond-jewellery` },
        ],
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": `${s.street}, ${s.area}`,
        "addressLocality": STORE.city,
        "addressRegion": STORE.state,
        "postalCode": s.postcode,
        "addressCountry": STORE.country,
      },
      "openingHours": s.openingHoursSchema,
      "hasMap": s.mapsUrl,
    })),
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    // The head script below adds sc-curtain-seen to <html> before React hydrates; this tells React that one difference is expected (it covers <html>'s own attributes only).
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable} ${montserrat.variable} ${cinzel.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Repeat visits in the same session skip the homepage curtain before first paint. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem('sc-curtain-seen')==='1')document.documentElement.classList.add('sc-curtain-seen')}catch(e){}`,
          }}
        />
      </head>
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
          <WhatsAppFloat />
        </ThemeRegistry>
      </body>
    </html>
  );
}
