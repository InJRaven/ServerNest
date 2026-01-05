import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AdminRepository } from '@AdminRepositories';
import { TokenService } from '@shared';
import { LoggerUtil } from '@utils';
import {
  InternalServerException,
  PermissionDeniedException,
  TokenExpiredException,
  TokenInvalidException,
} from '@exceptions';
import { AppRole } from '@decorators';

interface JwtPayload extends jwt.JwtPayload {
  userId: string;
  role: AppRole;
  isSuperAdmin?: boolean;
}

@Injectable()
class JwtAuthGuard implements CanActivate {
  private readonly logger = new LoggerUtil(JwtAuthGuard.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly tokens: TokenService,
    private readonly admins: AdminRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const startTime = this.logger.startTiming();
    this.logger.step(1, 'JwtAuthGuard triggered');

    const req = context.switchToHttp().getRequest<Request>();

    const header = req.headers.authorization;
    /** =========================
    /*  VALIDATE TOKEN HEADER
    /* ========================= */
    this.logger.step(2, 'Validating access token', {
      accessToken: !!header,
    });

    if (!header || !header.startsWith('Bearer ')) {
      this.logger.validationError(
        'authorization',
        'Missing Or Malformed Bearer Token',
      );
      this.logger.auth('PERMISSION_DENIED', 'UNKNOWN', 'Bearer Token');

      const duration = this.logger.endTiming(
        startTime,
        'JwtAuthGuard Failed (no access token)',
      );
      this.logger.performance('JwtAuthGuard', duration);
      throw new TokenInvalidException({
        code: 'NO_TOKEN',
        message: 'Missing Bearer Token',
      });
    }
    const accessToken = header.slice(7);

    /** =========================
    /*  BLACKLIST VALIDATION
    /* ========================= */
    this.logger.step(4, 'Checking blacklist');
    const isBlacklisted = await this.tokens.isTokenBlacklisted(
      accessToken,
      'accessToken',
    );
    if (isBlacklisted) {
      this.logger.auth('TOKEN_INVALID', 'UNKNOWN', 'Token Blacklisted');

      const duration = this.logger.endTiming(
        startTime,
        'JwtAuthGuard failed (blacklisted)',
      );
      this.logger.performance('JwtAuthGuard', duration);

      throw new TokenInvalidException({
        code: 'TOKEN_BLACKLISTED',
        message: 'Access Token Is Blacklisted',
      });
    }

    const jwtSecret = this.configService.get<string>('JWT_SECRET_KEY');
    if (!jwtSecret) throw new Error('JWT_SECRET_KEY missing');

    try {
      this.logger.step(5, 'Decoding access token');
      const decoded = this.tokens.decodedAccessToken(accessToken) as JwtPayload;

      this.logger.step(6, 'Fetching admin from database', {
        adminId: decoded.id,
      });
      const admin = await this.admins.findOne({
        where: { id: decoded.id },
        relations: {
          roleAssignments: {
            role: true,
          },
        },
      });
      if (!admin) {
        this.logger.auth('PERMISSION_DENIED', decoded.id, 'User Not Found');

        const duration = this.logger.endTiming(
          startTime,
          'JwtAuthGuard failed (admin not found)',
        );
        this.logger.performance('JwtAuthGuard', duration);

        throw new PermissionDeniedException({
          code: 'ADMIN_NOT_FOUND',
          message: 'Admin Not Found',
        });
      }
      const roles =
        admin.roleAssignments?.filter((a) => a.isActive && !a.revokedAt) || [];

      const role = roles.map((a) => a.role.name);
      const isSuperAdmin = roles.some((a) => a.role.isSuperAdmin);
      req.user = {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: role,
        isSuperAdmin: isSuperAdmin,
      };

      this.logger.auth('LOGIN_SUCCESS', admin.email);
      const duration = this.logger.endTiming(
        startTime,
        'JwtAuthGuard success (access token valid)',
      );
      this.logger.performance('JwtAuthGuard', duration);
      return true;
    } catch (err) {
      /** =========================
      /*  INVALID TOKEN (OTHER)
      /* ========================= */

      /** =========================
      /*  TOKEN EXPIRED CASE
      /* ========================= */
      if (err instanceof jwt.TokenExpiredError) {
        this.logger.error('Access Token Expired', err);
        throw new TokenExpiredException({
          code: 'ACCESS_TOKEN_EXPIRED',
          message: 'Access token expired, please send refresh token',
        });
      }

      if (err instanceof TokenInvalidException) {
        this.logger.error('JWT decode failed', err);
        throw new TokenInvalidException({
          code: 'INVALID_TOKEN',
          message: 'Invalid or malformed token',
        });
      }

      throw new InternalServerException('JwtAuth Failded', err, 'JwtAuthGuard');
    }
  }
}
export { JwtAuthGuard };
