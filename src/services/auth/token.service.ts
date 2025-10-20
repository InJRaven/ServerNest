import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import { randomBytes, randomInt } from 'crypto';
import { RedisConfig } from '@/config';

@Injectable()
class TokenService {
  constructor(
    private readonly config: ConfigService,
    private readonly redisConfig: RedisConfig,
  ) {}

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

  async saveToken(id: string, refreshToken: string, accessToken: string) {
    const redisClient = this.redisConfig.getClient();
    await redisClient.set(
      `auth:session:${id}:tokens`,
      JSON.stringify({ accessToken, refreshToken }),
      'EX',
      60 * 60 * 24,
    );
  }

  async saveTokenToBlacklist(
    accessToken: string,
    refreshToken: string,
    exp: number,
  ) {
    const redisClient = this.redisConfig.getClient();
    if (exp > 0) {
      await redisClient.set(
        `blacklist:accessToken:${accessToken}`,
        'blacklisted',
        'EX',
        exp - Math.floor(Date.now() / 1000),
      );
      await redisClient.set(
        `blacklist:refreshToke:${refreshToken}`,
        'blacklisted',
        'EX',
        exp - Math.floor(Date.now() / 1000),
      );
    }
  }

  async isTokenBlacklisted(
    token: string,
    tokenType: 'accessToken' | 'refreshToken',
  ): Promise<boolean> {
    const redisClient = this.redisConfig.getClient();
    const blacklistStatus = await redisClient.get(
      `blacklist:${tokenType}:${token}`,
    );
    return blacklistStatus === 'blacklisted';
  }

  async getTokens(
    id: string,
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    const redisClient = this.redisConfig.getClient();
    const tokens = await redisClient.get(`auth:session:${id}:tokens`);
    if (!tokens) return null;
    return JSON.parse(tokens);
  }

  /** Create OTP */
  async createOTP(email: string): Promise<string> {
    const otp = randomInt(100000, 999999).toString();
    const redisClient = this.redisConfig.getClient();
    await redisClient.set(`otp:${email}`, otp, 'EX', 300);
    return otp;
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    const store = await this.redisConfig.getClient().get(`otp:${email}`);
    return store === otp;
  }
  async removeOTP(email: string) {
    await this.redisConfig.getClient().del(`otp:${email}`);
  }
  async setOtpCooldown(email: string): Promise<void> {
    const key = `otp_cooldown:${email}`;
    await this.redisConfig.getClient().set(key, '1', 'EX', 60);
  }
  async isOtpCooldown(email: string): Promise<boolean> {
    return (
      (await this.redisConfig.getClient().exists(`otp_cooldown:${email}`)) === 1
    );
  }
}
export { TokenService };
