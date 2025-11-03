import { JwtAuthGuard } from '@/guard';
import { AppService } from '@/services/app';
import { Request } from 'express';
import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AdminRepository } from '@/model/repository';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly admins: AdminRepository,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getHello(@Req() req: Request) {
    const auth = req.auth;
    if (!auth) {
      throw new UnauthorizedException({ code: 'NO_AUTH' });
    }

    try {
      const admin = await this.admins.findById(auth.id);
      if (!admin) {
        throw new NotFoundException({
          code: 'ADMIN_NOT_FOUND',
          message: 'Admin not found',
        });
      }

      return this.appService.getHello({
        id: admin.id,
        username: admin.username,
        email: admin.email,
        firstName: admin.first_name,
        lastName: admin.last_name,
        occupation: admin.occupation,
        company: admin.company_name,
        phone: admin.phone,
        superAdmin: admin.is_super_admin,
      });
    } catch (err) {
      // Giữ nguyên các lỗi đã biết, wrap các lỗi còn lại
      if (
        err instanceof UnauthorizedException ||
        err instanceof NotFoundException
      ) {
        throw err;
      }
      throw new InternalServerErrorException({ code: 'GET_HELLO_FAILED' });
    }
  }
}
