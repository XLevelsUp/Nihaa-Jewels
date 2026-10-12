'use client';

// Sage block: the one dark band on the page, so the trust credentials carry weight.

import { motion } from 'framer-motion';
import { BadgeCheck, Gem, RefreshCw, Truck } from 'lucide-react';

const POINTS = [
  { icon: BadgeCheck, title: 'BIS Hallmarked', body: 'Every gram certified for purity, without exception.' },
  { icon: Gem, title: 'IGI Certified Diamonds', body: 'Conflict-free stones with independent certification.' },
  { icon: RefreshCw, title: 'Lifetime Exchange', body: 'Exchange any piece against its current gold value.' },
  { icon: Truck, title: 'Insured Delivery', body: 'Complimentary insured shipping across India.' },
];

export default function NihaaAssurance() {
  return (
    <section className="block-sage section">
      <div className="container-page">

        <header className="mb-12 text-center">
          <span className="eyebrow mb-3">The Nihaa Assurance</span>
          <h2 className="heading-lg">Bought with confidence</h2>
        </header>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="text-center"
              >
                <Icon size={26} strokeWidth={1.25} className="mx-auto mb-4 opacity-90" />
                <h3 className="text-[0.95rem] font-medium">{p.title}</h3>
                <p className="text-soft mx-auto mt-2 max-w-[22ch] text-[0.78rem] leading-[1.75]">
                  {p.body}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
