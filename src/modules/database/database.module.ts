import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfig } from '@/config';
import { modelRepository } from '@/model/repository';
import { UserEntity } from '@/model/entity';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: TypeORMConfig,
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [...modelRepository],
  exports: [TypeOrmModule, ...modelRepository],
})
export class DatabaseModule {}
