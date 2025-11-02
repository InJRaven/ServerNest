import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { AdminLoginDTO, RegisterAdminDTO } from '@/model/dto';
import { AdminRepository } from '@/model/repository';
import { TokenService } from '@/shared';
@Injectable()
class AdminAuthService {
  constructor(
    private readonly repository: AdminRepository,
    private readonly tokens: TokenService,
  ) {}

  async login(
    body: AdminLoginDTO,
    req: Request,
  ): Promise<{ message: string; access_token: string; refresh_token: string }> {
    const { email, password } = body;
    const admin = await this.repository.findByEmail(email);
    if (!admin) throw new UnauthorizedException('Invalid email or password');

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    const payload = {
      userId: admin.id,
      email: admin.email,
      role: admin.roles,
      isSuperAdmin: admin.is_super_admin,
    };

    const accessToken = this.tokens.createAccessToken(payload);
    const refreshToken = this.tokens.createRefreshToken();

    if (req.session) {
      req.session.accessToken = accessToken;

      /** Save Token To Redis */
      await this.tokens.saveToken(req.sessionID, accessToken, refreshToken);
    }

    return {
      message: 'Login successful',
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async register(body: RegisterAdminDTO) {
    const { username, email, password, ...rest } = body;

    const exitingEmail = await this.repository.findByEmail(email);
    if (exitingEmail) {
      throw new BadRequestException('Email is already in use');
    }

    const exitingAdminName = await this.repository.findByName(username);
    if (exitingAdminName) {
      throw new BadRequestException('User Name đã được sử dụng');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await this.repository.createAdmin({
      username,
      email,
      password: hashedPassword,
      ...rest,
    });
    return { message: 'Registration successful', userId: newAdmin.id };
  }

  async logout(req: Request): Promise<{ message: string }> {
    const header = req.headers['authorization'];
    const refreshToken = req.header['x-refresh-token'] || '';
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException({
        code: 'NO_TOKEN',
        message: 'Missing Bearer token',
      });
    }
    const token = header.slice(7);
    try {
      const exp = (jwt.decode(token) as JwtPayload)?.exp;
      if (exp) {
        await this.tokens.saveTokenToBlacklist(token, refreshToken, exp);
      }
    } catch (error) {
      console.log('[logout] Blacklist step failed');
      console.error(error);
    }
    return new Promise((resolve, reject) => {
      if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            return reject(new BadRequestException('Failed to logout'));
          }
          resolve({ message: 'Logout successful' });
        });
      } else {
        resolve({ message: 'No active session' });
      }
    });
  }
}

export { AdminAuthService };
