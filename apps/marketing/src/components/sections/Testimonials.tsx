'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'Priya',
    location: 'Coimbatore',
    tag: 'Bridal Collection',
    text: 'I found Nihaa Jewels when searching for the best bridal jewellery Coimbatore has to offer. Their BIS Hallmarked gold collection is absolutely stunning, with gorgeous designs and incredible craftsmanship.',
  },
  {
    id: 2,
    name: 'Rajesh',
    location: 'RS Puram Showroom',
    tag: 'Gold Gifting',
    text: 'Visited the RS Puram showroom for some gold gifting. The experience was wonderful, and I found the perfect gift. The craftsmanship and collection are exceptional.',
  },
  {
    id: 3,
    name: 'Ananya',
    location: 'Coimbatore',
    tag: 'Daily Wear',
    text: 'I was looking for lightweight gold jewellery for daily wear and was amazed by their collection. The BIS Hallmarked gold gives total peace of mind regarding quality and purity.',
  },
];

export default function Testimonials() {
  return (
    <section className="surface-page section">
      <div className="container-page">

        <header className="mb-12 text-center">
          <span className="eyebrow mb-3">In Their Words</span>
          <h2 className="heading-lg text-body">
            Trusted across <em className="not-italic text-accent">Coimbatore</em>
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <motion.figure
              key={r.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="surface-panel m-0 flex h-full flex-col p-7"
            >
              <div className="mb-4 flex gap-0.5 text-accent">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={13} fill="currentColor" strokeWidth={0} />
                ))}
              </div>

              <blockquote className="text-body m-0 flex-1 text-[0.88rem] leading-[1.9]">
                {r.text}
              </blockquote>

              <figcaption className="divider-soft mt-6 pt-4">
                <span className="text-body block text-[0.85rem] font-medium">{r.name}</span>
                <span className="text-soft block text-[0.7rem]">
                  {r.location} &middot; {r.tag}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>

      </div>
    </section>
  );
}
