import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '@/services/auth';

import { JwtAuthGuard, AuthorizationGuard } from '@/guard';
import { UserEntity } from '@/model/entity';
import { UserRepository } from '@/model/repository';

import { AuthController } from '@/controllers/auth/auth.controller';
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, JwtAuthGuard, AuthorizationGuard],
  exports: [JwtAuthGuard, AuthorizationGuard, UserRepository, TypeOrmModule],
})
export class AuthModule {}
