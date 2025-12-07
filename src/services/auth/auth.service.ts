import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import bcrypt from 'bcrypt';
import { LoginDTO, RegisterDTO, ResendOTPDTO, VerifyEmailDTO } from '@DTO';

import { TokenService } from './token.service';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { EmailService } from './email.service';
import { AdminRepository } from '@repositories';
import { FindManyOptions } from 'typeorm';
import { AdminEntity } from '@entities';

@Injectable()
class AuthService {
  constructor(
    private readonly admins: AdminRepository,
    private readonly tokens: TokenService,
    private readonly emailService: EmailService,
  ) {}

  async register(body: RegisterDTO) {
    const { username, email, password, ...rest } = body;

    const exitingEmail = await this.admins.findOne({ where: { email } });
    if (exitingEmail) {
      throw new BadRequestException('Email is already in use');
    }

    const exitingAdminName = await this.admins.findOne({ where: { username } });
    if (exitingAdminName) {
      throw new BadRequestException('User Name đã được sử dụng');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.admins.create({
      username,
      email,
      password: hashedPassword,
      ...rest,
    });
    const otp = await this.tokens.createOTP(newUser.email);
    console.log(otp);
    await this.emailService.sendOTPEmail(email, otp);
    return { message: 'Registration successful', userId: newUser.id };
  }

  // async verifyEmail(body: VerifyEmailDTO) {
  //   const { email, otp } = body;
  //   const user = await this.admins.findOne({ where: { email } });
  //   if (!user) throw new BadRequestException('User does not exist');
  //   const isValid = await this.tokens.verifyOTP(user.email, otp);
  //   if (!isValid) throw new BadRequestException('Invalid or expired OTP');

  //   await this.admins.update({
  //     where: {
  //       id: user.id,
  //       email_verified: true,
  //     } as unknown as FindManyOptions<AdminEntity>,
  //   });
  //   await this.tokens.removeOTP(user.email);
  //   console.log(
  //     `[VerifyOTP] User ${email} has successfully verified their email.`,
  //   );
  //   return { message: 'Account verification successful' };
  // }

  async resendOTP(body: ResendOTPDTO) {
    const { email } = body;
    const user = await this.admins.findOne({ where: { email } });
    if (!user) throw new BadRequestException('User does not exist');

    if (user.email_verified) return { message: 'Account already verified.' };

    const isCooldown = await this.tokens.isOtpCooldown(user.email);
    if (isCooldown)
      throw new BadRequestException(
        'Please wait 60 seconds before requesting a new OTP.',
      );

    const otp = await this.tokens.createOTP(user.email);
    await this.emailService.sendOTPEmail(email, otp);

    await this.tokens.setOtpCooldown(user.id);

    console.log(`[ResendOTP] New OTP sent to ${email}`);

    return { message: 'A new OTP has been sent to your email.' };
  }
  async login(
    body: LoginDTO,
    req: Request,
  ): Promise<{ message: string; access_token: string; refresh_token: string }> {
    const { email, password } = body;
    const user = await this.admins.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.roles,
      isSuperAdmin: user.is_super_admin,
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

export { AuthService };
