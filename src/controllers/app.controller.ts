import { JwtAuthGuard } from '@/guard';
import { AppService } from '@/services/app';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getHello(@Req() req: Request) {
    return this.appService.getHello((req as any).user);
  }
}
