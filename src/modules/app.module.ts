import { Module } from '@nestjs/common';
import { AppController } from '@/controllers/app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session, Database, TypeORMConfig } from '@/config';
import { services } from '@/services';
import { modelRepository } from '@/model/repository';
import { modeEntities } from '@/model/entity';

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
    TypeOrmModule.forFeature(modeEntities),
  ],
  controllers: [AppController],
  providers: [Session, Database, ...modelRepository, ...services],
})
export class AppModule {}
