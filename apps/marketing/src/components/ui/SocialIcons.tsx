// Round outlined icon links to the shop's profiles; lucide ships no brand marks, so each glyph is drawn here at one stroke weight.

const GLYPHS: Record<string, React.ReactNode> = {
  YouTube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.2 9.3v5.4l4.6-2.7z" fill="currentColor" stroke="none" />
    </>
  ),
  Instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  Facebook: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M13.2 21v-7.4h2.3l.4-2.7h-2.7V9.4c0-.8.3-1.3 1.4-1.3h1.4V5.7c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5v1.8H8.4v2.7h2.2V21" />
    </>
  ),
  X: (
    <>
      <path d="M4.5 4.5h4l11 15h-4z" />
      <path d="M19.2 4.5l-6.1 6.7M10.9 12.8l-6.1 6.7" />
    </>
  ),
  Blog: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <path d="M8 9.5a2 2 0 0 1 2-2h2.2a2 2 0 0 1 2 2v.6c0 .5.4.9.9.9h.4c.3 0 .5.2.5.5v2a3 3 0 0 1-3 3H10.5A2.5 2.5 0 0 1 8 14z" />
      <path d="M10.3 10.3h2.4M10.3 13.7h3.4" />
    </>
  ),
  Reddit: (
    <>
      <ellipse cx="12" cy="14.2" rx="7.5" ry="5.3" />
      <circle cx="18.4" cy="5.6" r="1.5" />
      <path d="M12 8.9l1.3-4.6 3.6.9" />
      <circle cx="9.3" cy="13.6" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="14.7" cy="13.6" r="0.9" fill="currentColor" stroke="none" />
      <path d="M9.6 16.4c1.4 1 3.4 1 4.8 0" />
    </>
  ),
};

export default function SocialIcons({ links, className = '' }: { links: { label: string; href: string }[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {links.map((l) => (
        <li key={l.label}>
          <a
            href={l.href}
            target="_blank"
            rel="noopener noreferrer me"
            aria-label={`Sakthi Chains on ${l.label}`}
            title={l.label}
            className="grid h-9 w-9 place-items-center rounded-full border border-current/35 opacity-85 transition-[opacity,border-color] duration-300 hover:border-current hover:opacity-100"
          >
            <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {GLYPHS[l.label]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
