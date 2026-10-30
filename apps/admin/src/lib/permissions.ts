// The one place that decides who may do what: change a role list here and every server action and screen follows.

export type Role = 'admin' | 'manager';

export const ROLE_LABELS: Record<Role, string> = { admin: 'Admin', manager: 'Manager' };

export const PERMISSIONS = {
  'products.edit': ['admin', 'manager'],
  'products.publish': ['admin', 'manager'],
  'products.delete': ['admin'],
  'discounts.edit': ['admin', 'manager'],
  'categories.edit': ['admin', 'manager'],
  'rates.edit': ['admin'],
  'appointments.manage': ['admin', 'manager'],
  'staff.manage': ['admin'],
} as const satisfies Record<string, readonly Role[]>;

export type Permission = keyof typeof PERMISSIONS;

// Written as the thing being refused, for "Only an Admin can …" messages.
const ACTIONS: Record<Permission, string> = {
  'products.edit': 'edit products',
  'products.publish': 'publish products',
  'products.delete': 'delete or restore products',
  'discounts.edit': 'set discounts',
  'categories.edit': 'edit collections',
  'rates.edit': 'change gold rates',
  'appointments.manage': 'manage bookings',
  'staff.manage': 'manage staff',
};

export function can(role: Role | null | undefined, permission: Permission): boolean {
  return Boolean(role && (PERMISSIONS[permission] as readonly Role[]).includes(role));
}

export function deniedMessage(permission: Permission): string {
  const allowed = (PERMISSIONS[permission] as readonly Role[]).map((r) => ROLE_LABELS[r]).join(' or ');
  return `Only an ${allowed} can ${ACTIONS[permission]}.`;
}
