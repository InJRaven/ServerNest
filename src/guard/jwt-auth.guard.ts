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

type AppRole = 'admin' | 'user' | 'mod' | 'guest';

interface JwtPayload {
  userId: string;
  email: string;
  role: AppRole;
  isSuperAdmin?: boolean;
}
@Injectable()
class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
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
    try {
      const decoded = jwt.verify(
        token,
        this.configService.get<string>('JWT_SECRET') || 'secret',
        { ignoreExpiration: true },
      ) as JwtPayload;

      const user = await this.users.findById(decoded.userId);
      if (!user) {
        throw new UnauthorizedException({
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        });
      }
      req.user = {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
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
