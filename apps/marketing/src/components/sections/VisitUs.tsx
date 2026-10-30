'use client';

// The homepage's closing ask: one primary action (book), two quieter channels (WhatsApp, call), then the address and hours that make a visit concrete.

import { useState } from 'react';
import { CalendarCheck } from 'lucide-react';

import ImageSlot from '@/components/ui/ImageSlot';
import Reveal from '@/components/ui/Reveal';
import type { ResolvedSlot } from '@/constants/homepageImages';
import BookAppointmentDialog from '@/components/catalogue/BookAppointmentDialog';
import { MAPS_URL, STORE, STORE_ADDRESS_ONE_LINE } from '@/constants/store';

const WHATSAPP_HREF = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(
  `Hello ${STORE.name}, I would like to arrange a viewing.`,
)}`;

export default function VisitUs({ showroom }: { showroom: ResolvedSlot }) {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <section aria-labelledby="visit-heading" className="surface-page py-24 md:py-36">
      <div className="container-page grid grid-cols-1 items-center gap-14 md:grid-cols-12 md:gap-10">
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
            and the day&apos;s gold rate to hand.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button type="button" onClick={() => setBookingOpen(true)} className="lux-button">
              <CalendarCheck size={15} strokeWidth={1.5} aria-hidden="true" />
              Book an appointment
            </button>
            <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="lux-button lux-button-ghost">
              WhatsApp
            </a>
            <a href={STORE.phoneHref} className="lux-button lux-button-ghost">
              Call
            </a>
          </div>

          <hr className="lux-rule mt-12" />

          <address className="mt-8 grid grid-cols-1 gap-6 not-italic sm:grid-cols-2">
            <div>
              <p className="lux-eyebrow" style={{ letterSpacing: '0.3em' }}>Showroom</p>
              <p className="text-body mt-3 text-[0.88rem] leading-[1.75]">{STORE_ADDRESS_ONE_LINE}</p>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="lux-link mt-1">
                Directions
              </a>
            </div>
            <div>
              <p className="lux-eyebrow" style={{ letterSpacing: '0.3em' }}>Hours</p>
              <p className="text-body mt-3 text-[0.88rem] leading-[1.75]">{STORE.hours}</p>
              <a href={STORE.phoneHref} className="text-body mt-1 inline-flex min-h-11 items-center text-[0.88rem] tabular-nums">
                {STORE.phone}
              </a>
            </div>
          </address>
        </Reveal>
      </div>
      <BookAppointmentDialog open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </section>
  );
}
