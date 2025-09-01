import { Module } from '@nestjs/common';
import { AppController } from '@/controllers/app.controller';
import { Database } from '@/config';

import { modelRepository } from '@/model/repository';

import { AppServices } from '@/services/app';
import { AuthServices } from '@/services/auth';
import { OtherServices } from '@/services/other';
import { SessionModule } from '@/modules/session/session.module';
import { DatabaseModule } from '@/modules/database/database.module';
import { AuthModule } from '@/modules/auth/auth.module';
@Module({
  imports: [DatabaseModule, SessionModule, AuthModule],
  controllers: [AppController],
  providers: [
    Database,
    ...modelRepository,
    ...AppServices,
    ...AuthServices,
    ...OtherServices,
  ],
})
export class AppModule {}
