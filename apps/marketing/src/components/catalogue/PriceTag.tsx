// Selling price display, or "Price on request" with optional booking actions when pricing is hidden.

import BookAppointmentButton from './BookAppointmentButton';
import { formatRupees, isPriceOnRequest, type PriceResult } from '@/lib/pricing';

interface PriceTagProps {
  price: PriceResult;
  size?: 'md' | 'lg';
  productId?: string | null;
  productName?: string;
  showActions?: boolean;
}

export default function PriceTag({ price, size = 'md', productId, productName, showActions = false }: PriceTagProps) {
  const large = size === 'lg';

  if (isPriceOnRequest(price)) {
    return (
      <div>
        <p className={`font-semibold ${large ? 'text-[1.4rem]' : 'text-[0.88rem]'}`} style={{ color: 'var(--c-burgundy)' }}>
          Price on request
        </p>
        {showActions && (
          <div className="mt-3">
            <BookAppointmentButton productId={productId} productName={productName} />
          </div>
        )}
      </div>
    );
  }

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
