import type { Metadata } from 'next';

import LegalPage from '@/components/sections/LegalPage';
import { STORE } from '@/constants/store';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Sakthi Chains, Coimbatore, collects and uses the details you share when you book a showroom visit or contact us, and how to ask us to change or delete them.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicy() {
  return (
    <LegalPage
      eyebrow="Client Care"
      title="Privacy Policy"
      updated="November 2026"
      intro={`This page explains what ${STORE.name} does with the details you share with us through this website or at our showroom.`}
      sections={[
        {
          heading: 'What we collect',
          body: (
            <p>
              When you book a showroom visit or send us a message, we receive the details you type in: your name, phone
              number, email address if you give one, the date and time you prefer, and your message. We do not ask for card or
              bank details on this website.
            </p>
          ),
        },
        {
          heading: 'How we use it',
          body: (
            <p>
              We use your details only to reply to you, confirm or change your appointment, and have the pieces you asked about
              ready when you visit. If you ask us to, we may also let you know about new collections; you can tell us to stop at
              any time.
            </p>
          ),
        },
        {
          heading: 'Who sees it',
          body: (
            <p>
              Your details are seen by our showroom team. Form entries are stored in our Google account. We do not sell or rent
              your details to anyone.
            </p>
          ),
        },
        {
          heading: 'No online payments',
          body: (
            <p>
              This website is a catalogue. You cannot buy or pay on it, so no payment information is collected here. Purchases
              are made at the showroom.
            </p>
          ),
        },
        {
          heading: 'Cookies and analytics',
          body: (
            <p>
              We use Google Analytics and the Meta Pixel to understand how many people visit and which pages they find useful.
              These tools set cookies in your browser. You can block or delete cookies in your browser settings; the website
              still works without them.
            </p>
          ),
        },
        {
          heading: 'Your choices',
          body: (
            <p>
              You can ask us to show, correct or delete the details we hold about you. Call or WhatsApp us on {STORE.phone}, or
              ask at the showroom.
            </p>
          ),
        },
      ]}
    />
  );
}
