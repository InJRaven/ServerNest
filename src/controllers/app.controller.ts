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
import { UserRepository } from '@/model/repository';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly users: UserRepository,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getHello(@Req() req: Request) {
    const auth = req.auth;
    if (!auth) {
      throw new UnauthorizedException({ code: 'NO_AUTH' });
    }

    try {
      const user = await this.users.findById(auth.id);
      if (!user) {
        throw new NotFoundException({
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        });
      }

      return this.appService.getHello({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        occupation: user.occupation,
        company: user.company_name,
        phone: user.phone,
        role: user.roles,
        superAdmin: user.is_super_admin,
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
