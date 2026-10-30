// Every homepage photograph slot: drop a file named <file>.(webp|avif|jpg|jpeg|png|webm|mp4) into public/images/home/ and it replaces the placeholder; brief is what to shoot (gold only, no stones).

export interface ImageSlotSpec {
  file: string;
  label: string;
  alt: string;
  ratio: string;
  size: string;
  brief: string;
  fit?: 'cover' | 'contain';
  hint?: string;
}

export interface ResolvedSlot extends ImageSlotSpec {
  src: string | null;
}

export const HOME_SLOTS = {
  statementThread: {
    file: 'statement-thread',
    label: 'The thread',
    alt: 'A spool of fine gold wire being drawn by hand',
    ratio: '3:4',
    size: '1200 × 1600',
    brief: 'Macro of gold wire coming off a spool or through a draw plate, dark warm background.',
  },
  statementFinish: {
    file: 'statement-finish',
    label: 'The finish',
    alt: 'A finished gold choker resting on burgundy velvet in an antique carved wooden box',
    ratio: '4:5',
    size: '1200 × 1500',
    brief: 'A finished necklace worn at the collarbone, cropped tight, soft daylight.',
  },
  diptychLeft: {
    file: 'diptych-left',
    label: 'Campaign, left',
    alt: 'A woman in an ivory silk saree, face veiled by a pink lotus, wearing a temple gold necklace and jhumkas',
    ratio: '4:5',
    size: '1800 × 2250',
    brief: 'Portrait, ivory silk, filigree gold collar, warm window light, plain wall.',
  },
  diptychRight: {
    file: 'diptych-right',
    label: 'Campaign, right',
    alt: 'Temple gold Lakshmi necklace and pendants arranged with a clay pot, burgundy silk and a carved wooden panel',
    ratio: '4:5',
    size: '1800 × 2250',
    brief: 'Close crop of a hand and wrist, stacked plain-gold bangles, burgundy velvet ground.',
  },
  occasionBridal: {
    file: 'occasion-bridal',
    label: 'Bridal',
    alt: 'A bride in a red Kanchipuram silk saree wearing a temple gold choker, jhumkas, maang tikka and bangles',
    ratio: '1:1',
    size: '2000 × 2000',
    brief: 'Bride in silk with necklace, haram, jhumkas and vanki, all plain gold; face in the upper third.',
  },
  occasionTemple: {
    file: 'occasion-temple',
    label: 'Temple & Heritage',
    alt: 'A temple gold Lakshmi choker with coin and jhumka drops on a burgundy velvet bust',
    ratio: '1:1',
    size: '1600 × 1600',
    brief: 'Close study of temple-work gold (Lakshmi or peacock motif) on dark silk.',
  },
  occasionFestive: {
    file: 'occasion-festive',
    label: 'Festive',
    alt: 'A gold Lakshmi pendant chain lifted from a burgundy Sakthi Chains box beside a lit brass lamp',
    ratio: '1:1',
    size: '1600 × 1600',
    brief: 'Bangles and jhumkas by a lit kuthu vilakku, marigold petals, evening warmth.',
  },
  occasionEveryday: {
    file: 'occasion-everyday',
    label: 'Everyday',
    alt: 'A pair of small gold leaf stud earrings in a velvet box',
    ratio: '1:1',
    size: '1600 × 1600',
    brief: 'Light everyday gold worn in daily life: fine chain, studs, a single thin bangle.',
  },
  occasionFirstGold: {
    file: 'occasion-first-gold',
    label: 'First Gold',
    alt: "A baby's wrist wearing a fine gold bangle with a flower motif",
    ratio: '1:1',
    size: '1600 × 1600',
    brief: "Naming-ceremony gold: tiny bangles or a black-bead chain in a parent's palm.",
  },
  bandHeirloom: {
    file: 'band-heirloom',
    label: 'Heirloom campaign',
    alt: 'A mother embracing her daughter, a bride in red silk wearing a temple gold choker and long Lakshmi haram',
    ratio: '16:9',
    size: '2400 × 1350',
    brief: 'A mother fastening a gold necklace on her daughter; faces in the upper third, text sits bottom-left.',
  },
  wornHer: {
    file: 'worn-her',
    label: 'For Her',
    alt: 'A woman veiled in red silk wearing a temple gold Lakshmi necklace and jhumkas',
    ratio: '2:3',
    size: '1200 × 1800',
    brief: 'Three-quarter portrait, silk saree, layered gold necklaces and bangles.',
  },
  wornHim: {
    file: 'worn-him',
    label: 'For Him',
    alt: 'A man in an ivory brocade sherwani wearing a gold chain, a gold signet ring and a gold bracelet',
    ratio: '2:3',
    size: '1200 × 1800',
    brief: 'Three-quarter portrait, cream kurta, heavy gold chain and plain kada.',
  },
  wornKids: {
    file: 'worn-kids',
    label: 'For the Little Ones',
    alt: 'A young girl peeking from behind an ivory curtain, wearing a gold choker, jhumkas, nose ring and maang tikka',
    ratio: '2:3',
    size: '1200 × 1800',
    brief: 'Child portrait, fine gold chain and small bangles, soft festive light.',
  },
  atelierBench: {
    file: 'atelier-bench',
    label: 'Atelier, the bench',
    alt: 'A goldsmith shaping a gold necklace by hand at a wooden workbench',
    ratio: '4:5',
    size: '1600 × 2000',
    brief: 'Goldsmith at the bench chasing or soldering a piece; hands and tools in focus, face out of frame.',
  },
  atelierDetail: {
    file: 'atelier-detail',
    label: 'Atelier, the finish',
    alt: 'A finished temple gold Lakshmi necklace draped on burgundy velvet beside a brass peacock lamp',
    ratio: '4:5',
    size: '1000 × 1250',
    brief: 'A finished piece worn on the hand, plain ground.',
  },
  detailLarge: {
    file: 'detail-1',
    label: 'Up close, temple work',
    alt: 'Close detail of a temple gold Lakshmi necklace with peacock medallions on maroon silk',
    ratio: '1:1',
    size: '1800 × 1800',
    brief: 'Extreme macro of chased temple work or granulation on a pendant.',
  },
  detailA: {
    file: 'detail-2',
    label: 'Up close, hallmark',
    alt: 'A temple gold peacock bangle showing the BIS 22K 916 hallmark inside',
    ratio: '1:1',
    size: '1000 × 1000',
    brief: 'Macro of the BIS 916 hallmark inside a bangle.',
  },
  detailB: {
    file: 'detail-3',
    label: 'Up close, jhumkas',
    alt: 'A pair of temple gold Lakshmi jhumkas with peacock and lotus work',
    ratio: '1:1',
    size: '1000 × 1000',
    brief: 'Macro of a pair of temple jhumkas on silk.',
  },
  detailTall: {
    file: 'detail-4',
    label: 'Up close, worn',
    alt: 'A woman in red silk wearing a temple gold necklace, jhumka and matching ring',
    ratio: '1:2',
    size: '1000 × 2000',
    brief: 'A temple set worn at the ear, neck and hand, cropped tight, face out of frame.',
  },
  promise: {
    file: 'promise-bg',
    label: 'Promise background',
    alt: '',
    ratio: '16:9',
    size: '2400 × 1350',
    brief: 'Quiet texture: gold on dark velvet; it sits under a burgundy tint, so detail is barely seen.',
  },
  visitShowroom: {
    file: 'visit-showroom',
    label: 'The showroom',
    alt: 'Watercolour illustration of the Sakthi Chains storefront with a burgundy awning and carved wooden door',
    ratio: '4:3',
    size: '1600 × 1200',
    brief: 'Showroom interior or façade, warm evening light.',
    fit: 'contain',
  },
} satisfies Record<string, ImageSlotSpec>;

export type HomeSlotKey = keyof typeof HOME_SLOTS;
