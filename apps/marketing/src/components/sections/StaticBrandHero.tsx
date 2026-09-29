'use client';

// Rotating word on the left, three static frames on the right. The word cycles on a
// timer; everything else is entrance-only so the section settles and stays still.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, CalendarCheck } from 'lucide-react';
import BookAppointmentDialog from '@/components/catalogue/BookAppointmentDialog';

const SPRING = { type: 'spring' as const, bounce: 0, duration: 0.6 };
const ROTATING_WORDS = ['Heritage', 'Elegance', 'Craftsmanship', 'Devotion'];
const WORD_MS = 2600;

const FRAMES = [
  { src: '/images/hero-frame-1-bridal.webp', label: 'Bridal temple necklace', ratio: '4 / 5' },
  { src: '/images/hero-frame-2-craft.webp', label: 'Our goldsmiths at work', ratio: '1 / 1' },
  { src: '/images/hero-frame-3-flatlay.webp', label: 'Temple jewellery collection', ratio: '1 / 1' },
];

export default function StaticBrandHero() {
  const reduce = useReducedMotion();
  const [wordIdx, setWordIdx] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setWordIdx((i) => (i + 1) % ROTATING_WORDS.length), WORD_MS);
    return () => clearInterval(t);
  }, [reduce]);

  const rise = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.25 } } }
    : { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: SPRING } };

  const group = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };

  return (
    <section className="surface-page relative overflow-hidden">
      <div className="container-page pt-24 pb-14 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-14">

          <motion.div variants={group} initial="hidden" animate="show">
            <motion.div variants={rise} className="mb-6 flex items-center gap-2.5">
              <span className="h-px w-8 bg-[var(--c-accent)]" />
              <span className="eyebrow">Est. 1986 &middot; Coimbatore</span>
            </motion.div>

            <motion.h1
              variants={rise}
              className="text-body font-[family-name:var(--font-heading)]"
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 4rem)',
                lineHeight: 1.06,
                letterSpacing: '-0.026em',
              }}
            >
              The Art of
              <br />
              {/* Fixed height stops the line below jumping as words change length. */}
              <span
                className="text-accent relative block overflow-hidden"
                style={{ height: '1.1em' }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={wordIdx}
                    className="absolute inset-x-0"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: '0.5em' }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: '-0.5em' }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {ROTATING_WORDS[wordIdx]}
                  </motion.span>
                </AnimatePresence>
              </span>
              in Gold
            </motion.h1>

            <motion.p
              variants={rise}
              className="text-soft mt-7 max-w-md"
              style={{ fontSize: '1rem', lineHeight: 1.85 }}
            >
              Handcrafted in our own Coimbatore workshop — every piece BIS hallmarked,
              shaped by four generations of goldsmiths.
            </motion.p>

            <motion.div variants={rise} className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/collections"
                className="btn-primary group inline-flex items-center gap-2.5 px-8 py-4 text-xs"
              >
                View Collections
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </Link>
              <button
                type="button"
                onClick={() => setBookingOpen(true)}
                className="btn-outline inline-flex items-center gap-2 px-8 py-4 text-xs"
              >
                <CalendarCheck size={14} strokeWidth={1.6} />
                Book an Appointment
              </button>
            </motion.div>

            <motion.dl
              variants={rise}
              className="divider-soft mt-11 grid max-w-xs grid-cols-3 gap-5 pt-7"
            >
              {[
                { v: '1986', l: 'Est.' },
                { v: '4', l: 'Generations' },
                { v: '12K+', l: 'Pieces' },
              ].map((s) => (
                <div key={s.l}>
                  <dt
                    className="text-accent font-[family-name:var(--font-heading)]"
                    style={{ fontSize: '1.35rem', fontVariantNumeric: 'tabular-nums' }}
                  >
                    {s.v}
                  </dt>
                  <dd
                    className="text-soft mt-1"
                    style={{ fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}
                  >
                    {s.l}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          <motion.div
            variants={group}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 grid-rows-2 gap-2.5 sm:gap-3"
          >
            {FRAMES.map((f, i) => (
              <motion.div
                key={f.label}
                variants={rise}
                // The tall bridal frame spans both rows; on a phone it takes the
                // full width instead, since a half-width crop is too small to read.
                className={i === 0 ? 'col-span-2 row-span-2 sm:col-span-1' : ''}
                style={{ gridRow: i === 0 ? 'span 2' : undefined }}
              >
                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    aspectRatio: f.ratio,
                    height: i === 0 ? '100%' : undefined,
                    boxShadow: '0 14px 36px color-mix(in srgb, var(--c-text) 10%, transparent)',
                  }}
                >
                  <Image
                    src={f.src}
                    alt={`${f.label} — Nihaa Jewels Coimbatore`}
                    fill
                    priority={i === 0}
                    sizes={
                      i === 0
                        ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                        : '(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw'
                    }
                    className="object-cover"
                    style={{ objectPosition: i === 0 ? '50% 35%' : 'center' }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>

      <BookAppointmentDialog open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </section>
  );
}
