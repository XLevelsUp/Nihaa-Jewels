// Plain-language introduction to the shop with links into each collection, plus FAQs that Google can show as rich results; every answer must stay true for the shop.

import Link from 'next/link';

import Reveal from '@/components/ui/Reveal';
import { getCurrentRates, getCurrentSilverRates, getNavCategories, type NavCategory } from '@/lib/catalogue';
import { JEWELLERY_TYPES } from '@/constants/jewelleryTypes';
import { formatRupees } from '@/lib/pricing';
import { STORE, STORE_ADDRESS_ONE_LINE } from '@/constants/store';

export default async function LocalGuide() {
  let categories: NavCategory[] = [];
  let rate22: number | undefined;
  let silver925: number | undefined;
  try {
    const [cats, rates, silverRates] = await Promise.all([getNavCategories(), getCurrentRates(), getCurrentSilverRates().catch(() => null)]);
    categories = cats;
    rate22 = rates['22K'];
    silver925 = silverRates?.['925'];
  } catch {
    /* the copy still renders without live data */
  }

  const faqs = [
    {
      q: 'Where is your jewellery shop in Coimbatore?',
      a: `Our showroom is at ${STORE_ADDRESS_ONE_LINE}. We are open ${STORE.hours.replace('Mon–Sat:', 'Monday to Saturday,')} and closed on Sunday. Book a visit online, or call or WhatsApp ${STORE.phone}.`,
    },
    {
      q: 'Do you sell diamond and silver jewellery?',
      a: 'Yes. Sakthi Chains sells gold, silver and diamond jewellery. Silver comes in 925 sterling and 999 fine silver, priced from the day’s silver rate, and every diamond piece comes with its certificate, with the price given on request. Each has its own page on this website, and the full range is at the showroom.',
    },
    {
      q: 'What is today’s gold rate in Coimbatore?',
      a: rate22
        ? `Our 22 carat gold rate today is ${formatRupees(rate22)} per gram${silver925 ? `, and 925 silver is ${formatRupees(silver925)} per gram` : ''}, updated by our team. Every price on this website is worked out from these rates, and the final price is confirmed in store.`
        : 'Our team updates the day’s gold and silver rates, and every price on this website is worked out from them. Call us for today’s rate.',
    },
    {
      q: 'How is the price of a gold chain worked out?',
      a: 'The gold weight is multiplied by the day’s rate for its purity, then wastage, making charges, hallmarking and 3% GST are added. Each product page shows this breakdown, so a gold chain for men or women can be compared before you visit.',
    },
    {
      q: 'Is 24 carat gold used for chains?',
      a: 'Chains for daily wear are usually made in 22 carat (916) gold, because pure 24 carat gold is very soft. Ask our team about the purity options for the piece you have in mind.',
    },
    {
      q: 'Is your gold BIS hallmarked?',
      a: 'Yes. Every gold piece is BIS hallmarked for its purity, so it can be checked by anyone, anywhere.',
    },
  ];

  // Links a phrase in the copy to its collection when one exists, so keywords sit in natural sentences instead of a list of tags.
  const linkTo = (word: string, text: string) => {
    const c = categories.find((cat) => cat.slug.startsWith(word) || cat.name.toLowerCase().startsWith(word));
    if (!c) return text;
    return (
      <Link
        href={`/collections/${c.slug}`}
        className="transition-colors hover:text-[var(--c-burgundy)]"
        style={{ textDecoration: 'underline', textDecorationColor: 'var(--c-champagne)', textUnderlineOffset: '4px' }}
      >
        {text}
      </Link>
    );
  };

  const typeLink = (type: 'silver' | 'diamond', text: string) => (
    <Link
      href={JEWELLERY_TYPES[type].path}
      className="transition-colors hover:text-[var(--c-burgundy)]"
      style={{ textDecoration: 'underline', textDecorationColor: 'var(--c-champagne)', textUnderlineOffset: '4px' }}
    >
      {text}
    </Link>
  );

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <section aria-labelledby="local-guide-heading" className="surface-page pt-12 md:pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-5">
          <p className="lux-eyebrow">Jewellery Shop in Coimbatore</p>
          <h2 id="local-guide-heading" className="lux-display mt-4" style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)' }}>
            Gold, diamond and silver, <em>under one roof</em>
          </h2>
          <p className="lux-body mt-6">
            {STORE.name} is a gold jewellery shop at Town Hall, Coimbatore, with {typeLink('diamond', 'diamond jewellery')} and{' '}
            {typeLink('silver', 'silver jewellery')} alongside. Choose {linkTo('chain', 'gold chains')} for men and women, light 3 to 4 gram{' '}
            {linkTo('earring', 'gold earring designs')} for every day, {linkTo('bangle', 'gold bangles')} and{' '}
            {linkTo('ring', 'rings')}, or complete {linkTo('necklace', 'bridal and wedding jewellery sets')}.
          </p>
          <p className="lux-body mt-4">
            Every gold piece is BIS hallmarked, weighed in front of you and priced at the day’s gold rate, so what you see
            online is what you can expect at the counter.
          </p>
          <Link href="/collections" className="lux-link mt-8 inline-flex">
            Explore the collections
          </Link>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
          <p className="lux-eyebrow">Frequently Asked</p>
          <div className="mt-4">
            {faqs.map((f) => (
              <details key={f.q} className="group border-t py-4" style={{ borderColor: 'var(--c-border)' }}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                  <h3 className="lux-title text-[1.15rem]">{f.q}</h3>
                  <span aria-hidden="true" className="text-[1.2rem] leading-none transition-transform group-open:rotate-45" style={{ color: 'var(--c-burgundy)' }}>
                    +
                  </span>
                </summary>
                <p className="lux-body mt-3 text-[0.88rem]">{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
