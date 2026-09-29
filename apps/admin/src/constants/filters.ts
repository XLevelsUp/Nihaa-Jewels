// Fixed lists so values cannot drift — free text let "wedding" and "Wedding" become
// two different values, and the public menu then offered filters matching nothing.

export const OCCASIONS = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'festive', label: 'Festive' },
  { value: 'daily-wear', label: 'Daily Wear' },
  { value: 'office', label: 'Office' },
  { value: 'gifting', label: 'Gifting' },
] as const;

// Single choice, not multi: "suits both" is what Unisex means, and a unisex piece
// is included in the women's and men's results on the public site.
export const GENDERS = [
  { value: 'women', label: 'Women' },
  { value: 'men', label: 'Men' },
  { value: 'unisex', label: 'Unisex — suits women and men' },
  { value: 'kids', label: 'Kids' },
] as const;
