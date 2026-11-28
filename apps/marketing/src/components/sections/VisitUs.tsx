'use client';

// The homepage's closing ask: one primary action (book), two quieter channels (WhatsApp, call), then the address and hours that make a visit concrete.

import { useState } from 'react';
import { CalendarCheck } from 'lucide-react';

import ImageSlot from '@/components/ui/ImageSlot';
import Reveal from '@/components/ui/Reveal';
import type { ResolvedSlot } from '@/constants/homepageImages';
import BookAppointmentDialog from '@/components/catalogue/BookAppointmentDialog';
import { SHOWROOMS, STORE } from '@/constants/store';

const WHATSAPP_HREF = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(
  `Hello ${STORE.name}, I would like to arrange a viewing.`,
)}`;

export default function VisitUs({ showroom }: { showroom: ResolvedSlot }) {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <section aria-labelledby="visit-heading" className="surface-page py-12 md:py-20">
      <div className="container-page grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-8">
        <Reveal className="md:col-span-7">
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
            <ImageSlot slot={showroom} sizes="(max-width: 768px) 100vw, 58vw" />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="md:col-span-5">
          <p className="lux-eyebrow">Visit the House</p>
          <h2 id="visit-heading" className="lux-display mt-4" style={{ fontSize: 'clamp(2.1rem, 4vw, 3.3rem)' }}>
            Hold it in your hand <em>before you choose</em>
          </h2>
          <p className="lux-body mt-6">
            Tell us what you would like to see and we will have it waiting at a private counter, with a consultant
            and the day&apos;s gold and silver rates to hand.
          </p>

          <div className="mt-8 grid max-w-md grid-cols-2 gap-3">
            <button type="button" onClick={() => setBookingOpen(true)} className="lux-button col-span-2 w-full">
              <CalendarCheck size={15} strokeWidth={1.5} aria-hidden="true" />
              Book an appointment
            </button>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="lux-button lux-button-ghost w-full"
              style={{ paddingInline: '1rem' }}
            >
              WhatsApp
            </a>
            <a href={STORE.phoneHref} className="lux-button lux-button-ghost w-full" style={{ paddingInline: '1rem' }}>
              Call
            </a>
          </div>

          <hr className="lux-rule mt-10" />

          <div className={`mt-8 grid grid-cols-1 gap-8 ${SHOWROOMS.length > 1 ? 'sm:grid-cols-2' : ''}`}>
            {SHOWROOMS.map((s) => (
              <address key={s.id} className="flex flex-col items-start not-italic">
                <p className="lux-eyebrow" style={{ letterSpacing: '0.3em' }}>{s.name}</p>
                <p className="text-body mt-3 text-[0.88rem] leading-[1.75]">{s.address}</p>
                <p className="text-soft mt-1 text-[0.82rem]">{s.hours}</p>
                <a href={s.phoneHref} className="text-body mt-1 inline-flex min-h-11 items-center text-[0.95rem] font-medium tabular-nums">
                  {s.phone}
                </a>
                <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className="lux-link mt-3">
                  Directions
                </a>
              </address>
            ))}
          </div>
        </Reveal>
      </div>
      <BookAppointmentDialog open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </section>
  );
}
