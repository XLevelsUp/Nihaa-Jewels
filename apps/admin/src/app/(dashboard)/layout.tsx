import { redirect } from 'next/navigation';

import AdminShell from '@/components/AdminShell';
import { getCurrentUser } from '@/lib/supabase-auth';

// Middleware already redirects anonymous users; this is the second gate in case a route escapes the matcher.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return <AdminShell userEmail={user.email}>{children}</AdminShell>;
}
