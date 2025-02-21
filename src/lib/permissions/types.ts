export type Permission = 
  | 'agent:read'
  | 'agent:write'
  | 'agent:delete'
  | 'agent:execute'
  | 'team:read'
  | 'team:write'
  | 'team:invite'
  | 'analytics:read'
  | 'settings:write'
  | 'admin:full';

export type Role = 'admin' | 'manager' | 'agent' | 'viewer';

export interface UserPermissions {
  userId: string;
  role: Role;
  permissions: Permission[];
  teamId: string;
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: ['admin:full'],
  manager: [
    'agent:read',
    'agent:write',
    'agent:execute',
    'team:read',
    'team:write',
    'analytics:read',
  ],
  agent: [
    'agent:read',
    'agent:execute',
    'analytics:read',
  ],
  viewer: [
    'agent:read',
    'analytics:read',
  ],
}; 