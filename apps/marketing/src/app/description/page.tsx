import { Metadata } from "next";
import { Box, Container, Typography } from "@mui/material";

export const metadata: Metadata = {
  title: "Brand Description & Our Story | Nihaa Jewels",
  description: "Discover the heritage, artistry, and vision behind Nihaa Jewels. Learn about our commitment to crafting premium gold jewelry, bespoke bridal collections, and timeless elegance.",
  keywords: "Nihaa Jewels story, premium gold jewelry, bespoke bridal jewelry, Coimbatore jewelers, luxury gold designs",
  alternates: {
    canonical: "/description"
  }
};

export default function DescriptionPage() {
  return (
    <Box sx={{ bgcolor: "#050505", color: "#fff", minHeight: "100vh", pt: 16, pb: 12 }}>
      <Container maxWidth="md">
        <Typography 
          variant="h2" 
          component="h1"
          sx={{ 
            fontFamily: "var(--font-playfair-display)", 
            color: "#D4AF37", 
            mb: 3, 
            textAlign: "center",
            fontWeight: 600,
            fontSize: { xs: "2.5rem", md: "3.5rem" }
          }}
        >
          Our Story
        </Typography>
        
        <Typography 
          variant="h5" 
          component="h2"
          sx={{ 
            fontFamily: "var(--font-playfair-display)", 
            color: "rgba(212,175,55,0.8)", 
            fontStyle: "italic",
            mb: 8, 
            textAlign: "center",
            fontWeight: 400
          }}
        >
          Timeless Elegance. Trusted Craftsmanship.
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Box>
            <Typography variant="h4" sx={{ fontFamily: "var(--font-playfair-display)", color: "#D4AF37", mb: 2, fontSize: "1.8rem" }}>
              The Legacy of Nihaa Jewels
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.8)", lineHeight: 1.9, textAlign: "justify", fontSize: "1.05rem" }}>
              Established in 2026 and nestled in the heart of RS Puram, Coimbatore, Nihaa Jewels was born out of a profound passion for preserving traditional Indian artisanship while embracing contemporary design aesthetics. We recognized a deep-rooted desire among modern clientele for jewelry that isn&apos;t just an accessory, but a timeless heirloom—crafted to tell a story across generations. 
            </Typography>
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontFamily: "var(--font-playfair-display)", color: "#D4AF37", mb: 2, fontSize: "1.8rem" }}>
              Mastery in Premium Gold
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.8)", lineHeight: 1.9, textAlign: "justify", fontSize: "1.05rem" }}>
              Our foundation is built upon an unwavering commitment to purity and excellence. We specialize in working with the highest quality of gold, ensuring every piece meets rigorous international certification standards. From intricate filigree work that requires hundreds of hours of manual labor to sleek, minimalist daily wear, our master artisans pour their decades of experience into every curve and contour.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontFamily: "var(--font-playfair-display)", color: "#D4AF37", mb: 2, fontSize: "1.8rem" }}>
              The Bridal Edit
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.8)", lineHeight: 1.9, textAlign: "justify", fontSize: "1.05rem" }}>
              We understand that bridal jewelry is the most significant investment a family makes—a symbol of prosperity, love, and cultural heritage. Our Bespoke Bridal Selection offers an intimate, personalized consultation process. We work closely with brides and families to conceptualize and forge unique sets that perfectly complement their grandest celebrations, utilizing traditional motifs fused with regal styling.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontFamily: "var(--font-playfair-display)", color: "#D4AF37", mb: 2, fontSize: "1.8rem" }}>
              Our Vision for the Future
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.8)", lineHeight: 1.9, textAlign: "justify", fontSize: "1.05rem" }}>
              As Nihaa Jewels moves forward globally, our vision remains resolute: to be the premier destination for discerning individuals who seek luxury without compromise. We invite you to visit our boutique in Coimbatore to tangibly experience the weight, luster, and unparalleled beauty of true craftsmanship. 
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
