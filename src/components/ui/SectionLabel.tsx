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
    <p
      className={`section-label ${centered ? 'text-center' : ''} ${className}`}
    >
      {children}
    </p>
  );
}
