
export type AdminRole = 'super_admin' | 'admin' | 'moderator';

export interface AdminPermission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface RolePermissions {
  role: AdminRole;
  permissions: AdminPermission[];
  description: string;
}

export const ADMIN_PERMISSIONS: RolePermissions[] = [
  {
    role: 'super_admin',
    permissions: [
      { resource: 'system', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'api_keys', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'logs', actions: ['read', 'delete'] },
      { resource: 'settings', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'analytics', actions: ['read'] },
    ],
    description: 'Full system control including infrastructure changes'
  },
  {
    role: 'admin',
    permissions: [
      { resource: 'users', actions: ['create', 'read', 'update'] },
      { resource: 'api_keys', actions: ['read', 'update'] },
      { resource: 'logs', actions: ['read'] },
      { resource: 'settings', actions: ['read', 'update'] },
      { resource: 'analytics', actions: ['read'] },
    ],
    description: 'Limited to app management, no infrastructure changes'
  },
  {
    role: 'moderator',
    permissions: [
      { resource: 'users', actions: ['read', 'update'] },
      { resource: 'logs', actions: ['read'] },
      { resource: 'analytics', actions: ['read'] },
    ],
    description: 'User management and monitoring only'
  }
];
