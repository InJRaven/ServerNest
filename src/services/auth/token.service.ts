import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

@Injectable()
class TokenService {
  constructor(private readonly config: ConfigService) {}

  createAccessToken(payload: object) {
    const jwtSecret = this.config.get<string>('JWT_SECRET_KEY');
    if (!jwtSecret) throw new Error('JWT_SECRET_KEY missing');
    const jti = randomBytes(16).toString('hex');
    return jwt.sign(payload, jwtSecret, {
      algorithm: 'HS256',
      expiresIn: '30m',
      audience: 'web',
      jwtid: jti,
    });
  }
  createRefreshToken(): string {
    return randomBytes(64).toString('hex');
  }

  decodedAccessToken(token: string) {
    const jwtSecret = this.config.get<string>('JWT_SECRET_KEY');
    if (!jwtSecret) throw new Error('JWT_SECRET_KEY missing');
    return jwt.verify(token, jwtSecret, {
      algorithms: ['HS256'],
      audience: 'web',
      clockTolerance: 5,
    });
  }
}
export { TokenService };
