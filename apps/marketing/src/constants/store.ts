// One source of truth for the shop: its single showroom at Town Hall, Coimbatore. The RS Puram (Mahalaksmi Complex) address and the 90477 number were not Sakthi's and were removed on 2026-11-26.

export const STORE = {
  name: 'Sakthi Chains',
  street: '291-292, Karuppa Goundar St',
  area: 'Town Hall',
  city: 'Coimbatore',
  state: 'Tamil Nadu',
  postcode: '641001',
  country: 'IN',
  // One number for calls and WhatsApp, so every button on the site reaches the same counter.
  phone: '+91 63740 08797',
  phoneHref: 'tel:+916374008797',
  phoneSchema: '+916374008797',
  whatsapp: '916374008797',
  whatsappDisplay: '+91 63740 08797',
  // Empty until Sakthi's own address is confirmed; pages hide the email line while this is blank.
  email: '' as string,
  hours: 'Mon–Sat: 10:00 AM – 9:00 PM',
  openingHoursSchema: 'Mo-Sa 10:00-21:00',
} as const;

export const STORE_ADDRESS_ONE_LINE = `${STORE.street}, ${STORE.area}, ${STORE.city}, ${STORE.state} ${STORE.postcode}`;

export const STORE_ADDRESS_LINES = [`${STORE.street},`, `${STORE.area}, ${STORE.city},`, `${STORE.state} ${STORE.postcode}`];

const MAPS_QUERY = encodeURIComponent(`Sakthi Chains, ${STORE_ADDRESS_ONE_LINE}`);

// Searched by street address, so directions land on the shop even before its Google listing carries the name.
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;
export const MAPS_EMBED_URL = `https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`;

export interface Showroom {
  id: string;
  name: string;
  street: string;
  area: string;
  postcode: string;
  address: string;
  phone: string;
  phoneHref: string;
  phoneSchema: string;
  hours: string;
  openingHoursSchema: string;
  mapsUrl: string;
  mapsEmbedUrl: string;
}

// Every page that lists an address or hours reads from here, as does the JSON-LD Google uses. Add an entry if a second showroom opens.
export const SHOWROOMS: Showroom[] = [
  {
    id: 'town-hall',
    name: 'Town Hall',
    street: STORE.street,
    area: STORE.area,
    postcode: STORE.postcode,
    address: STORE_ADDRESS_ONE_LINE,
    phone: STORE.phone,
    phoneHref: STORE.phoneHref,
    phoneSchema: STORE.phoneSchema,
    hours: STORE.hours,
    openingHoursSchema: STORE.openingHoursSchema,
    mapsUrl: MAPS_URL,
    mapsEmbedUrl: MAPS_EMBED_URL,
  },
];

// The public address Google, link previews and the sitemap use; every absolute URL on the site builds from this.
export const SITE_URL = 'https://sakthichains.com';

// The shop's official profiles; the footer links them and the JSON-LD lists them as sameAs so Google ties them to the shop.
export const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61594986967734' },
  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCiATVIrTZtVCyNoX9E55Z-w' },
  { label: 'X', href: 'https://x.com/sakthichainscbe' },
  { label: 'Blog', href: 'https://sakthichains.blogspot.com/' },
  { label: 'Reddit', href: 'https://www.reddit.com/user/sakthi_chains/' },
] as const;

// Server-only callers: the Instagram handle lives in INSTAGRAM_USERNAME so the feed and the links stay in step.
export function socialLinksWithInstagram(): { label: string; href: string }[] {
  const handle = (process.env.INSTAGRAM_USERNAME ?? '').replace(/^@/, '').trim();
  const instagram = handle ? [{ label: 'Instagram', href: `https://www.instagram.com/${handle}/` }] : [];
  return [...instagram, ...SOCIAL_LINKS];
}
