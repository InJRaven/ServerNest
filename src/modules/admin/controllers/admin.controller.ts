import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AdminLoginDTO, RegisterAdminDTO } from '@DTO';
import { AdminService } from '@admin/services';
import { AuthorizationGuard, JwtAuthGuard } from '@guards';
import { Auth } from '@decorators';

@Controller('auth')
export class AdminController {
  constructor(private readonly services: AdminService) {}

  @Post('register')
  // @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterAdminDTO) {
    return await this.services.register(body);
  }

  @Post('login')
  // @HttpCode(HttpStatus.OK)
  async login(@Body() data: AdminLoginDTO, @Req() req: Request) {
    return await this.services.login(data, req);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    return await this.services.logout(req);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Auth({ roles: ['admin', 'manager', 'mod'] })
  async getUser(@Req() req: Request) {
    return await this.services.getUser(req);
  }
}
