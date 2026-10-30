'use client';

// Full-bleed film hero in the Maison style: the video is the page, one thin-serif line and one quiet link sit low and centred, and both settle slowly as the visitor scrolls away.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Pause, Play } from 'lucide-react';

const EASE = [0.22, 0.61, 0.36, 1] as const;
const PORTRAIT_QUERY = '(max-aspect-ratio: 1/1)';

function curtainDelay() {
  if (typeof document === 'undefined') return 0;
  return document.documentElement.classList.contains('sc-curtain-seen') ? 0 : 1.2;
}

export default function StaticBrandHero() {
  const reduceMotion = useReducedMotion();
  const [playing, setPlaying] = useState(!reduceMotion);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [filmSrc, setFilmSrc] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const filmScale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);

  useEffect(() => {
    const portrait = window.matchMedia(PORTRAIT_QUERY);
    const pick = () => setFilmSrc(portrait.matches ? '/video/hero-mobile.webm' : '/video/hero-desktop.webm');
    pick();
    portrait.addEventListener('change', pick);
    return () => portrait.removeEventListener('change', pick);
  }, []);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 0.45], [0, -36]);

  useEffect(() => {
    if (!reduceMotion) return;
    videoRef.current?.pause();
    setPlaying(false);
  }, [reduceMotion]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const reveal = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 1.6, delay: curtainDelay() + delay, ease: EASE },
        };

  return (
    <section
      ref={sectionRef}
      className="relative isolate h-[100svh] min-h-[560px] w-full overflow-hidden"
      style={{ background: '#140608' }}
    >
      <motion.div className="absolute inset-0 -z-20" style={reduceMotion ? undefined : { scale: filmScale }}>
        <motion.div
          className="h-full w-full"
          initial={reduceMotion ? false : { scale: 1.03, opacity: 0 }}
          animate={reduceMotion ? undefined : { scale: 1, opacity: 1 }}
          transition={{ duration: 2.8, ease: EASE }}
        >
          {filmSrc && (
            <video
              key={filmSrc}
              ref={videoRef}
              src={filmSrc}
              autoPlay={!reduceMotion}
              muted
              loop
              playsInline
              preload="auto"
              aria-label="Sakthi Chains collection film"
              className="h-full w-full object-cover"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
          )}
        </motion.div>
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(20, 6, 8, 0.55) 0%, rgba(20, 6, 8, 0) 22%, rgba(20, 6, 8, 0) 50%, rgba(20, 6, 8, 0.78) 100%)',
        }}
      />

      <motion.div
        style={reduceMotion ? undefined : { opacity: copyOpacity, y: copyY }}
        className="container-page absolute inset-x-0 bottom-0 flex flex-col items-center pb-24 text-center md:pb-28"
      >
        <motion.p
          {...reveal(0)}
          className="text-[0.62rem] font-medium uppercase tracking-[0.42em] md:text-[0.68rem]"
          style={{ color: 'var(--c-champagne)' }}
        >
          Sakthi Chains &middot; Fine Gold Jewellery
        </motion.p>

        <motion.h1
          {...reveal(0.25)}
          className="mt-5"
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontWeight: 300,
            fontSize: 'clamp(2.6rem, 6.4vw, 5.6rem)',
            lineHeight: 1.02,
            letterSpacing: '0.01em',
            color: '#F7ECD9',
          }}
        >
          Pure gold, <em style={{ fontStyle: 'italic' }}>shaped by hand</em>
        </motion.h1>

        <motion.div {...reveal(0.6)} className="mt-9">
          <Link
            href="/collections"
            className="group inline-flex min-h-11 items-center gap-4 text-[0.66rem] font-medium uppercase tracking-[0.32em]"
            style={{ color: '#F7ECD9' }}
          >
            Discover the collection
            <span
              aria-hidden="true"
              className="h-px w-10 transition-[width] duration-700 ease-out group-hover:w-16"
              style={{ background: 'currentColor' }}
            />
          </Link>
        </motion.div>
      </motion.div>

      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block"
      >
        <span className="hero-scroll-line block h-[38px] w-px" style={{ background: 'linear-gradient(#F7ECD9, transparent)' }} />
      </div>

      <button
        type="button"
        onClick={togglePlayback}
        aria-label={playing ? 'Pause video' : 'Play video'}
        className="absolute bottom-6 right-4 z-10 grid h-10 w-10 place-items-center rounded-full border transition-colors duration-300 hover:bg-[rgba(247,236,217,0.12)] md:right-8"
        style={{ borderColor: 'rgba(247, 236, 217, 0.45)', color: '#F7ECD9' }}
      >
        {playing ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
      </button>
    </section>
  );
}
