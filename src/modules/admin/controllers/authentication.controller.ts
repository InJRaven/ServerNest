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
import { AuthenticationService } from '@admin/services';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly services: AuthenticationService) {}

  @Post('register')
  // @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterAdminDTO) {
    return await this.services.register(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: AdminLoginDTO, @Req() req: Request) {
    return await this.services.login(data, req);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    return await this.services.logout(req);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request) {
    return await this.services.refresh(req);
  }
}
