import { Metadata } from "next";
import { Box, Container, Typography } from "@mui/material";

export const metadata: Metadata = {
  title: "Terms & Conditions | Nihaa Jewels",
  description: "Read the comprehensive Terms and Conditions for Nihaa Jewels. Review our policies regarding bespoke jewelry purchases, pricing, certifications, and craft guarantee.",
  keywords: "terms and conditions, jewelry policy, Nihaa Jewels terms, purchase policy, Coimbatore jewelers",
  alternates: {
    canonical: "/terms-and-conditions"
  }
};

export default function TermsAndConditions() {
  return (
    <Box sx={{ bgcolor: "#050505", color: "#fff", minHeight: "100vh", pt: 16, pb: 8 }}>
      <Container maxWidth="md">
        <Typography 
          variant="h2" 
          component="h1"
          sx={{ 
            fontFamily: "var(--font-playfair-display)", 
            color: "#D4AF37", 
            mb: 4, 
            textAlign: "center",
            fontWeight: 600,
            fontSize: { xs: "2.5rem", md: "3.5rem" }
          }}
        >
          Terms & Conditions
        </Typography>

        <Typography variant="body1" sx={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.7)", mb: 6, textAlign: "center" }}>
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <Box>
            <Typography variant="h5" sx={{ fontFamily: "var(--font-playfair-display)", color: "#D4AF37", mb: 2 }}>
              1. General Agreement
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, textAlign: "justify" }}>
              By accessing the Nihaa Jewels website and placing an order, either digitally or within our Coimbatore boutique, you agree to comply with and be bound by the following terms and conditions. These terms govern the relationship between you, the client, and Nihaa Jewels.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontFamily: "var(--font-playfair-display)", color: "#D4AF37", mb: 2 }}>
              2. Products and Craftsmanship
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, textAlign: "justify" }}>
              Every piece of jewelry from Nihaa Jewels is meticulously handcrafted. Due to the unique nature of materials used, slight variations in weight, dimension, and gemstone characteristics may occur compared to photographic representations. We guarantee that all our products carry verified hallmark certifications confirming the purity of the gold.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontFamily: "var(--font-playfair-display)", color: "#D4AF37", mb: 2 }}>
              3. Pricing and Payments
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, textAlign: "justify" }}>
              Prices for luxury gold and bridal ornaments are subject to market fluctuations. The price finalized at the time of placing an order will be upheld. For bespoke and custom orders, an advance payment is required, and full settlement must be completed prior to final delivery or dispatch. All online transactions are processed securely.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontFamily: "var(--font-playfair-display)", color: "#D4AF37", mb: 2 }}>
              4. Bespoke and Custom Orders
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, textAlign: "justify" }}>
              Custom-crafted pieces, including bespoke bridal edits, are tailored exclusively for you. Therefore, these items fall outside our standard return policies unless there is a verifiable defect in manufacturing or material authenticity.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontFamily: "var(--font-playfair-display)", color: "#D4AF37", mb: 2 }}>
              5. Shipping and Liability
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, textAlign: "justify" }}>
              All shipped jewelry is highly insured until it reaches its intended destination. A signature verifying receipt is mandatory upon delivery. Nihaa Jewels is not liable for delayed deliveries caused by unforeseen logistical disruptions or incorrect address submissions.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
