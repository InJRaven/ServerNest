import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';

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

const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export { type AppRole, AuthRequirement, CurrentUser, AUTH_KEY, Auth };
