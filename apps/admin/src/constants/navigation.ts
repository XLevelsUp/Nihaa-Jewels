// Add a section here and it appears in the sidebar — new admin areas should not need layout changes. `requires` hides an item from roles without that permission.

import type { Permission } from '@/lib/permissions';

export interface NavItem {
  label: string;
  href: string;
  icon: 'dashboard' | 'gem' | 'folder' | 'coins' | 'calendar' | 'article' | 'users';
  description?: string;
  comingSoon?: boolean;
  requires?: Permission;
}

export const ADMIN_NAVIGATION: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: 'dashboard' },
  { label: 'Products', href: '/products', icon: 'gem', description: 'Catalogue items' },
  { label: 'Categories', href: '/categories', icon: 'folder', description: 'Collections' },
  { label: 'Gold Rates', href: '/gold-rates', icon: 'coins', description: "Today's rate" },
  { label: 'Appointments', href: '/appointments', icon: 'calendar', description: 'Booking requests' },
  { label: 'Staff', href: '/staff', icon: 'users', description: 'Who can sign in', requires: 'staff.manage' },
  { label: 'Blog', href: '/blog', icon: 'article', description: 'Articles', comingSoon: true },
];
