import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AdminAuthService } from '@/services/admin';
import { AdminLoginDTO, RegisterAdminDTO } from '@/model/dto';

@Controller('admin/auth')
class AuthController {
  constructor(private readonly services: AdminAuthService) {}

  @Post('register')
  async register(@Body() body: RegisterAdminDTO) {
    return await this.services.register(body);
  }

  @Post('login')
  async login(@Body() body: AdminLoginDTO, @Req() req: Request) {
    return await this.services.login(body, req);
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    return await this.services.logout(req);
  }
}
export { AuthController };
