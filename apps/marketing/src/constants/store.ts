// One source of truth for the store. The address was previously duplicated across five
// files — including the JSON-LD Google reads — and two of them invented a second branch.

export const STORE = {
  name: 'Nihaa Jewels',
  complex: 'Mahalaksmi Complex',
  street: '23 D Chokkampudur Road',
  area: 'Krishna Nagar, RS Puram',
  city: 'Coimbatore',
  state: 'Tamil Nadu',
  postcode: '641001',
  country: 'IN',
  // One number for calls and WhatsApp. Six different numbers were in use across the
  // site, two of them malformed, so everything now reads from here.
  phone: '+91 90477 22299',
  phoneHref: 'tel:+919047722299',
  phoneSchema: '+919047722299',
  whatsapp: '919047722299',
  whatsappDisplay: '+91 90477 22299',
  email: 'support@nihaajewels.com',
  hours: 'Mon–Sat: 10:00 AM – 8:00 PM',
  openingHoursSchema: 'Mo-Sa 10:00-20:00',
  mapsUrl:
    'https://maps.google.com/?q=NIHAA+JEWELS+MAHALAKSMI+COMPLEX+23+D+CHOKKAMPUDUR+ROAD+KRISHNA+NAGAR+COIMBATORE',
} as const;

export const STORE_ADDRESS_LINES = [
  `${STORE.complex.toUpperCase()},`,
  `${STORE.street.toUpperCase()},`,
  `KRISHNA NAGAR, ${STORE.city.toUpperCase()}-${STORE.postcode}`,
  `RS Puram, ${STORE.state}`,
];

export const STORE_ADDRESS_ONE_LINE =
  `${STORE.complex}, ${STORE.street}, ${STORE.area}, ${STORE.city}, ${STORE.state} ${STORE.postcode}`;
