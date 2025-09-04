import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { UserRepository } from '@/model/repository';
import { TokenService } from '@/services/auth';

type AppRole = 'admin' | 'user' | 'mod' | 'guest';

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
    private readonly users: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const header = req.headers['authorization'];

    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException({
        code: 'NO_TOKEN',
        message: 'Missing Bearer token',
      });
    }
    const token = header.slice(7);
    const jwtSecret = this.configService.get<string>('JWT_SECRET_KEY');
    if (!jwtSecret) throw new Error('JWT_SECRET_KEY missing');
    try {
      const decoded = this.tokens.decodedAccessToken(token) as JwtPayload;

      const user = await this.users.findById(decoded.userId);
      if (!user) {
        throw new UnauthorizedException({
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        });
      }
      req.auth = {
        id: user.id,
        email: user.email,
        roles: user.roles,
        isSuperAdmin: user.is_super_admin === true,
      };
      return true;
    } catch {
      throw new UnauthorizedException({
        code: 'INVALID_TOKEN',
        message: 'Invalid or malformed token',
      });
    }
  }
}
export { JwtAuthGuard };
