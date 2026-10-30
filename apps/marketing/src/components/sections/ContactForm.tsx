'use client';

// Open enquiries go to the shop's Google Sheet; success is only shown when the request actually left the browser, and failures point to the phone instead of pretending.

import { useState } from 'react';
import { Send } from 'lucide-react';

import { STORE } from '@/constants/store';

const INTERESTS = [
  { value: '', label: 'Choose one (optional)' },
  { value: 'bridal', label: 'Bridal jewellery' },
  { value: 'custom', label: 'Bespoke / custom design' },
  { value: 'exchange', label: 'Old gold exchange' },
  { value: 'gifting', label: 'Gifting' },
  { value: 'general', label: 'General question' },
];

const EMPTY = { name: '', phone: '', email: '', interest: '', message: '' };

export default function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const endpoint = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL;
    if (!endpoint) {
      setState('failed');
      return;
    }
    setState('sending');
    try {
      // no-cors: Apps Script does not send CORS headers, so the reply is opaque; a network failure still throws.
      await fetch(endpoint, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(form) });
      setState('sent');
      setForm(EMPTY);
    } catch (err) {
      console.error('[contact] send failed:', err);
      setState('failed');
    }
  };

  const field = 'mt-2 w-full border-0 border-b bg-transparent px-0 py-2 text-[0.92rem] outline-none transition-colors focus:border-[var(--c-burgundy)]';
  const fieldStyle = { borderColor: 'var(--c-border-firm)', color: 'var(--c-text)' };
  const label = 'lux-eyebrow block';

  return (
    <div className="p-6 md:p-10" style={{ border: '1px solid var(--c-border-firm)', background: 'var(--c-product-card)' }}>
      <h2 className="lux-display" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.3rem)' }}>
        Send us <em>a message</em>
      </h2>
      <p className="lux-body mt-3 text-[0.88rem]">
        For questions about a piece, pricing or a commission. To reserve a time at the showroom, book a visit instead.
      </p>

      {state === 'sent' ? (
        <div role="status" className="mt-8 p-6" style={{ background: 'var(--c-icing)' }}>
          <p className="lux-title text-[1.3rem]">Thank you, your message is on its way.</p>
          <p className="lux-body mt-2 text-[0.88rem]">We will reply as soon as we can. For anything urgent, call {STORE.phone}.</p>
          <button type="button" onClick={() => setState('idle')} className="lux-link mt-3">Send another message</button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <label className={label}>
              Full name *
              <input required name="name" autoComplete="name" value={form.name} onChange={set('name')} className={field} style={fieldStyle} />
            </label>
            <label className={label}>
              Phone
              <input name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} className={field} style={fieldStyle} />
            </label>
          </div>
          <label className={label}>
            Email *
            <input required name="email" type="email" autoComplete="email" value={form.email} onChange={set('email')} className={field} style={fieldStyle} />
          </label>
          <label className={label}>
            I am interested in
            <select name="interest" value={form.interest} onChange={set('interest')} className={`${field} cursor-pointer`} style={fieldStyle}>
              {INTERESTS.map((i) => (
                <option key={i.value} value={i.value}>{i.label}</option>
              ))}
            </select>
          </label>
          <label className={label}>
            Message *
            <textarea required name="message" rows={4} value={form.message} onChange={set('message')} className={`${field} resize-y`} style={fieldStyle} />
          </label>

          {state === 'failed' && (
            <p role="alert" className="p-4 text-[0.85rem]" style={{ background: 'rgba(179,38,30,0.08)', color: 'var(--c-text)' }}>
              Your message could not be sent. Please call or WhatsApp us on {STORE.phone}.
            </p>
          )}

          <button type="submit" disabled={state === 'sending'} className="lux-button self-start disabled:opacity-60">
            <Send size={14} strokeWidth={1.5} aria-hidden="true" />
            {state === 'sending' ? 'Sending…' : 'Send message'}
          </button>
        </form>
      )}
    </div>
  );
}
