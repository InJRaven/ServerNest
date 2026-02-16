import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardModule } from '../setting/guard.module';

import { CoreServices } from '@CoreServices';
import { CoreMappers } from '@CoreMapper';
import { CoreEntities } from '@CoreEntities';
import { CoreControllers } from '@CoreControllers';
import { CoreRepositories } from '@CoreRepositories';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [AdminModule, GuardModule, TypeOrmModule.forFeature(CoreEntities)],
  providers: [...CoreRepositories, ...CoreServices, ...CoreMappers],
  controllers: [...CoreControllers],
  exports: [...CoreRepositories, ...CoreServices],
})
export class CoreControllersModule {}
