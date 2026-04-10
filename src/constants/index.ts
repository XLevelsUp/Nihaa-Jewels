// Mega Navigation Configuration
export const MEGA_NAVIGATION = [
  {
    label: "All Jewellery",
    href: "/collections",
    icon: "gem",
    columns: [
      { title: "Category", items: ["Rings", "Bangles", "Bracelets", "Chains", "Earrings", "Pendants"] },
      { title: "Price", items: ["Below \u20B925K", "\u20B925K - \u20B950K", "\u20B950K - \u20B91L", "\u20B91L & Above"] },
      { title: "Occasion", items: ["Wedding", "Daily Wear", "Office Wear", "Festive"] },
    ]
  },
  {
    label: "Gold",
    href: "/collections/gold",
    icon: "sparkles",
    columns: [
      { title: "Purity", items: ["18k Gold", "22k Gold", "24k Gold"] },
      { title: "Category", items: ["Gold Rings", "Gold Chains", "Gold Bangles", "Gold Coins"] },
      { title: "Price", items: ["Below \u20B950K", "\u20B950K - \u20B92L", "\u20B92L & Above"] },
      { title: "Gender", items: ["Women", "Men", "Unisex"] },
    ]
  },
  {
    label: "Rings",
    href: "/collections/rings",
    icon: "ring",
    columns: [
      { title: "Category", items: ["All Rings", "Engagement Rings", "Couple Rings", "Bridal Rings", "Daily Wear Rings"] },
      { title: "Price", items: ["Below \u20B925K", "\u20B925K - \u20B950K", "\u20B950K - \u20B91L", "\u20B91L & Above"] },
      { title: "Occasion", items: ["Wedding", "Office", "Daily Wear", "Modern"] },
      { title: "Gender", items: ["Women", "Men", "Couple"] },
    ]
  },
  {
    label: "Earrings",
    href: "/collections/earrings",
    icon: "ear",
    columns: [
      { title: "Category", items: ["All Earrings", "Jhumkas", "Studs", "Drops", "Hoops"] },
      { title: "Price", items: ["Below \u20B925K", "\u20B925K - \u20B950K", "\u20B950K - \u20B91L", "\u20B91L & Above"] },
      { title: "Occasion", items: ["Wedding", "Daily Wear", "Festive"] },
      { title: "Gender", items: ["Women", "Kids"] },
    ]
  },
  {
    label: "Bangles",
    href: "/collections/bangles",
    icon: "bangle",
    columns: [
      { title: "Category", items: ["Gold Bangles", "Bridal Bangles", "Daily Wear Bangles", "Lightweight Bangles"] },
      { title: "Price", items: ["Below \u20B950K", "\u20B950K - \u20B91L", "\u20B91L & Above"] },
      { title: "Occasion", items: ["Wedding", "Daily Wear", "Festive"] },
    ]
  },
  {
    label: "Bracelets",
    href: "/collections/bracelets",
    icon: "bracelet",
    columns: [
      { title: "Category", items: ["Gold Bracelets", "Couple Bracelets", "Modern Bracelets", "Daily Wear Bracelets"] },
      { title: "Gender", items: ["Women", "Men", "Couple"] },
    ]
  },
  {
    label: "Wedding",
    href: "/collections/bridal",
    icon: "wedding",
    columns: [
      { title: "Category", items: ["Bridal Sets", "Wedding Rings", "Mangalsutras", "Bridal Bangles"] },
      { title: "Set Pieces", items: ["2-Piece Sets", "3-Piece Sets", "Complete Bridal Trousseau"] },
      { title: "Price", items: ["Below \u20B92L", "\u20B92L - \u20B95L", "\u20B95L & Above"] },
    ]
  },
  {
    label: "Daily Wear",
    href: "/collections/daily-wear",
    icon: "sparkle",
    columns: [
      { title: "Category", items: ["Daily Rings", "Daily Bangles", "Daily Bracelets", "Lightweight Jewellery"] },
      { title: "Occasion", items: ["Office", "Casual", "Everyday"] },
    ]
  },
  {
    label: "Gifting",
    href: "/collections/gifting",
    icon: "gift",
    columns: [
      { title: "Category", items: ["Birthday Gifts", "Anniversary Gifts", "Festival Gifts", "Special Gifts"] },
      { title: "Price", items: ["Below \u20B910K", "\u20B910K - \u20B925K", "\u20B925K - \u20B950K"] },
      { title: "Gender", items: ["Women", "Men", "Couple"] },
    ]
  }
];

