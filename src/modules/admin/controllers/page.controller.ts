import { Request } from 'express';
import { JwtAuthGuard } from '@guards';
import { PageService } from '@AdminServices';
import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { AdminRepository } from '@repositories';
@Controller()
export class PageController {
  // constructor(
  //   private readonly service: PageService,
  //   private readonly repository: AdminRepository,
  // ) {}
  // @Get()
  // @UseGuards(JwtAuthGuard)
  // async getHello(@Req() req: Request) {
  //   const auth = req.auth;
  //   if (!auth) {
  //     throw new UnauthorizedException({ code: 'NO_AUTH' });
  //   }
  //   try {
  //     const admin = await this.repository.findOne({ where: { id: auth.id } });
  //     if (!admin) {
  //       throw new NotFoundException({
  //         code: 'ADMIN_NOT_FOUND',
  //         message: 'Admin not found',
  //       });
  //     }
  //     return this.service.getHello({
  //       id: admin.id,
  //       username: admin.username,
  //       email: admin.email,
  //       firstName: admin.first_name,
  //       lastName: admin.last_name,
  //       occupation: admin.occupation,
  //       company: admin.company_name,
  //       phone: admin.phone,
  //       superAdmin: admin.is_super_admin,
  //     });
  //   } catch (err) {
  //     // Giữ nguyên các lỗi đã biết, wrap các lỗi còn lại
  //     if (
  //       err instanceof UnauthorizedException ||
  //       err instanceof NotFoundException
  //     ) {
  //       throw err;
  //     }
  //     throw new InternalServerErrorException({ code: 'GET_HELLO_FAILED' });
  //   }
  // }
}
