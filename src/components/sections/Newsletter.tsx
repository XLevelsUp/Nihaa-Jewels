'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Box, Typography, IconButton, InputBase, alpha, useTheme } from '@mui/material';
import { Send, CheckCircle } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(false);
  const theme = useTheme();

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <Box
      component="section"
      id="newsletter"
      sx={{
        position: 'relative',
        py: { xs: 15, md: 20 },
        px: 3,
        bgcolor: '#121212',
        overflow: 'hidden'
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: `repeating-linear-gradient(
            45deg,
            #D4AF37 0px,
            #D4AF37 1px,
            transparent 1px,
            transparent 40px
          )`,
          pointerEvents: 'none'
        }}
      />

      {/* Gold glow center */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '400px', md: '800px' },
          height: { xs: '200px', md: '300px' },
          borderRadius: '50%',
          bgcolor: alpha('#D4AF37', 0.08),
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
      />

      <MotionBox
        ref={ref}
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9 }}
        sx={{
          position: 'relative',
          maxWidth: '800px',
          mx: 'auto',
          textAlign: 'center'
        }}
      >
        <SectionLabel centered>Private Circle</SectionLabel>
        <Box className="divider-gold" sx={{ mb: 4 }} />

        <Typography
          variant="h2"
          sx={{
            fontFamily: 'var(--font-playfair-display), serif',
            fontSize: { xs: '2.25rem', md: '3rem' },
            color: '#FAF9F6',
            mt: 2,
            mb: 4,
            lineHeight: 1.2
          }}
        >
          Before the World Sees It
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: 'rgba(214, 211, 206, 0.6)',
            fontSize: '0.875rem',
            fontWeight: 300,
            lineHeight: 1.8,
            mb: 8,
            maxWidth: '400px',
            mx: 'auto',
            fontFamily: 'var(--font-inter), sans-serif'
          }}
        >
          Join our private circle. Be the first to receive new arrivals, bespoke
          invitations, and exclusive access to rare pieces.
        </Typography>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <MotionBox
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              sx={{
                position: 'relative',
                maxWidth: '448px',
                mx: 'auto'
              }}
            >
              <form onSubmit={handleSubmit} id="newsletter-form">
                <Box
                  sx={{
                    display: 'flex',
                    borderBottom: `1px solid ${focused ? alpha('#D4AF37', 1) : alpha('#D4AF37', 0.3)}`,
                    transition: 'border-color 0.3s ease'
                  }}
                >
                <InputBase
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="Your email address"
                  required
                  fullWidth
                  sx={{
                    color: '#FAF9F6',
                    fontSize: '0.875rem',
                    py: 1.5,
                    pr: 2,
                    fontFamily: 'var(--font-inter), sans-serif',
                    '& input::placeholder': {
                      color: 'rgba(214, 211, 206, 0.3)',
                      opacity: 1
                    }
                  }}
                  aria-label="Email address for newsletter"
                />
                <IconButton
                  id="newsletter-submit"
                  type="submit"
                  sx={{
                    color: '#D4AF37',
                    p: 1.5,
                    '&:hover': { color: '#F7E7CE' },
                    transition: 'color 0.3s ease'
                  }}
                  component={motion.button}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Subscribe"
                >
                  <Send size={18} strokeWidth={1.5} />
                </IconButton>
              </Box>

              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: 'rgba(214, 211, 206, 0.25)',
                  fontSize: '0.6rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  mt: 3,
                  fontFamily: 'var(--font-inter), sans-serif'
                }}
              >
                No spam. Unsubscribe anytime. Pure luxury in your inbox.
              </Typography>
              </form>
            </MotionBox>
          ) : (
            <MotionBox
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3
              }}
            >
              <CheckCircle
                size={48}
                strokeWidth={1}
                color={alpha('#D4AF37', 0.8).toString()}
              />
              <Typography
                sx={{
                  fontFamily: 'var(--font-playfair-display), serif',
                  fontSize: '1.5rem',
                  color: '#F7E7CE',
                  fontStyle: 'italic'
                }}
              >
                Welcome to the circle.
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(214, 211, 206, 0.6)',
                  fontSize: '0.75rem',
                  fontWeight: 300,
                  letterSpacing: '0.05em',
                  fontFamily: 'var(--font-inter), sans-serif'
                }}
              >
                We&apos;ve added you to our list. Expect the extraordinary soon.
              </Typography>
            </MotionBox>
          )}
        </AnimatePresence>
      </MotionBox>
    </Box>
  );
}
