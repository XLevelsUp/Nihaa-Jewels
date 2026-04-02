'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section
      id="newsletter"
      className="relative py-32 px-6 bg-[#121212] overflow-hidden"
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            #D4AF37 0px,
            #D4AF37 1px,
            transparent 1px,
            transparent 40px
          )`,
        }}
      />

      {/* Gold glow center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] rounded-full bg-[#D4AF37]/8 blur-[80px] pointer-events-none" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9 }}
        className="relative max-w-2xl mx-auto text-center"
      >
        <SectionLabel centered>Private Circle</SectionLabel>
        <div className="divider-gold" />

        <h2
          className="font-playfair text-4xl md:text-5xl text-[#FAF9F6] mt-4 mb-4 leading-tight"
          style={{ fontFamily: 'var(--font-playfair-display), serif' }}
        >
          Before the World Sees It
        </h2>

        <p
          className="text-[#d6d3ce] text-sm font-light leading-relaxed mb-12 max-w-sm mx-auto"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Join our private circle. Be the first to receive new arrivals, bespoke
          invitations, and exclusive access to rare pieces.
        </p>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSubmit}
              className="relative max-w-md mx-auto"
              id="newsletter-form"
            >
              <div
                className={`flex border-b transition-colors duration-300 ${
                  focused ? 'border-[#D4AF37]' : 'border-[#D4AF37]/30'
                }`}
              >
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="Your email address"
                  required
                  className="flex-1 bg-transparent text-[#FAF9F6] text-sm py-3 pr-4 placeholder-[#d6d3ce]/30 focus:outline-none font-light tracking-wide input-gold"
                  style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                  aria-label="Email address for newsletter"
                />
                <motion.button
                  id="newsletter-submit"
                  type="submit"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-[#D4AF37] hover:text-[#F7E7CE] transition-colors py-3 pl-2"
                  aria-label="Subscribe"
                >
                  <Send size={16} strokeWidth={1.5} />
                </motion.button>
              </div>

              <p
                className="text-[#d6d3ce]/40 text-[0.6rem] uppercase tracking-widest mt-4"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                No spam. Unsubscribe anytime. Pure luxury in your inbox.
              </p>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-4"
            >
              <CheckCircle
                size={40}
                strokeWidth={1}
                className="text-[#D4AF37]"
              />
              <p
                className="font-playfair text-xl text-[#F7E7CE] italic"
                style={{ fontFamily: 'var(--font-playfair-display), serif' }}
              >
                Welcome to the circle.
              </p>
              <p
                className="text-[#d6d3ce] text-xs font-light tracking-wide"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                We'll be in touch soon with something worth waiting for.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
