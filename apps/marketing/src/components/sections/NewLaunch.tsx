'use client';

// Blush block — the palette's second fill, used where the tone should soften.

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function NewLaunch() {
  return (
    <section className="surface-page section">
      <div className="container-page">
        <div className="block-blush grid grid-cols-1 items-center gap-0 overflow-hidden md:grid-cols-2">

          <div className="order-2 p-8 md:order-1 md:p-14">
            <span className="eyebrow mb-4">The Bridal Edit</span>
            <h2 className="heading-lg">Crafted for your forever moment</h2>
            <p className="text-soft mt-5 max-w-md text-[0.9rem] leading-[1.9]">
              Complete trousseaux in matched 22K goldwork — necklace, jhumkas, bangles and
              maang tikka, commissioned as a set and made to your measurements.
            </p>
            <Link
              href="/collections/bridal"
              className="mt-8 inline-block border border-current px-8 py-3 text-xs uppercase tracking-[0.12em] transition-opacity hover:opacity-80"
            >
              Explore Bridal
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-1 w-full md:order-2"
            style={{ aspectRatio: '3 / 2', background: 'var(--c-icing)' }}
          >
            <Image
              src="/images/ring-promo.webp"
              alt="Emerald and gold rings worn with a green silk saree"
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              // Subject sits right of centre, so a centred crop would cut across her.
              style={{ objectPosition: '68% 40%' }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
