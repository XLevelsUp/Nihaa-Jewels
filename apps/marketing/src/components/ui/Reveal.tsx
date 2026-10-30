'use client';

// Content settles up into place once as it enters view; under reduced motion it is simply there.

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';

const EASE = [0.22, 0.61, 0.36, 1] as const;

interface RevealProps extends HTMLMotionProps<'div'> {
  delay?: number;
  y?: number;
}

export default function Reveal({ delay = 0, y = 20, children, ...rest }: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <motion.div {...rest}>{children}</motion.div>;

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 1.1, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
