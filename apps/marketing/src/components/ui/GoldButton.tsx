'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface GoldButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: boolean;
  className?: string;
  id?: string;
}

const sizeClasses = {
  sm: 'px-6 py-2.5 text-xs',
  md: 'px-8 py-3.5 text-xs',
  lg: 'px-10 py-4 text-sm',
};

export default function GoldButton({
  children,
  href,
  onClick,
  variant = 'solid',
  size = 'md',
  icon = false,
  className = '',
  id,
}: GoldButtonProps) {
  const baseClass = `inline-flex items-center gap-2 uppercase tracking-widest font-medium transition-all duration-300 ${sizeClasses[size]}`;
  const variantClass = variant === 'solid' ? 'btn-gold-shimmer' : 'btn-gold-outline';
  const fullClass = `${baseClass} ${variantClass} ${className}`;

  const content = (
    <>
      {children}
      {icon && <ArrowRight size={14} strokeWidth={1.5} />}
    </>
  );

  if (href) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="inline-block"
      >
        <Link href={href} className={fullClass} id={id}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={fullClass}
      id={id}
    >
      {content}
    </motion.button>
  );
}
