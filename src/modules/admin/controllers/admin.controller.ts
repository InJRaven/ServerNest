import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthorizationGuard, JwtAuthGuard } from '@guards';
import { Auth } from '@decorators';
import { AdminService } from '@AdminServices';
@Controller('')
export class AdminController {
  constructor(private readonly services: AdminService) {}
  @Get('me')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Auth({
    roles: ['Admin', 'Manager', 'Moderator'],
    allowSuperAdminBypass: true,
  })
  async getUser(@Req() req: Request) {
    return await this.services.getMe(req);
  }
}
