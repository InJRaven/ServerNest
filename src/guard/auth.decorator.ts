import { SetMetadata } from '@nestjs/common';

export type AppRole = 'admin' | 'user' | 'mod' | 'guest';
export interface AuthRequirement {
  roles?: AppRole[];
  superAdmin?: boolean;
  allowSuperAdminBypass?: boolean;
}
export const AUTH_KEY = 'auth_req';
export const Auth = (req: AuthRequirement = {}) =>
  SetMetadata(AUTH_KEY, {
    allowSuperAdminBypass: true,
    ...req,
  } as AuthRequirement);
