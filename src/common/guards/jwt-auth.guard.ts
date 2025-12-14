import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AdminRepository } from '@repositories';
import { TokenService } from '@shared';
import { LoggerUtil } from '@utils';
import {
  PermissionDeniedException,
  TokenExpiredException,
  TokenInvalidException,
} from '@exceptions';

type AppRole = 'admin' | 'manager' | 'mod' | 'guest';

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
    const res = context.switchToHttp().getResponse();

    const header = req.headers.authorization;
    const refreshToken = req.headers['x-refresh-token'] || '';

    console.log(refreshToken);
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
      const admin = await this.admins.findOne({ where: { id: decoded.id } });
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
      req.auth = {
        id: admin.id,
        email: admin.email,
        roles: admin.roles,
        isSuperAdmin: admin.is_super_admin === true,
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
      /*  TOKEN EXPIRED CASE
      /* ========================= */
      if (!(err instanceof jwt.TokenExpiredError))
        throw new TokenInvalidException({ code: 'INVALID_TOKEN' });

      if (err instanceof jwt.TokenExpiredError) {
        this.logger.auth('TOKEN_EXPIRED', 'UNKNOWN');
        if (!refreshToken || typeof refreshToken !== 'string') {
          this.logger.validationError('refreshToken', 'Missing refresh token');

          const duration = this.logger.endTiming(
            startTime,
            'Authorization failed (no refresh token)',
          );
          this.logger.performance('JwtAuthGuard', duration);

          throw new TokenExpiredException({
            code: 'ACCESS_TOKEN_EXPIRED',
            message: 'Access token expired, please send refresh token',
          });
        }

        /** =========================
        /*  CHECK REFRESH TOKEN STATUS  
        /* ========================= */
        this.logger.step(7, 'Checking refresh token blacklist');
        const isRefreshBlacklisted = await this.tokens.isTokenBlacklisted(
          refreshToken,
          'refreshToken',
        );
        if (isRefreshBlacklisted) {
          this.logger.auth(
            'TOKEN_INVALID',
            'UNKNOWN',
            'Refresh Token Blacklisted',
          );

          const duration = this.logger.endTiming(
            startTime,
            'Authorization failed (refresh blacklisted)',
          );
          this.logger.performance('JwtAuthGuard', duration);

          throw new TokenInvalidException({
            code: 'REFRESH_TOKEN_BLACKLISTED',
            message: 'Refresh token is blacklisted, please login again.',
          });
        }

        /** =========================
        /*  VALIDATE TOKEN PAIR IN REDIS 
        /* ========================= */
        this.logger.step(8, 'Fetching session token pair from Redis');
        const oldTokens = await this.tokens.getTokens(req.sessionID);
        console.log('REFRESH SID:', req.sessionID);
        if (!oldTokens) {
          this.logger.auth(
            'TOKEN_INVALID',
            'UNKNOWN',
            'Missing redis token pair',
          );

          const duration = this.logger.endTiming(
            startTime,
            'Authorization failed (no redis tokens)',
          );
          this.logger.performance('JwtAuthGuard', duration);

          throw new TokenInvalidException({
            code: 'NO_SESSION_TOKENS',
            message: 'No Tokens In Redis Session, Please Login Again.',
          });
        }

        if (
          oldTokens.accessToken !== accessToken ||
          oldTokens.refreshToken !== refreshToken
        ) {
          this.logger.auth('TOKEN_INVALID', 'UNKNOWN', 'Token Pair Mismatch');

          const duration = this.logger.endTiming(
            startTime,
            'Authorization failed (pair mismatch)',
          );
          this.logger.performance('JwtAuthGuard', duration);

          throw new TokenInvalidException({
            code: 'TOKEN_MISMATCH',
            message: 'Token pair mismatch, please login again.',
          });
        }

        /** =========================
        /*  ISSUE NEW TOKEN PAIR
        /* ========================= */
        this.logger.step(9, 'Issuing new token pair');

        const oldPayload = jwt.decode(accessToken) as JwtPayload;
        const newAccessToken = this.tokens.createAccessToken({
          userId: oldPayload.userId,
          email: oldPayload.email,
          role: oldPayload.role,
          isSuperAdmin: oldPayload.isSuperAdmin,
        });
        const newRefreshToken = this.tokens.createRefreshToken();

        /** Save new token pair to Redis and update accessToken in Session */
        await this.tokens.saveToken(
          req.sessionID,
          newAccessToken,
          newRefreshToken,
        );

        /** Set new token pair to header */
        res.setHeader('authorization', `Bearer ${newAccessToken}`);
        res.setHeader('x-refresh-token', newRefreshToken);

        req.auth = {
          id: oldPayload.userId,
          email: oldPayload.email,
          roles: oldPayload.role,
          isSuperAdmin: oldPayload.isSuperAdmin === true,
        };

        this.logger.operation('UPDATE', 'TokenPair', {
          sessionID: req.sessionID,
        });

        const duration = this.logger.endTiming(
          startTime,
          'Authorization success (token refreshed)',
        );
        this.logger.performance('JwtAuthGuard', duration);

        return true;
      }

      /** =========================
      /*  INVALID TOKEN (OTHER)
      /* ========================= */
      this.logger.error('JWT decode failed', err);

      const duration = this.logger.endTiming(
        startTime,
        'Authorization failed (invalid token)',
      );
      this.logger.performance('JwtAuthGuard', duration);

      throw new TokenInvalidException({
        code: 'INVALID_TOKEN',
        message: 'Invalid or malformed token',
      });
    }
  }
}
export { JwtAuthGuard };
