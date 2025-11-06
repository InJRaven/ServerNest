import { SetMetadata } from '@nestjs/common';

type AppRole = 'admin' | 'manager' | 'mod' | 'guest';
interface AuthRequirement {
  roles?: AppRole[];
  superAdmin?: boolean;
  allowSuperAdminBypass?: boolean;
}
const AUTH_KEY = 'auth_req';
const Auth = (req: AuthRequirement = {}) =>
  SetMetadata(AUTH_KEY, {
    allowSuperAdminBypass: true,
    ...req,
  } as AuthRequirement);

export { type AppRole, AuthRequirement, AUTH_KEY, Auth };
