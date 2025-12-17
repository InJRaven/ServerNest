import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AdminService } from '@admin/services';
import { AuthorizationGuard, JwtAuthGuard } from '@guards';
import { Auth } from '@decorators';
@Controller('')
export class AdminController {
  constructor(private readonly services: AdminService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Auth({ roles: ['admin', 'manager', 'mod'] })
  async getUser(@Req() req: Request) {
    return await this.services.getUser(req);
  }
}
