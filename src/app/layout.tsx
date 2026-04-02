import type { Metadata } from "next";
import { Playfair_Display, Inter, Montserrat } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Nihaa Jewels — Timeless Luxury Fine Jewellery",
  description:
    "Discover handcrafted fine jewellery at Nihaa Jewels. Rings, necklaces, watches, and bridal collections that embody timeless elegance and silent luxury.",
  keywords: [
    "fine jewellery",
    "luxury jewels",
    "gold rings",
    "diamond necklaces",
    "bridal jewellery",
    "Nihaa Jewels",
  ],
  openGraph: {
    title: "Nihaa Jewels — Timeless Luxury Fine Jewellery",
    description:
      "Handcrafted fine jewellery embodying timeless elegance. Explore our curated collections.",
    type: "website",
  },
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
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
