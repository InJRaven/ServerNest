import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { LoginDTO, RegisterDTO } from '@/model/dto';
import { UserRepository } from '@/model/repository';

@Injectable()
class AuthService {
  constructor(
    private readonly userModel: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  //   Create Access Token
  private createAccessToken(payload: object): string {
    return jwt.sign(
      payload,
      this.configService.get<string>('JWT_SECRET') || 'secret',
      {
        expiresIn: '30m',
      },
    );
  }
  //   Create Refresh Token
  private createRefreshToken(): string {
    return randomBytes(64).toString('hex');
  }

  async register(body: RegisterDTO) {
    console.log(body);
    const { username, email, password, ...rest } = body;

    const exitingEmail = await this.userModel.findByEmail(email);
    if (exitingEmail) {
      throw new BadRequestException('Username is already in use');
    }

    const exitingUserName = await this.userModel.findByUsername(username);
    if (exitingUserName) {
      throw new BadRequestException('User Name đã được sử dụng');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userModel.createUser({
      username,
      email,
      password: hashedPassword,
      ...rest,
    });

    return { message: 'Registration successful', userId: newUser.id };
  }

  async login(
    body: LoginDTO,
    req: Request,
  ): Promise<{ message: string; access_token: string; refresh_token: string }> {
    const { email, password } = body;
    const user = await this.userModel.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.roles,
      isSuperAdmin: user.is_super_admin,
    };

    const accessToken = this.createAccessToken(payload);
    const refreshToken = this.createRefreshToken();
    if (req.session) {
      req.session.refreshToken = refreshToken;
      req.session.userId = user.id;
    }
    return {
      message: 'Login successful',
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async logout(req: Request): Promise<{ message: string }> {
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
