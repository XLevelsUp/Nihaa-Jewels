'use client';

// Burgundy curtain that parts once per session on the homepage; the animation is pure CSS so it paints with the first HTML, and the layout's head script hides it for repeat visits.

import { useEffect } from 'react';
import Image from 'next/image';

const SEEN_KEY = 'sc-curtain-seen';
const OPEN_DONE_MS = 1600;

function markSeen() {
  document.documentElement.classList.add(SEEN_KEY);
}

export default function OpeningCurtain() {
  useEffect(() => {
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch {}
    const t = setTimeout(markSeen, OPEN_DONE_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="sc-curtain" aria-hidden="true" onClick={markSeen}>
      <div className="sc-curtain-panel sc-curtain-left" />
      <div className="sc-curtain-panel sc-curtain-right" />
      <div className="sc-curtain-mark">
        <Image src="/images/brand/logo-champagne.png" alt="" width={72} height={72} priority />
        <span>Sakthi Chains</span>
      </div>
    </div>
  );
}
