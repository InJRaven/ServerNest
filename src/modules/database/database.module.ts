import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfig } from '@/config';
import { modelRepositoryProvider } from '@/model/repository';
import { AdminEntity, UserEntity } from '@/model/entity';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: TypeORMConfig,
    }),
    TypeOrmModule.forFeature([UserEntity, AdminEntity]),
  ],
  providers: [...modelRepositoryProvider],
  exports: [TypeOrmModule, ...modelRepositoryProvider],
})
export class DatabaseModule {}
