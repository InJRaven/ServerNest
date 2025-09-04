import { Module } from '@nestjs/common';

import { Guards } from '@/guard';
import { AuthServices } from '@/services/auth';

import { AuthController } from '@/controllers/auth/auth.controller';
@Module({
  controllers: [AuthController],
  providers: [...AuthServices, ...Guards],
  exports: [...AuthServices, ...Guards],
})
export class AuthModule {}
