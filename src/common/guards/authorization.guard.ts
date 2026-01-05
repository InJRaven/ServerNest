import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_KEY, AuthRequirement } from '@decorators';
import { LoggerUtil } from '@utils';
import { PermissionDeniedException } from '@exceptions';

@Injectable()
class AuthorizationGuard implements CanActivate {
  private readonly logger = new LoggerUtil(AuthorizationGuard.name);
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const startTime = this.logger.startTiming();
    this.logger.step(1, 'AuthorizationGuard Triggered');

    const reqAuth =
      this.reflector.getAllAndOverride<AuthRequirement>(AUTH_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || {};

    this.logger.step(2, 'Extracted Authorization', reqAuth);
    if (!reqAuth.roles && !reqAuth.superAdmin) {
      this.logger.step(3, 'No Authorization Required For This Route');
      const duration = this.logger.endTiming(
        startTime,
        'Authorization success (no restriction)',
      );

      this.logger.performance('AuthorizationGuard', duration);
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const admin = req.user;

    if (!admin) {
      this.logger.auth('PERMISSION_DENIED', 'UNKNOWN_USER');
      this.logger.validationError('auth', 'No Authenticated User Found');
      this.logger.error('Authorization Failed: req.user Is Undefined');

      const duration = this.logger.endTiming(
        startTime,
        'Authorization Failed (Missing User)',
      );
      this.logger.performance('AuthorizationGuard', duration);
      throw new PermissionDeniedException({
        code: 'NO_AUTH_USER',
        message: 'Missing Authenticated User In Request',
      });
    }

    const adminRole = admin.role;
    const isSuperAdmin = admin.isSuperAdmin === true;
    this.logger.step(3, 'Admin Context Loaded', { adminRole, isSuperAdmin });

    if (reqAuth.superAdmin) {
      this.logger.step(4, 'Checking Super Admin Requirement');
      if (isSuperAdmin) {
        this.logger.auth('LOGIN_SUCCESS', 'SUPER_ADMIN');
        const duration = this.logger.endTiming(
          startTime,
          'Authorization Success (superAdmin pass)',
        );
        this.logger.performance('AuthorizationGuard', duration);
        return true;
      }
      this.logger.auth('PERMISSION_DENIED', 'SUPER_ADMIN');
      this.logger.warn('User Lacks Super Admin Privilege');

      const duration = this.logger.endTiming(
        startTime,
        'Authorization failed (not super admin)',
      );
      this.logger.performance('AuthorizationGuard', duration);
      throw new PermissionDeniedException({
        code: 'SUPER_ADMIN_ONLY',
        message: 'This Resource Is Restricted To Super Admin',
      });
    }
    if (reqAuth.allowSuperAdminBypass !== false && isSuperAdmin) {
      this.logger.step(4, 'SuperAdmin bypass enabled');
      const duration = this.logger.endTiming(
        startTime,
        'Authorization success (superAdmin bypass)',
      );
      this.logger.performance('AuthorizationGuard', duration);
      return true;
    }

    if (reqAuth.roles && reqAuth.roles.length > 0) {
      this.logger.step(4, 'Checking role requirement', {
        requiredRoles: reqAuth.roles,
        adminRole,
      });
      if (reqAuth.roles.includes(adminRole)) {
        this.logger.operation('READ', 'Authorization', reqAuth);
        const duration = this.logger.endTiming(
          startTime,
          'Authorization success (role matched)',
        );
        this.logger.performance('AuthorizationGuard', duration);
        return true;
      }

      this.logger.auth('PERMISSION_DENIED', reqAuth.roles.join(', '));
      this.logger.warn('Role mismatch', {
        required: reqAuth.roles,
        got: adminRole,
      });

      const duration = this.logger.endTiming(
        startTime,
        'Authorization failed (role mismatch)',
      );
      this.logger.performance('AuthorizationGuard', duration);
      throw new PermissionDeniedException({
        code: 'INSUFFICIENT_ROLE',
        message: `Required roles: [${reqAuth.roles.join(', ')}], got: ${adminRole}`,
      });
    }

    const duration = this.logger.endTiming(
      startTime,
      'Authorization success (fallback allow)',
    );
    this.logger.performance('AuthorizationGuard', duration);
    return true;
  }
}
export { AuthorizationGuard };
