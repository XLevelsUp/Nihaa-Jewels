// Fills its positioned parent with the slot's photograph or silent looping video, or with a labelled placeholder at the same footprint so nothing shifts when the real image arrives.

import Image from 'next/image';
import { ImagePlus } from 'lucide-react';

import type { ResolvedSlot } from '@/constants/homepageImages';

const SHOW_PATHS = process.env.NODE_ENV !== 'production';

interface ImageSlotProps {
  slot: ResolvedSlot;
  sizes: string;
  priority?: boolean;
  className?: string;
}

export default function ImageSlot({ slot, sizes, priority = false, className = '' }: ImageSlotProps) {
  if (slot.src && /\.(webm|mp4)$/.test(slot.src)) {
    return (
      <video
        src={slot.src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        role="img"
        aria-label={slot.alt}
        className={`absolute inset-0 h-full w-full ${slot.fit === 'contain' ? 'object-contain' : 'object-cover'} ${className}`}
      />
    );
  }
  if (slot.src) {
    return (
      <Image
        src={slot.src}
        alt={slot.alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        className={`${slot.fit === 'contain' ? 'object-contain' : 'object-cover'} ${className}`}
      />
    );
  }

  return (
    <div role="img" aria-label={slot.alt || slot.label} className="image-slot absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
      <ImagePlus size={22} strokeWidth={1.25} aria-hidden="true" />
      <span className="image-slot-label">{slot.label}</span>
      <span className="image-slot-meta tabular-nums">
        {slot.ratio} &middot; {slot.size}
      </span>
      {SHOW_PATHS && (
        <span className="image-slot-meta max-w-[28ch] break-all opacity-80">
          {slot.hint ?? `public/images/home/${slot.file}.jpg`}
        </span>
      )}
    </div>
  );
}
