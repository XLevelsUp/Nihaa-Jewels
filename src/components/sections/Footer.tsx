'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { Phone, Mail, MapPin, Heart, MessageCircle } from "lucide-react";

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const YoutubeIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
);

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

function checkStoreOpen(): boolean {
  const d = new Date();
  const istTime = new Date(d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const day = istTime.getDay();   // 0=Sun, 1=Mon … 6=Sat
  const hour = istTime.getHours();
  return day >= 1 && day <= 6 && hour >= 10 && hour < 20;
}

export default function Footer() {
  // FIX 1: year and isOpen are both null/undefined until after hydration.
  // Render a neutral placeholder on the server; populate on the client only.
  const [year, setYear] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  useEffect(() => {
    // Both of these only run on the client, so server HTML will never mismatch.
    setYear(new Date().getFullYear());
    setIsOpen(checkStoreOpen());

    const interval = setInterval(() => {
      setIsOpen(checkStoreOpen());
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#050505",
        color: "#fff",
        pt: { xs: 8, md: 10 },
        pb: 6,
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(212,175,55,0.15)"
      }}
    >
      {/* Top gold glow line */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "800px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.8), transparent)",
          boxShadow: "0px 0px 30px 3px rgba(212, 175, 55, 0.4)"
        }}
      />

      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <Grid2 container spacing={{ xs: 6, md: 4 }}>

            {/* ── Brand ── */}
            <Grid2 size={{ xs: 12, md: 4 }}>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h4"
                  component={motion.h4}
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 6, ease: "linear", repeat: Infinity }}
                  sx={{
                    fontFamily: "var(--font-playfair-display)",
                    fontWeight: 700,
                    mb: 1,
                    letterSpacing: "0.05em",
                    background: "linear-gradient(90deg, #D4AF37, #FBF5B7, #D4AF37)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: "inline-block",
                    textShadow: "0 2px 15px rgba(212,175,55,0.2)"
                  }}
                >
                  Nihaa Jewels
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "var(--font-playfair-display)",
                    color: "rgba(212,175,55,0.8)",
                    fontStyle: "italic",
                    mb: 1.5,
                    fontSize: "1rem"
                  }}
                >
                  Timeless Elegance. Trusted Craftsmanship.
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    mb: 4,
                    lineHeight: 1.8,
                    pr: { md: 4 },
                    fontFamily: "var(--font-inter)",
                    fontWeight: 300,
                    textAlign: "justify",
                    letterSpacing: "0.02em",
                    wordSpacing: "0.05em"
                  }}
                >
                  Nihaa Jewels, established in 2026, specializes in premium gold jewellery
                  crafted with elegance and trust.
                </Typography>

                {/* Social icons */}
                <Box
                  component={motion.div}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } }
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  sx={{ display: "flex", gap: 2 }}
                >
                  {[
                    { icon: <InstagramIcon />, label: "Instagram", href: "https://instagram.com/nihaajewels" },
                    { icon: <FacebookIcon />, label: "Facebook", href: "https://facebook.com/nihaajewels" },
                    { icon: <YoutubeIcon />, label: "YouTube", href: "https://youtube.com/@nihaajewels" },
                    { icon: <MessageCircle size={18} strokeWidth={1.5} />, label: "WhatsApp", href: "https://wa.me/919047722299" },
                  ].map((social, idx) => (
                    <motion.div
                      key={idx}
                      variants={{
                        hidden: { opacity: 0, y: 20, scale: 0.8 },
                        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.4 } }
                      }}
                    >
                      <Box
                        component={motion.a}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        whileHover={{
                          y: -5,
                          scale: 1.1,
                          borderColor: "#D4AF37",
                          color: "#111",
                          backgroundColor: "#D4AF37",
                          boxShadow: "0 4px 15px rgba(212,175,55,0.4)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          border: "1px solid rgba(255,255,255,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "rgba(255,255,255,0.7)",
                          cursor: "pointer",
                          transition: "color 0.3s ease, border-color 0.3s ease"
                        }}
                      >
                        {social.icon}
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid2>

            {/* ── Information links ── */}
            <Grid2 size={{ xs: 6, md: 2 }}>
              <motion.div variants={itemVariants}>
                <Typography
                  component={motion.h6}
                  whileHover={{ x: 3 }}
                  sx={{
                    mb: 4,
                    color: "#D4AF37",
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.85rem",
                    textTransform: "uppercase"
                  }}
                >
                  Information
                </Typography>

                <Box
                  component={motion.div}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
                >
                  {["Collections", "About Nihaa", "FAQs", "Help & Support"].map((item) => (
                    <motion.div
                      key={item}
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 200 } }
                      }}
                    >
                      <Box
                        component={Link}
                        href="#"
                        sx={{
                          color: "rgba(255,255,255,0.7)",
                          textDecoration: "none",
                          fontFamily: "var(--font-inter)",
                          fontSize: "0.95rem",
                          fontWeight: 300,
                          transition: "color 0.3s ease",
                          position: "relative",
                          width: "fit-content",
                          "&:hover": { color: "#D4AF37" },
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            width: "0%",
                            height: "1px",
                            bottom: -4,
                            left: 0,
                            backgroundColor: "#D4AF37",
                            transition: "width 0.3s ease"
                          },
                          "&:hover::after": { width: "100%" }
                        }}
                      >
                        {item}
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid2>

            {/* ── Store info ── */}
            <Grid2 size={{ xs: 6, md: 3 }}>
              <motion.div variants={itemVariants}>
                <Typography
                  component={motion.h6}
                  whileHover={{ x: 3 }}
                  sx={{
                    mb: 4,
                    color: "#D4AF37",
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.85rem",
                    textTransform: "uppercase"
                  }}
                >
                  Visit Our Store
                </Typography>

                <Box
                  component={motion.div}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } }
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
                >
                  {/* Address */}
                  <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", color: "rgba(255,255,255,0.6)" }}>
                      <Box sx={{ mt: 0.5, width: 32, height: 32, borderRadius: "50%", bgcolor: "rgba(212,175,55,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <MapPin size={16} strokeWidth={1.5} color="#D4AF37" />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontFamily: "var(--font-inter)", fontWeight: 300, lineHeight: 1.8, fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>
                          <Box component="span" sx={{ color: "#D4AF37", display: "block", mb: 0.5, fontWeight: 500, fontFamily: "var(--font-inter)", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Nihaa Jewels
                          </Box>
                          MAHALAKSMI COMPLEX,<br />
                          23 D CHOKKAMPUDUR ROAD,<br />
                          KRISHNA NAGAR, COIMBATORE-641001<br />
                          RS Puram, Tamil Nadu
                        </Typography>
                        <Box
                          component="a"
                          href="https://maps.google.com/?q=NIHAA+JEWELS+MAHALAKSMI+COMPLEX+23+D+CHOKKAMPUDUR+ROAD+KRISHNA+NAGAR+COIMBATORE"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            color: "#D4AF37",
                            fontFamily: "var(--font-inter)",
                            fontSize: "0.8rem",
                            mt: 1,
                            textDecoration: "none",
                            fontWeight: 500,
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              width: "100%",
                              height: "1px",
                              bottom: -2,
                              left: 0,
                              backgroundColor: "#D4AF37",
                              transform: "scaleX(1)",
                              transition: "transform 0.3s ease",
                              transformOrigin: "left"
                            },
                            "&:hover::after": { transform: "scaleX(0)" }
                          }}
                        >
                          Open in Google Maps ↗
                        </Box>
                      </Box>
                    </Box>
                  </motion.div>

                  {/* Phone */}
                  <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
                    <Box
                      component="a"
                      href="tel:+919047722299"
                      sx={{ display: "flex", gap: 2, alignItems: "center", color: "rgba(255,255,255,0.6)", textDecoration: "none", transition: "color 0.3s", "&:hover": { color: "#D4AF37" } }}
                    >
                      <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "rgba(212,175,55,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Phone size={16} strokeWidth={1.5} color="#D4AF37" />
                      </Box>
                      <Typography variant="body2" sx={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "0.95rem", color: "inherit", letterSpacing: "0.05em" }}>
                        +91 9047722299
                      </Typography>
                    </Box>
                  </motion.div>

                  {/* Email */}
                  <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
                    <Box
                      component="a"
                      href="mailto:support@nihaajewels.com"
                      sx={{ display: "flex", gap: 2, alignItems: "center", color: "rgba(255,255,255,0.6)", textDecoration: "none", transition: "color 0.3s", "&:hover": { color: "#D4AF37" } }}
                    >
                      <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "rgba(212,175,55,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Mail size={16} strokeWidth={1.5} color="#D4AF37" />
                      </Box>
                      <Typography variant="body2" sx={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "0.95rem", color: "inherit" }}>
                        support@nihaajewels.com
                      </Typography>
                    </Box>
                  </motion.div>

                  {/* Open/Closed indicator — only rendered after client hydration */}
                  <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center", color: "rgba(255,255,255,0.6)" }}>
                      <Box sx={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {/* FIX 2: only animate/show the dot once isOpen is known (client-side) */}
                        {isOpen !== null && (
                          <motion.div
                            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: isOpen ? "#4ade80" : "#ff4d4f",
                              boxShadow: isOpen ? "0 0 12px #4ade80" : "0 0 12px #ff4d4f"
                            }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>
                        Mon – Sat &bull; 10:00 AM – 8:00 PM
                      </Typography>
                    </Box>
                  </motion.div>
                </Box>
              </motion.div>
            </Grid2>

            {/* ── Newsletter ── */}
            <Grid2 size={{ xs: 12, md: 3 }}>
              <motion.div variants={itemVariants}>
                <Typography
                  component={motion.h6}
                  whileHover={{ x: 3 }}
                  sx={{
                    mb: 4,
                    color: "#D4AF37",
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.85rem",
                    textTransform: "uppercase"
                  }}
                >
                  Newsletter
                </Typography>

                <Box
                  component={motion.div}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.4 } }
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 3,
                        color: "rgba(255,255,255,0.7)",
                        fontFamily: "var(--font-inter)",
                        fontWeight: 300,
                        lineHeight: 1.6,
                        fontSize: "0.9rem",
                        letterSpacing: "0.02em"
                      }}
                    >
                      Join our exclusive list for early access to new collections, bespoke offers, and jewelry care tips.
                    </Typography>
                  </motion.div>

                  <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
                    <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
                      <TextField
                        variant="standard"
                        placeholder="Email Address"
                        fullWidth
                        sx={{
                          input: {
                            color: "#fff",
                            fontFamily: "var(--font-inter)",
                            px: 1,
                            py: 1.5,
                            "&:-webkit-autofill": {
                              WebkitBoxShadow: "0 0 0 100px #050505 inset",
                              WebkitTextFillColor: "#fff"
                            }
                          },
                          "& .MuiInput-underline:before": { borderBottomColor: "rgba(255,255,255,0.2)" },
                          "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottomColor: "rgba(212,175,55,0.5)" },
                          "& .MuiInput-underline:after": { borderBottomColor: "#D4AF37" }
                        }}
                      />
                      <Button
                        component={motion.button}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        fullWidth
                        sx={{
                          bgcolor: "#D4AF37",
                          color: "#050505",
                          mt: 0.5,
                          py: 1.5,
                          fontWeight: 600,
                          fontFamily: "var(--font-montserrat)",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          fontSize: "0.8rem",
                          borderRadius: 1,
                          transition: "background-color 0.3s ease, box-shadow 0.3s ease",
                          "&:hover": { bgcolor: "#E5C158", boxShadow: "0px 4px 15px rgba(212,175,55,0.3)" }
                        }}
                      >
                        Subscribe
                      </Button>
                    </Box>
                  </motion.div>
                </Box>
              </motion.div>
            </Grid2>
          </Grid2>

          {/* ── Bottom bar ── */}
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                mt: { xs: 8, md: 10 },
                pt: 4,
                position: "relative",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 3
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "1px",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)"
                }}
              />

              {/* FIX 4: render year only after hydration to avoid year-boundary mismatch */}
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.85rem",
                  textAlign: { xs: "center", md: "left" }
                }}
              >
                {year !== null ? `© ${year} Nihaa Jewels. All rights reserved.` : "© Nihaa Jewels. All rights reserved."}
              </Typography>

              <Box sx={{ display: "flex", gap: { xs: 3, md: 5 }, flexWrap: "wrap", justifyContent: "center" }}>
                {[
                  { name: "Privacy Policy", path: "/privacy-policy" },
                  { name: "Terms & Conditions", path: "/terms-and-conditions" },
                  { name: "Description", path: "/description" }
                ].map((policy) => (
                  <Box
                    key={policy.name}
                    component={Link}
                    href={policy.path}
                    sx={{
                      color: "rgba(255,255,255,0.5)",
                      textDecoration: "none",
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.85rem",
                      transition: "all 0.3s ease",
                      "&:hover": { color: "#D4AF37", transform: "translateY(-1px)" }
                    }}
                  >
                    {policy.name}
                  </Box>
                ))}
              </Box>

              {/* Built with */}
              <Box
                sx={{
                  p: 1.5,
                  px: 2.5,
                  borderRadius: "30px",
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderColor: "rgba(255,255,255,0.1)",
                    transform: "translateY(-2px)"
                  }
                }}
              >
                <Typography
                  component="div"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "rgba(255,255,255,0.6)",
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.8rem",
                    letterSpacing: "0.05em"
                  }}
                >
                  Built with
                  <motion.div
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ display: "flex", marginTop: 1 }}
                  >
                    <Heart size={14} color="#ff4d4f" fill="#ff4d4f" />
                  </motion.div>
                  by{" "}
                  <Box
                    component={Link}
                    href="https://xlevelsup.com"
                    sx={{
                      color: "#fff",
                      textDecoration: "none",
                      fontWeight: 600,
                      transition: "color 0.3s",
                      "&:hover": { color: "#D4AF37" }
                    }}
                  >
                    XLevelsUp
                  </Box>
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}