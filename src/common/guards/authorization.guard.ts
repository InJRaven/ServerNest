import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_KEY, AuthRequirement } from '@decorators';

@Injectable()
class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const reqAuth =
      this.reflector.getAllAndOverride<AuthRequirement>(AUTH_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || {};

    if (!reqAuth.roles && !reqAuth.superAdmin) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException({
        code: 'NO_AUTH_USER',
        message: 'Missing authenticated user in request',
      });
    }
    const isSuperAdmin = user.isSuperAdmin === true;
    const userRole = user.roles;

    if (reqAuth.superAdmin) {
      if (isSuperAdmin) return true;
      throw new ForbiddenException({
        code: 'SUPER_ADMIN_ONLY',
        message: 'This resource is restricted to super admins',
      });
    }
    if (reqAuth.allowSuperAdminBypass !== false && isSuperAdmin) {
      return true;
    }
    if (reqAuth.roles && reqAuth.roles.length > 0) {
      if (reqAuth.roles.includes(userRole)) return true;

      throw new ForbiddenException({
        code: 'INSUFFICIENT_ROLE',
        message: `Required roles: [${reqAuth.roles.join(', ')}], got: ${userRole}`,
      });
    }
    return true;
  }
}
export { AuthorizationGuard };
