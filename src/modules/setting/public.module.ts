import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicControllers } from '@public/controllers';
import { PublicServices } from '@public/services';
import { PublicEntities } from '@PublicEntities';
import { PublicRepositories } from '@PublicRepositories';
import { MulterConfigModule } from './multer.module';

@Module({
  imports: [MulterConfigModule, TypeOrmModule.forFeature(PublicEntities)],
  providers: [...PublicRepositories, ...PublicServices],
  controllers: PublicControllers,
  exports: [...PublicRepositories, ...PublicServices],
})
export class PublicModule {}
