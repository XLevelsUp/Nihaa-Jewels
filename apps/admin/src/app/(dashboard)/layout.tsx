import { redirect } from 'next/navigation';

import AdminShell from '@/components/AdminShell';
import NoAccess from '@/components/NoAccess';
import { getCurrentUser, getSessionUser } from '@/lib/supabase-auth';

// Middleware already redirects anonymous users; this is the second gate, and the one that turns away a valid login that is not on the staff list.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionUser();
  if (!session) redirect('/login');

  const user = await getCurrentUser();
  if (!user) return <NoAccess email={session.email} />;

  return (
    <AdminShell userEmail={user.email} userRole={user.role}>
      {children}
    </AdminShell>
  );
}
