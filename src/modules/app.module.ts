import { Module } from '@nestjs/common';
import { AppController } from '@/controller/app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session, Database, TypeORMConfig } from '@/config';
import { test } from '@/services';
import { User } from '@/model/schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.key', '.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: TypeORMConfig,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
  providers: [Session, Database, ...test],
})
export class AppModule {}
