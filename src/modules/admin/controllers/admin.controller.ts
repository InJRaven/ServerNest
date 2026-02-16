import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthorizationGuard, JwtAuthGuard } from '@guards';
import { Auth, CurrentUser } from '@decorators';
import { AdminService } from '@AdminServices';
import { AdminDTO } from '@AdminDTOs';
import { Admin } from '@AdminEntities';
import { AuthUser } from '@interfaces';
@Controller('')
export class AdminController {
  constructor(private readonly admin_services: AdminService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Auth({
    roles: ['Admin', 'Manager', 'Moderator'],
    allowSuperAdminBypass: true,
  })
  async getUser(@CurrentUser() admin: AuthUser) {
    return await this.admin_services.getMe(admin);
  }

  @Post('/create-admin')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Auth({ roles: ['System Admin'], allowSuperAdminBypass: true })
  async createAdmin(@Body() data: AdminDTO, @CurrentUser() createdBy: Admin) {
    return await this.admin_services.createAdmin(data, createdBy);
  }
}
