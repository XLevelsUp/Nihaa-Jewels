import type { Metadata } from "next";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
