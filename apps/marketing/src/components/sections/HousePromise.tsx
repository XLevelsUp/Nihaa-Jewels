// The page's one burgundy band: four assurances a gold buyer weighs before visiting; claims are placeholders until the client confirms them.

import Image from 'next/image';

import Reveal from '@/components/ui/Reveal';
import { homeSlot } from '@/lib/imageSlots';

const PROMISES = [
  {
    title: 'Hallmarked purity',
    body: 'A BIS 916 hallmark on every piece, checked before it reaches the counter.',
  },
  {
    title: "Priced at today's rate",
    body: "Gold is valued at the day's rate, with weight and making charges shown line by line.",
  },
  {
    title: 'Lifetime exchange',
    body: 'Return any Sakthi piece against its gold value on the day you bring it back.',
  },
  {
    title: 'By appointment',
    body: 'A private counter, a consultant of your own, and as much time as the choice needs.',
  },
];

export default function HousePromise() {
  const background = homeSlot('promise').src;

  return (
    <section aria-labelledby="promise-heading" className="chrome-block mt-24 overflow-hidden py-28 md:mt-36 md:py-40">
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

        <ul className="mt-16 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
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
