import type { Metadata } from 'next';

import LegalPage from '@/components/sections/LegalPage';
import { STORE } from '@/constants/store';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms for using the Sakthi Chains website: how gold and silver prices follow the day’s rates, diamond pricing on request, and booking a showroom visit.',
  alternates: { canonical: '/terms-and-conditions' },
};

export default function TermsAndConditions() {
  return (
    <LegalPage
      eyebrow="Client Care"
      title="Terms & Conditions"
      updated="November 2026"
      intro={`By using this website you agree to the terms below. They explain how the ${STORE.name} catalogue works.`}
      sections={[
        {
          heading: 'A catalogue, not a shop',
          body: (
            <p>
              This website shows our jewellery so you can choose before you visit. Nothing can be ordered or paid for online;
              every purchase is made at our showroom.
            </p>
          ),
        },
        {
          heading: 'Prices',
          body: (
            <>
              <p>
                Gold and silver prices on this website are indicative. Each one is worked out from the day’s gold or silver rate
                entered by our team, plus wastage, making charges, hallmarking (where applicable) and GST, as shown in the
                price breakdown on each product. Diamond jewellery is shown as &ldquo;Price on request&rdquo;.
              </p>
              <p>
                Gold and silver rates change every day, so the final price is confirmed at the showroom when you buy, using that
                day’s rate and the weight measured at the counter.
              </p>
            </>
          ),
        },
        {
          heading: 'Photos and weights',
          body: (
            <p>
              Photos are as close to the real piece as we can make them, but colour and size can look different on screens.
              Handmade pieces can vary slightly in weight from the figure shown; the weight measured at the counter is the one
              used.
            </p>
          ),
        },
        {
          heading: 'Hallmarking',
          body: <p>Our gold jewellery is BIS hallmarked for its purity.</p>,
        },
        {
          heading: 'Booking a visit',
          body: (
            <p>
              A booking made on this website is a request. Our team will call or WhatsApp you to confirm the time. Booking does
              not reserve or hold a piece unless our team confirms that it does.
            </p>
          ),
        },
        {
          heading: 'Custom orders',
          body: (
            <p>
              The design, price, advance and delivery date for a custom piece are agreed with you at the showroom before work
              begins.
            </p>
          ),
        },
        {
          heading: 'Website content',
          body: (
            <p>
              The photos, designs and text on this website belong to {STORE.name} and may not be copied for commercial use
              without our permission.
            </p>
          ),
        },
        {
          heading: 'Changes to these terms',
          body: <p>We may update these terms from time to time. The date at the top of this page shows the latest version.</p>,
        },
      ]}
    />
  );
}
