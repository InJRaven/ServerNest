import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AdminRepository } from '@repositories';
import { TokenService } from '@shared';

type AppRole = 'admin' | 'manager' | 'mod' | 'guest';

interface JwtPayload extends jwt.JwtPayload {
  userId: string;
  role: AppRole;
  isSuperAdmin?: boolean;
}

@Injectable()
class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly tokens: TokenService,
    private readonly admins: AdminRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse();

    const header = req.headers['authorization'];
    const refreshToken = req.headers['x-refresh-token'] || '';
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException({
        code: 'NO_TOKEN',
        message: 'Missing Bearer token',
      });
    }
    const token = header.slice(7);

    /** Check Token In Session */
    if (!req.session || req.session.accessToken !== token) {
      throw new UnauthorizedException({
        code: 'SESSION_TOKEN_MISMATCH',
        message: 'Access token does not match session',
      });
    }

    /** Check Token Blacklist */
    const isBlacklisted = await this.tokens.isTokenBlacklisted(
      token,
      'accessToken',
    );
    if (isBlacklisted) {
      throw new UnauthorizedException({
        code: 'TOKEN_BLACKLISTED',
        message: 'Access token is blacklisted',
      });
    }

    const jwtSecret = this.configService.get<string>('JWT_SECRET_KEY');
    if (!jwtSecret) throw new Error('JWT_SECRET_KEY missing');

    try {
      const decoded = this.tokens.decodedAccessToken(token) as JwtPayload;

      const admin = await this.admins.findOne({ where: { id: decoded.id } });
      if (!admin) {
        throw new UnauthorizedException({
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        });
      }
      req.auth = {
        id: admin.id,
        email: admin.email,
        roles: admin.roles,
        isSuperAdmin: admin.is_super_admin === true,
      };
      return true;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        if (!refreshToken || typeof refreshToken !== 'string') {
          throw new UnauthorizedException({
            code: 'NO_REFRESH_TOKEN',
            message: 'Refresh token mismatch, please login again.',
          });
        }

        /**  Check Refresh in blacklist */
        const isRefreshBlacklisted = await this.tokens.isTokenBlacklisted(
          refreshToken,
          'refreshToken',
        );
        if (isRefreshBlacklisted) {
          throw new UnauthorizedException({
            code: 'REFRESH_TOKEN_BLACKLISTED',
            message: 'Refresh token is blacklisted, please login again.',
          });
        }

        /** Check Access Token and Refresh Token in Redis */
        const oldTokens = await this.tokens.getTokens(req.sessionID);
        if (!oldTokens) {
          throw new UnauthorizedException({
            code: 'NO_SESSION_TOKENS',
            message: 'No tokens in session, please login again.',
          });
        }

        if (
          oldTokens.accessToken !== token &&
          oldTokens.refreshToken !== refreshToken
        ) {
          throw new UnauthorizedException({
            code: 'TOKEN_MISMATCH',
            message: 'Token pair mismatch, please login again.',
          });
        }

        /** Issue new tokens */
        const oldPayload = jwt.decode(token) as JwtPayload;
        const newAccessToken = this.tokens.createAccessToken({
          userId: oldPayload.userId,
          email: oldPayload.email,
          role: oldPayload.role,
          isSuperAdmin: oldPayload.isSuperAdmin,
        });
        const newRefreshToken = this.tokens.createRefreshToken();

        /** Save new token pair to Redis and update accessToken in Session */
        req.session.accessToken = newAccessToken;
        await this.tokens.saveToken(
          req.sessionID,
          newRefreshToken,
          newAccessToken,
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

        return true;
      }

      console.error('JWT validation error:', err);
      throw new UnauthorizedException({
        code: 'INVALID_TOKEN',
        message: 'Invalid or malformed token',
      });
    }
  }
}
export { JwtAuthGuard };
