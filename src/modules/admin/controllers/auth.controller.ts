import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AdminLoginDTO, RegisterAdminDTO } from '@DTO';
import { AdminAuthService } from '@modules/server/services';

@Controller('admin/auth')
export class AuthController {
  constructor(private readonly services: AdminAuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterAdminDTO) {
    return await this.services.register(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: AdminLoginDTO, @Req() req: Request) {
    return await this.services.login(body, req);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    return await this.services.logout(req);
  }
}
