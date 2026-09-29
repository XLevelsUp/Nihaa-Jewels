'use client';

// Deliberately sparse, following Zoya's storefront panel: one image, a heading, two lines
// and a single underlined link. The previous four-tile version competed with the footer.

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CalendarCheck } from 'lucide-react';
import BookAppointmentDialog from '@/components/catalogue/BookAppointmentDialog';

export default function VisitUs() {
  const reduce = useReducedMotion();
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <section className="surface-page section">
      <div className="container-page">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1.25fr_1fr] md:gap-16">

          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: '4 / 3', background: 'var(--c-page)' }}
          >
            <Image
              src="/images/visit-us-storefront.webp"
              alt="Nihaa Jewels showroom, RS Puram, Coimbatore"
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-contain"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-center md:text-left"
          >
            <h2
              className="text-body font-[family-name:var(--font-heading)]"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', lineHeight: 1.15, letterSpacing: '-0.015em' }}
            >
              The Nihaa Experience
            </h2>

            <p
              className="text-soft mx-auto mt-5 max-w-sm md:mx-0"
              style={{ fontSize: '0.95rem', lineHeight: 1.8 }}
            >
              Four generations of goldsmiths, one workshop in Coimbatore — come and see
              a piece in the hand before you choose it. Book ahead and we will have it ready.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <button
                type="button"
                onClick={() => setBookingOpen(true)}
                className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 text-xs"
              >
                <CalendarCheck size={15} strokeWidth={1.6} />
                Book an Appointment
              </button>
              <Link
                href="/stores"
                className="text-body no-underline transition-colors duration-300 hover:text-[var(--c-accent)]"
                style={{
                  fontSize: '0.78rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid currentColor',
                  paddingBottom: 3,
                }}
              >
                Find Our Store
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
      <BookAppointmentDialog open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </section>
  );
}