// Showcase categories
export const SHOWCASE_ITEMS = [
  {
    id: "necklaces",
    label: "The Royal Nizam",
    subtitle: "Necklaces",
    description: "A tribute to regal heritage with intricate craftsmanship.",
    image:
      "/images/necklace1.webp",
    href: "/collections/necklaces",
    span: "col-span-1 row-span-1",
    badge: "Limited Edition"
  },
  {
    id: "rings",
    label: "Celestial Bands",
    subtitle: "Rings",
    description: "Ethereal gemstones capturing the essence of starlight.",
    image:
      "/images/rings2.webp",
    href: "/collections/rings",
    span: "col-span-1 row-span-1",
    badge: "New"
  },
  {
    id: "earrings",
    label: "Legacy Jhumkas",
    subtitle: "Earrings",
    description: "Timeless traditions woven in pure gold.",
    image:
      "/images/earring1.webp",
    href: "/collections/earrings",
    span: "col-span-1 row-span-1",
    badge: "Limited Edition"
  },
];

// Heritage stats
export const HERITAGE_STATS = [
  { value: "1986", label: "Est." },
  { value: "38+", label: "Years of Craftsmanship" },
  { value: "12K+", label: "Pieces Created" },
  { value: "4", label: "Generations" },
];

// Heritage text
export const HERITAGE_CONTENT = {
  eyebrow: "Our Story",
  quote: `"Jewellery is not decoration — it is a language spoken without words."`,
  body: `Founded in Coimbatore in 1986, Nihaa Jewels was born from a singular vision: to create pieces so exquisite they become heirlooms. Four generations of master goldsmiths have shaped our craft — each piece hand-forged, stone-set by trained artisans who treat their work as devotion.\n\nWe do not chase trends. We create timeless objects that carry meaning across decades.`,
  signature: "— The Nihaa Family",
};

// Social links
export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
  { label: "WhatsApp", href: "https://wa.me/9144228000000" },
];

// Collections Sub-menu
export const COLLECTIONS_SUBMENU = [
  { label: 'Rings',            href: '/collections/rings',     desc: 'Statement pieces in gold & diamond' },
  { label: 'Necklaces',        href: '/collections/necklaces', desc: 'Graceful layers for every occasion' },
  { label: 'Bridal Edit',      href: '/collections/bridal',    desc: 'Crafted for your forever moment' },
  { label: 'Temple Jewellery', href: '/collections/temple',    desc: 'Sacred heritage, modern form' },
  { label: 'Earrings',         href: '/collections/earrings',  desc: 'From studs to chandelier drops' },
];

export const ANNOUNCEMENT_ITEMS = [
  'Complimentary Insured Shipping Across India',
  'BIS Hallmarked Gold — 100% Purity',
  'IGI Certified Conflict-Free Diamonds',
  'Lifetime Exchange Policy',
];

// Footer nav columns
export const FOOTER_LINKS = [
  {
    heading: "Collections",
    links: [
      { label: "Rings", href: "/collections/rings" },
      { label: "Necklaces", href: "/collections/necklaces" },
      { label: "Bridal", href: "/collections/bridal" },
      { label: "Temple Jewellery", href: "/collections/temple" },
    ],
  },
  {
    heading: "Explore",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Bespoke Design", href: "/custom-design" },
      { label: "Gifting", href: "/gifting" },
      { label: "Store Locator", href: "/stores" },
      { label: "Care Guide", href: "/care-guide" },
    ],
  },
];
