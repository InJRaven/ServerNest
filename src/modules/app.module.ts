import { Module } from '@nestjs/common';
import { AppController } from '@/controllers/app.controller';
import { Database } from '@/config';

import { modelRepositoryProvider } from '@/model/repository';
import { AdminServiceProvider } from '@/services/admin';

import { AppServices } from '@/services/app';
import { AuthServices } from '@/services/auth';
import { SharedProvider } from '@/shared';
import { SessionModule } from '@/modules/session/session.module';
import { DatabaseModule } from '@/modules/database/database.module';
import { AuthModule } from '@/modules/auth/auth.module';
@Module({
  imports: [DatabaseModule, SessionModule, AuthModule],
  controllers: [AppController],
  providers: [
    Database,
    ...modelRepositoryProvider,
    ...AdminServiceProvider,
    ...AppServices,
    ...AuthServices,
    ...SharedProvider,
  ],
})
export class AppModule {}
