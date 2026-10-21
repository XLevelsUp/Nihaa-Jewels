// The selling price, with the original struck through and the saving beneath when a discount applies, as the large jewellers show it.

import { formatRupees, type PriceBreakdown } from '@/lib/pricing';

interface PriceTagProps {
  price: PriceBreakdown;
  size?: 'md' | 'lg';
}

export default function PriceTag({ price, size = 'md' }: PriceTagProps) {
  const large = size === 'lg';
  const discounted = price.percentOff > 0;

  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-2 tabular-nums">
        <span className={`font-semibold ${large ? 'text-[1.75rem]' : 'text-[0.95rem]'}`} style={{ color: 'var(--c-burgundy)' }}>
          {formatRupees(price.total)}
        </span>
        {discounted && (
          <s className={`text-soft ${large ? 'text-[1rem]' : 'text-[0.78rem]'}`}>
            <span className="sr-only">Was </span>
            {formatRupees(price.originalTotal)}
          </s>
        )}
      </p>
      {discounted && (
        <p
          className={`mt-0.5 font-medium ${large ? 'text-[0.92rem]' : 'text-[0.74rem]'}`}
          style={{ color: 'color-mix(in srgb, var(--c-burgundy) 72%, transparent)' }}
        >
          {price.percentOff}% Off
        </p>
      )}
    </div>
  );
}
