import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import ThemeRegistry from "@/components/ThemeRegistry";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair-display", display: "swap" });

export const metadata: Metadata = {
  title: "Nihaa Jewels — Admin",
  description: "Internal admin panel for Nihaa Jewels. Not for public access.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
