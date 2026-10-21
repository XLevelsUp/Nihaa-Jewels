import type { Metadata } from "next";
import { Playfair_Display, Inter, Montserrat, Cinzel, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import ThemeRegistry from "@/components/ThemeRegistry";
import { STORE } from "@/constants/store";
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
  metadataBase: new URL('https://nihaajewels.com'),
  title: {
    template: `%s | ${STORE.name}`,
    default: `${STORE.name} | Fine Gold Jewellery, Made by Hand`,
  },
  description:
    "Sakthi Chains is a house of fine gold jewellery: necklaces, bangles, earrings, chains and bridal sets, BIS hallmarked and finished by hand.",
  keywords: [
    "Sakthi Chains",
    "gold jewellery",
    "gold jewellery shop near me",
    "22 karat gold",
    "gold chains",
    "BIS Hallmarked gold",
    "bridal gold jewellery",
    "bespoke gold jewellery",
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${STORE.name} | Fine Gold Jewellery, Made by Hand`,
    description:
      "Fine 22 karat gold, hallmarked and finished by hand. Explore the catalogue and book a private appointment.",
    type: "website",
    locale: "en_IN",
    siteName: STORE.name,
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
  "name": STORE.name,
  "telephone": STORE.phoneSchema,
  "priceRange": "$$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": `${STORE.complex}, ${STORE.street}, ${STORE.area}`,
    "addressLocality": STORE.city,
    "addressRegion": STORE.state,
    "postalCode": STORE.postcode,
    "addressCountry": STORE.country
  },
  "openingHours": STORE.openingHoursSchema
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
