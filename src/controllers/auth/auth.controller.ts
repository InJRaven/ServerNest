import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '@/services/auth';
import {
  RegisterDTO,
  LoginDTO,
  VerifyEmailDTO,
  ResendOTPDTO,
} from '@/model/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDTO) {
    return await this.authService.register(body);
  }
  @Post('verify-email')
  async verifyEmail(@Body() body: VerifyEmailDTO) {
    return await this.authService.verifyEmail(body);
  }
  @Post('resend-otp')
  async resendOTP(@Body() body: ResendOTPDTO) {
    return await this.authService.resendOTP(body);
  }
  @Post('login')
  async login(@Body() body: LoginDTO, @Req() req: Request) {
    return await this.authService.login(body, req);
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    return await this.authService.logout(req);
  }
}
