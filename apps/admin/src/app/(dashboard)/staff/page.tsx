import { redirect } from 'next/navigation';
import { Box, Typography } from '@mui/material';

import StaffManager from './StaffManager';
import { createAdminClient } from '@/lib/supabase-server';
import { getCurrentUser } from '@/lib/supabase-auth';
import { can, PERMISSIONS, ROLE_LABELS, type Permission } from '@/lib/permissions';
import type { StaffMember } from '@/app/actions/staff';

export const dynamic = 'force-dynamic';

// Plain-language names for the permission table shown to the Admin.
const PERMISSION_LABELS: Record<Permission, string> = {
  'products.edit': 'Add and edit products and photos',
  'products.publish': 'Publish products',
  'products.delete': 'Delete and restore products',
  'discounts.edit': 'Set discounts',
  'categories.edit': 'Edit collections',
  'rates.edit': 'Change gold rates',
  'appointments.manage': 'Handle bookings',
  'staff.manage': 'Manage staff',
};

export default async function StaffPage() {
  const user = await getCurrentUser();
  if (!user || !can(user.role, 'staff.manage')) redirect('/');

  const { data } = await createAdminClient().from('staff').select('user_id, email, role, created_at').order('created_at');
  const staff = (data ?? []) as StaffMember[];

  const matrix = (Object.keys(PERMISSIONS) as Permission[]).map((p) => ({
    label: PERMISSION_LABELS[p],
    roles: Object.keys(ROLE_LABELS).map((r) => (PERMISSIONS[p] as readonly string[]).includes(r)),
  }));

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h1">Staff</Typography>
        <Typography sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.9rem' }}>
          Who can sign in to the admin, and what each person can do.
        </Typography>
      </Box>

      <StaffManager staff={staff} currentUserId={user.id} matrix={matrix} roleNames={Object.values(ROLE_LABELS)} />
    </Box>
  );
}
