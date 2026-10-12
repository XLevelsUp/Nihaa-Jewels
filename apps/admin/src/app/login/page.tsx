import type { Metadata } from 'next';
import { Suspense } from 'react';

import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Sign in — Nihaa Jewels Admin',
  robots: { index: false, follow: false },
};

// Suspense is required: LoginClient reads ?next= via useSearchParams.
export default function LoginPage() {
  return (
    <Suspense>
      <LoginClient />
    </Suspense>
  );
}
