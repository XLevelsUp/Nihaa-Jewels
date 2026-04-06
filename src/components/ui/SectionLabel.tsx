import { Typography, alpha } from '@mui/material';

interface SectionLabelProps {
  children: React.ReactNode;
  centered?: boolean;
  className?: string;
}

export default function SectionLabel({
  children,
  centered = false,
  className = '',
}: SectionLabelProps) {
  return (
    <Typography
      variant="overline"
      sx={{
        display: 'block',
        textAlign: centered ? 'center' : 'left',
        color: '#D4AF37',
        letterSpacing: '0.28em',
        fontWeight: 500,
        textTransform: 'uppercase',
        fontSize: '0.7rem',
        fontFamily: 'var(--font-inter), sans-serif',
        mb: 2
      }}
      className={className}
    >
      {children}
    </Typography>
  );
}
