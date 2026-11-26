// Old Nihaa "Our Story" address; the Sakthi story lives on /about, so this sends visitors and Google there permanently.

import { permanentRedirect } from 'next/navigation';

export default function DescriptionPage() {
  permanentRedirect('/about');
}
