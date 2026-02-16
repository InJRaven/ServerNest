import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminServiceProvider } from '@AdminServices';
import { AdminMappers } from '@AdminMapper';
import { AdminControllers } from '@AdminControllers';

import { AdminEntities } from '@AdminEntities';
import { AdminRepositories } from '@AdminRepositories';

@Module({
  imports: [TypeOrmModule.forFeature(AdminEntities)],
  providers: [...AdminRepositories, ...AdminServiceProvider, ...AdminMappers],
  controllers: AdminControllers,
  exports: [...AdminRepositories, ...AdminServiceProvider],
})
export class AdminModule {}
