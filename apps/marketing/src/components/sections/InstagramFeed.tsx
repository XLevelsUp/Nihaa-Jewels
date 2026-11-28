// "Gallery wall" of the latest Instagram posts, fetched from Meta every half hour: a brand panel beside a staggered three-column wall on desktop, a swipeable strip on phones. Hidden on the live site whenever the feed is unavailable.

import Image from 'next/image';
import { Layers, Play } from 'lucide-react';

import Reveal from '@/components/ui/Reveal';
import { getInstagramFeed, type InstagramPost } from '@/lib/instagram';

const WALL_SIZE = 6;
const STRIP_SIZE = 9;

// Lucide no longer ships brand marks, so the Instagram glyph is drawn here.
function InstagramGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

const dateLabel = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

function firstLine(caption: string) {
  const line = caption.split('\n')[0].replace(/#[\p{L}\p{N}_]+/gu, '').trim();
  return line.length > 90 ? `${line.slice(0, 88).trimEnd()}…` : line;
}

function Tile({ post, sizes, className = '' }: { post: InstagramPost; sizes: string; className?: string }) {
  const text = firstLine(post.caption);
  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${text || 'Instagram post'}, ${dateLabel(post.postedAt)}. Opens Instagram.`}
      className={`group relative block overflow-hidden ${className}`}
      style={{ background: 'var(--c-icing)' }}
    >
      <Image
        src={post.imageUrl}
        alt={text || 'Sakthi Chains on Instagram'}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
      />
      {post.kind !== 'image' && (
        <span
          className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full"
          style={{ background: 'rgba(20, 6, 8, 0.45)', color: '#F7ECD9' }}
          aria-hidden="true"
        >
          {post.kind === 'video' ? <Play size={12} fill="currentColor" /> : <Layers size={13} />}
        </span>
      )}
      <span
        className="pointer-events-none absolute inset-0 flex flex-col justify-end p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{ background: 'linear-gradient(180deg, rgba(94, 0, 26, 0) 35%, rgba(94, 0, 26, 0.88) 100%)', color: '#F7ECD9' }}
        aria-hidden="true"
      >
        {text && <span className="line-clamp-3 text-[0.8rem] leading-snug">{text}</span>}
        <span className="mt-1.5 text-[0.62rem] uppercase tracking-[0.2em]" style={{ color: 'var(--c-champagne)' }}>
          {dateLabel(post.postedAt)}
        </span>
      </span>
    </a>
  );
}

export default async function InstagramFeed() {
  const { username, profileUrl, posts, problem } = await getInstagramFeed(STRIP_SIZE);

  if (posts.length === 0) {
    if (process.env.NODE_ENV === 'production') return null;
    // Development only: show where the section will sit and what is missing.
    return (
      <section aria-label="Instagram feed setup" className="surface-page pt-12 md:pt-20">
        <div className="container-wide">
          <div className="p-8 text-center" style={{ border: '1px dashed var(--c-border-firm)', background: 'var(--c-product-card)' }}>
            <p className="lux-eyebrow">Instagram section (visible in development only)</p>
            <p className="lux-body mx-auto mt-3 text-center text-[0.88rem]">{problem ?? 'Instagram returned no posts.'}</p>
          </div>
        </div>
      </section>
    );
  }

  const wall = posts.slice(0, WALL_SIZE);
  const columns = [0, 1, 2].map((c) => wall.filter((_, i) => i % 3 === c));
  const handle = username ? `@${username}` : 'Instagram';

  const follow = (
    <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="lux-button">
      <InstagramGlyph size={16} />
      Follow {handle}
    </a>
  );

  return (
    <section aria-labelledby="instagram-heading" className="surface-page overflow-hidden pt-16 md:pt-24">
      <div className="container-wide grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
        <Reveal className="lg:col-span-4">
          <p className="lux-eyebrow flex items-center gap-2">
            <InstagramGlyph size={14} />
            On Instagram
          </p>
          <h2 id="instagram-heading" className="lux-display mt-4 break-words" style={{ fontSize: 'clamp(2.1rem, 4vw, 3.4rem)' }}>
            <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--c-burgundy)]">
              {handle}
            </a>
          </h2>
          <p className="lux-body mt-4">
            New pieces as they leave the bench, behind the scenes at the showroom, and how our customers wear their gold, silver and diamond pieces.
          </p>
          <div className="mt-8 hidden lg:block">{follow}</div>
        </Reveal>

        {/* Desktop: three columns with the middle one dropped, so the posts hang like a gallery wall. */}
        <div className="hidden grid-cols-3 gap-4 lg:col-span-8 lg:grid">
          {columns.map((col, c) => (
            <div key={c} className={`flex flex-col gap-4 ${c === 1 ? 'translate-y-14' : ''}`}>
              {col.map((post, i) => (
                <Reveal key={post.id} delay={(c + i) * 0.08}>
                  <Tile post={post} sizes="(max-width: 1280px) 22vw, 300px" className="aspect-[4/5]" />
                </Reveal>
              ))}
            </div>
          ))}
        </div>

        {/* Phones and tablets: a swipeable strip that peeks past the edge, hinting there is more. */}
        <div className="lg:hidden">
          <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6">
            {posts.slice(0, STRIP_SIZE).map((post) => (
              <li key={post.id} className="w-[68%] shrink-0 snap-start sm:w-[40%]">
                <Tile post={post} sizes="(max-width: 640px) 68vw, 40vw" className="aspect-[4/5]" />
              </li>
            ))}
          </ul>
          <div className="mt-8">{follow}</div>
        </div>
      </div>
      <div className="hidden h-12 lg:block" aria-hidden="true" />
    </section>
  );
}
