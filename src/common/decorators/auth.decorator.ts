import { SetMetadata } from '@nestjs/common';

type AppRole =
  | 'System Admin'
  | 'Admin'
  | 'Analyst'
  | 'Manager'
  | 'Moderator'
  | 'Guest';
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
