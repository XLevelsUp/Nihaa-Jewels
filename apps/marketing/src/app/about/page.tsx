import type { Metadata } from "next";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import AboutClient from "./AboutClient";
import { Box } from "@mui/material";

export const metadata: Metadata = {
  title: "Our Story — A Legacy of Craftsmanship | Nihaa Jewels",
  description: "Discover the heritage of Nihaa Jewels. Four generations of master goldsmiths in Coimbatore, dedicated to ethical sourcing and timeless bridal jewellery designs.",
  openGraph: {
    title: "About Nihaa Jewels — Coimbatore's Heritage Goldsmiths",
    description: "Learn about our 40-year legacy in gold and diamond jewellery craftsmanship.",
    url: 'https://nihaajewels.com/about',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navigation />
      <AboutClient />
      <Footer />
    </Box>
  );
}
