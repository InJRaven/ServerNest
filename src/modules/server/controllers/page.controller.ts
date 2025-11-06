import { Request } from 'express';
import { JwtAuthGuard } from '@guards';
import { PageService } from '@modules/server/services';
import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
<<<<<<< HEAD:src/modules/server/controllers/page.controller.ts
import { AdminRepository } from '@repositories';
=======
import { AdminRepository } from '@/model/repository';
>>>>>>> 3680c3843fdc2cb32eab1461de497a339411134b:src/controllers/app.controller.ts

@Controller()
export class PageController {
  constructor(
<<<<<<< HEAD:src/modules/server/controllers/page.controller.ts
    private readonly service: PageService,
    private readonly repository: AdminRepository,
=======
    private readonly appService: AppService,
    private readonly admins: AdminRepository,
>>>>>>> 3680c3843fdc2cb32eab1461de497a339411134b:src/controllers/app.controller.ts
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getHello(@Req() req: Request) {
    const auth = req.auth;
    if (!auth) {
      throw new UnauthorizedException({ code: 'NO_AUTH' });
    }

    try {
<<<<<<< HEAD:src/modules/server/controllers/page.controller.ts
      const admin = await this.repository.findById(auth.id);
=======
      const admin = await this.admins.findById(auth.id);
>>>>>>> 3680c3843fdc2cb32eab1461de497a339411134b:src/controllers/app.controller.ts
      if (!admin) {
        throw new NotFoundException({
          code: 'ADMIN_NOT_FOUND',
          message: 'Admin not found',
        });
      }

<<<<<<< HEAD:src/modules/server/controllers/page.controller.ts
      return this.service.getHello({
=======
      return this.appService.getHello({
>>>>>>> 3680c3843fdc2cb32eab1461de497a339411134b:src/controllers/app.controller.ts
        id: admin.id,
        username: admin.username,
        email: admin.email,
        firstName: admin.first_name,
        lastName: admin.last_name,
        occupation: admin.occupation,
        company: admin.company_name,
        phone: admin.phone,
<<<<<<< HEAD:src/modules/server/controllers/page.controller.ts
=======
        superAdmin: admin.is_super_admin,
>>>>>>> 3680c3843fdc2cb32eab1461de497a339411134b:src/controllers/app.controller.ts
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
