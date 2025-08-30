import { Module } from '@nestjs/common';
import { AppController } from '@/controllers/app.controller';
import { ConfigModule } from '@nestjs/config';
import { Database } from '@/config';

import { modelRepository } from '@/model/repository';

import { AppServices } from '@/services/app';
import { AuthServices } from '@/services/auth';
import { OtherServices } from '@/services/other';
import { SessionModule } from '@/modules/session/session.module';
import { DatabaseModule } from '@/modules/database/database.module';
import { AuthModule } from '@/modules/auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.key', '.env'],
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    DatabaseModule,
    SessionModule,
    AuthModule,
  ],
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
