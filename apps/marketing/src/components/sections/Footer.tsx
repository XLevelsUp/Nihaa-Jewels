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
import { STORE } from "@/constants/store";

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
        bgcolor: "var(--c-page)",
        color: "var(--c-text)",
        pt: { xs: 8, md: 10 },
        pb: 6,
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid color-mix(in srgb, var(--c-accent) 15%, transparent)"
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
          background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--c-accent) 80%, transparent), transparent)",
          boxShadow: "0px 0px 30px 3px color-mix(in srgb, var(--c-accent) 40%, transparent)"
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
               <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                <Box
                  component={motion.img}
                  src="/logo.svg"
                  alt="Nihaa Jewels Logo"
                  sx={{
                    height: "44px",
                    width: "auto",
                    mb: 1,
                    objectFit: "contain",
                    filter: "drop-shadow(0 2px 15px color-mix(in srgb, var(--c-accent) 20%, transparent))"
                  }}
                />

                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "var(--font-playfair-display)",
                    color: "color-mix(in srgb, var(--c-accent) 80%, transparent)",
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
                    color: "var(--c-text)",
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
                  sx={{ display: "flex", gap: 2, justifyContent: "flex-start", width: "100%" }}
                >
                  {[
                    { icon: <InstagramIcon />, label: "Instagram", href: "https://instagram.com/nihaajewels" },
                    { icon: <FacebookIcon />, label: "Facebook", href: "https://facebook.com/nihaajewels" },
                    { icon: <YoutubeIcon />, label: "YouTube", href: "https://youtube.com/@nihaajewels" },
                    { icon: <MessageCircle size={18} strokeWidth={1.5} />, label: "WhatsApp", href: `https://wa.me/${STORE.whatsapp}` },
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
                          borderColor: "var(--c-accent)",
                          color: "var(--c-text)",
                          backgroundColor: "var(--c-accent)",
                          boxShadow: "0 4px 15px color-mix(in srgb, var(--c-accent) 40%, transparent)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          border: "1px solid color-mix(in srgb, var(--c-card) 10%, transparent)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--c-text)",
                          cursor: "pointer",
                          transition: "color 0.3s ease, border-color 0.3s ease"
                        }}
                      >
                        {social.icon}
                      </Box>
                    </motion.div>
                  ))}
                </Box>
               </Box>
              </motion.div>
            </Grid2>

            {/* ── Information links ── */}
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <motion.div variants={itemVariants}>
               <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                <Typography
                  component={motion.div}
                  whileHover={{ x: 3 }}
                  sx={{
                    mb: 4,
                    color: "var(--c-accent)",
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
                          color: "var(--c-text)",
                          textDecoration: "none",
                          fontFamily: "var(--font-inter)",
                          fontSize: "0.95rem",
                          fontWeight: 300,
                          transition: "color 0.3s ease",
                          position: "relative",
                          width: "fit-content",
                          "&:hover": { color: "var(--c-accent)" },
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            width: "0%",
                            height: "1px",
                            bottom: -4,
                            left: 0,
                            backgroundColor: "var(--c-accent)",
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
               </Box>
              </motion.div>
            </Grid2>

            {/* ── Store info ── */}
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <motion.div variants={itemVariants}>
               <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                <Typography
                  component={motion.div}
                  whileHover={{ x: 3 }}
                  sx={{
                    mb: 4,
                    color: "var(--c-accent)",
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
                    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", color: "var(--c-text)", textAlign: "left" }}>
                      <Box sx={{ mt: 0.5, width: 32, height: 32, borderRadius: "50%", bgcolor: "color-mix(in srgb, var(--c-accent) 35%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <MapPin size={16} strokeWidth={1.5} color="var(--c-accent)" />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontFamily: "var(--font-inter)", fontWeight: 300, lineHeight: 1.8, fontSize: "0.9rem", color: "var(--c-text)" }}>
                          <Box component="span" sx={{ color: "var(--c-accent)", display: "block", mb: 0.5, fontWeight: 500, fontFamily: "var(--font-inter)", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
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
                            color: "var(--c-accent)",
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
                              backgroundColor: "var(--c-accent)",
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
                      href={STORE.phoneHref}
                      sx={{ display: "flex", gap: 2, alignItems: "center", color: "var(--c-text)", textDecoration: "none", transition: "color 0.3s", "&:hover": { color: "var(--c-accent)" } }}
                    >
                      <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "color-mix(in srgb, var(--c-accent) 35%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Phone size={16} strokeWidth={1.5} color="var(--c-accent)" />
                      </Box>
                      <Typography variant="body2" sx={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "0.95rem", color: "inherit", letterSpacing: "0.05em" }}>
                        {STORE.phone}
                      </Typography>
                    </Box>
                  </motion.div>

                  {/* Email */}
                  <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
                    <Box
                      component="a"
                      href={`mailto:${STORE.email}`}
                      sx={{ display: "flex", gap: 2, alignItems: "center", color: "var(--c-text)", textDecoration: "none", transition: "color 0.3s", "&:hover": { color: "var(--c-accent)" } }}
                    >
                      <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "color-mix(in srgb, var(--c-accent) 35%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Mail size={16} strokeWidth={1.5} color="var(--c-accent)" />
                      </Box>
                      <Typography variant="body2" sx={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "0.95rem", color: "inherit" }}>
                        support@nihaajewels.com
                      </Typography>
                    </Box>
                  </motion.div>

                  {/* Open/Closed indicator — only rendered after client hydration */}
                  <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center", color: "var(--c-text)" }}>
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
                              backgroundColor: isOpen ? "var(--c-open)" : "var(--c-closed)",
                              boxShadow: isOpen ? "0 0 12px var(--c-open)" : "0 0 12px var(--c-closed)"
                            }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "0.85rem", color: "var(--c-text)" }}>
                        Mon – Sat &bull; 10:00 AM – 8:00 PM
                      </Typography>
                    </Box>
                  </motion.div>
                </Box>
               </Box>
              </motion.div>
            </Grid2>

            {/* ── Newsletter ── */}
            <Grid2 size={{ xs: 12, md: 3 }}>
              <motion.div variants={itemVariants}>
               <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', width: '100%' }}>
                <Typography
                  component={motion.div}
                  whileHover={{ x: 3 }}
                  sx={{
                    mb: 4,
                    color: "var(--c-accent)",
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
                        color: "var(--c-text)",
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

                  <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} style={{ width: '100%' }}>
                    <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1, width: "100%" }}>
                      <TextField
                        variant="standard"
                        placeholder="Email Address"
                        fullWidth
                        sx={{
                          input: {
                            color: "var(--c-text)",
                            fontFamily: "var(--font-inter)",
                            px: 1,
                            py: 1.5,
                            "&:-webkit-autofill": {
                              WebkitBoxShadow: "0 0 0 100px var(--c-page) inset",
                              WebkitTextFillcolor: "var(--c-text)"
                            }
                          },
                          "& .MuiInput-underline:before": { borderBottomcolor: "var(--c-text)" },
                          "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottomColor: "color-mix(in srgb, var(--c-accent) 50%, transparent)" },
                          "& .MuiInput-underline:after": { borderBottomColor: "var(--c-accent)" }
                        }}
                      />
                      <Button
                        component={motion.button}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        fullWidth
                        sx={{
                          bgcolor: "var(--c-accent)",
                          color: "var(--c-page)",
                          mt: 0.5,
                          py: 1.5,
                          fontWeight: 600,
                          fontFamily: "var(--font-montserrat)",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          fontSize: "0.8rem",
                          borderRadius: 1,
                          transition: "background-color 0.3s ease, box-shadow 0.3s ease",
                          "&:hover": { bgcolor: "var(--c-accent)", boxShadow: "0px 4px 15px color-mix(in srgb, var(--c-accent) 30%, transparent)" }
                        }}
                      >
                        Subscribe
                      </Button>
                    </Box>
                  </motion.div>
                </Box>
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
                  background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--c-card) 8%, transparent), transparent)"
                }}
              />

              {/* FIX 4: render year only after hydration to avoid year-boundary mismatch */}
              <Typography
                variant="body2"
                sx={{
                  color: "var(--c-text)",
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
                      color: "var(--c-text)",
                      textDecoration: "none",
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.85rem",
                      transition: "all 0.3s ease",
                      "&:hover": { color: "var(--c-accent)", transform: "translateY(-1px)" }
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
                  backgroundColor: "color-mix(in srgb, var(--c-text-soft) 3%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--c-card) 5%, transparent)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  boxShadow: "0 4px 20px color-mix(in srgb, var(--c-text) 8%, transparent)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "color-mix(in srgb, var(--c-text-soft) 5%, transparent)",
                    borderColor: "var(--c-text)",
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
                    color: "var(--c-text)",
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
                    <Heart size={14} color="var(--c-closed)" fill="var(--c-closed)" />
                  </motion.div>
                  by{" "}
                  <Box
                    component={Link}
                    href="https://xlevelsup.com"
                    sx={{
                      color: "var(--c-text)",
                      textDecoration: "none",
                      fontWeight: 600,
                      transition: "color 0.3s",
                      "&:hover": { color: "var(--c-accent)" }
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