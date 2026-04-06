import type { Metadata } from "next";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import ContactClient from "./ContactClient";
import { Box } from "@mui/material";

export const metadata: Metadata = {
  title: "Visit Our Jewellery Showroom in Coimbatore | Nihaa Jewels",
  description: "Visit Nihaa Jewels in RS Puram or Saibaba Colony, Coimbatore. Book a bespoke consultation or explore our fine jewellery collections in person.",
  openGraph: {
    title: "Visit Nihaa Jewels — Gold Store in Coimbatore",
    description: "Find directions to our Coimbatore showrooms and book your visit.",
    url: 'https://nihaajewels.com/contact',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navigation />
      <ContactClient />
      <Footer />
    </Box>
  );
}
