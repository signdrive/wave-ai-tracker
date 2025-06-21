
export type AdminRole = 'admin' | 'moderator';

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
    role: 'admin',
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
    role: 'moderator',
    permissions: [
      { resource: 'users', actions: ['read', 'update'] },
      { resource: 'logs', actions: ['read'] },
      { resource: 'analytics', actions: ['read'] },
    ],
    description: 'User management and monitoring only'
  }
];
