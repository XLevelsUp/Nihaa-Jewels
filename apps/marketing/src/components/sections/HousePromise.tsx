// The page's one burgundy band: four assurances a gold buyer weighs before visiting; claims are placeholders until the client confirms them.

import Image from 'next/image';

import Reveal from '@/components/ui/Reveal';
import { homeSlot } from '@/lib/imageSlots';

const PROMISES = [
  {
    title: 'Purity & certification',
    body: 'Every gold piece is BIS hallmarked, silver is offered in 925 sterling and 999 fine, and every diamond comes with a certificate.',
  },
  {
    title: "Priced at today's rate",
    body: "Gold and silver are valued at the day's rate with a line-by-line breakdown; diamond pieces are priced on request.",
  },
  {
    title: 'Gold exchange',
    body: 'Bring old gold to be tested in front of you and valued at the day’s gold rate against something new.',
  },
  {
    title: 'By appointment',
    body: 'A private counter, a consultant of your own, and as much time as the choice needs.',
  },
];

export default function HousePromise() {
  const background = homeSlot('promise').src;

  return (
    <section aria-labelledby="promise-heading" className="chrome-block mt-12 overflow-hidden py-12 md:mt-20 md:py-20">
      {background && (
        <>
          <Image src={background} alt="" fill loading="lazy" sizes="100vw" className="-z-20 object-cover" />
          <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: 'rgba(78, 0, 22, 0.86)' }} />
        </>
      )}
      <div className="container-page relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="lux-eyebrow">The Sakthi Promise</p>
          <h2 id="promise-heading" className="lux-display mt-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
            What every piece <em>carries with it</em>
          </h2>
        </Reveal>

        <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {PROMISES.map((p, i) => (
            <li key={p.title}>
              <Reveal delay={i * 0.08} className="pt-6" style={{ borderTop: '1px solid var(--c-chrome-rule)' }}>
                <h3 className="lux-title text-[1.4rem]">{p.title}</h3>
                <p className="mt-3 text-[0.88rem] leading-[1.8]" style={{ color: 'var(--c-on-chrome-soft)' }}>
                  {p.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
