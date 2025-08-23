import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly sessionSecretKey: string;
  private readonly jwtSecretKey: string;

  constructor(private readonly configService: ConfigService) {
    this.sessionSecretKey =
      this.configService.get<string>('SESSION_SECRET_KEY') || '';
    this.jwtSecretKey = this.configService.get<string>('JWT_SECRET_KEY') || '';
  }
}
