// Add a section here and it appears in the sidebar — new admin areas should not need layout changes.

export interface NavItem {
  label: string;
  href: string;
  icon: 'dashboard' | 'gem' | 'folder' | 'coins' | 'calendar' | 'article';
  description?: string;
  comingSoon?: boolean;
}

export const ADMIN_NAVIGATION: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: 'dashboard' },
  { label: 'Products', href: '/products', icon: 'gem', description: 'Catalogue items', comingSoon: true },
  { label: 'Categories', href: '/categories', icon: 'folder', description: 'Collections', comingSoon: true },
  { label: 'Gold Rates', href: '/gold-rates', icon: 'coins', description: "Today's rate" },
  { label: 'Appointments', href: '/appointments', icon: 'calendar', description: 'Booking requests', comingSoon: true },
  { label: 'Blog', href: '/blog', icon: 'article', description: 'Articles', comingSoon: true },
];
