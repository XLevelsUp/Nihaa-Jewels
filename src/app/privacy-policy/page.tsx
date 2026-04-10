import { Metadata } from "next";
import { Box, Container, Typography } from "@mui/material";

export const metadata: Metadata = {
  title: "Privacy Policy | Nihaa Jewels",
  description: "Read the Privacy Policy of Nihaa Jewels. Learn how we handle, protect, and respect your personal information when you shop our premium gold and bridal jewelry collections.",
  keywords: "privacy policy, data protection, secure jewelry shopping, Nihaa Jewels privacy",
  alternates: {
    canonical: "/privacy-policy"
  }
};

export default function PrivacyPolicy() {
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
          Privacy Policy
        </Typography>

        <Typography variant="body1" sx={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.7)", mb: 6, textAlign: "center" }}>
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <Box>
            <Typography variant="h5" sx={{ fontFamily: "var(--font-playfair-display)", color: "#D4AF37", mb: 2 }}>
              1. Information We Collect
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, textAlign: "justify" }}>
              At Nihaa Jewels, we respect the privacy of our valued clientele. When you interact with our website, visit our boutique at RS Puram, Coimbatore, or place an order, we may collect personal details such as your name, email address, physical address, and contact number. This information helps us fulfill your bespoke jewelry requirements and ensure a seamless luxury shopping experience.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontFamily: "var(--font-playfair-display)", color: "#D4AF37", mb: 2 }}>
              2. How We Use Your Data
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, textAlign: "justify" }}>
              Your personal information is strictly used to process your transactions, manage delivery, and verify the authenticity and certification of your gold purchases. With your explicit consent, we may occasionally inform you about our latest Bridal Edits, bespoke collections, and exclusive private viewings.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontFamily: "var(--font-playfair-display)", color: "#D4AF37", mb: 2 }}>
              3. Data Protection and Security
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, textAlign: "justify" }}>
              We employ the highest level of industry-standard security protocols to encrypt and protect your sensitive data. The secure transmission of your information is guaranteed. Under no circumstances do we sell or lease your personal information to third parties. Every transaction is highly confidential, matching the trust you place in our craftsmanship.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontFamily: "var(--font-playfair-display)", color: "#D4AF37", mb: 2 }}>
              4. Cookies & Tracking Technology
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, textAlign: "justify" }}>
              Our platform utilizes cookies to enhance and personalize your digital browsing experience. These analytical tools allow us to understand client preferences and optimize our online showcase of premium jewelry. You may manage your cookie preferences through your personal browser settings at any time.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontFamily: "var(--font-playfair-display)", color: "#D4AF37", mb: 2 }}>
              5. Contact Us Regarding Your Privacy
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, textAlign: "justify" }}>
              If you have any questions, concerns, or requests regarding how your data is handled by Nihaa Jewels, please contact our support desk directly at <strong>support@nihaajewels.com</strong> or visit us at our Coimbatore boutique.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
