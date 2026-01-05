import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardsProvider } from '@guards';
import { ConfigServerModule } from '../config.module';
import { AdminServiceProvider } from '@AdminServices';
import { AdminMappers } from '@AdminMapper';
import { AdminControllers } from '@AdminControllers';

import { AdminEntities } from '@AdminEntities';
import { AdminRepositories } from '@AdminRepositories';
import { CoreServices } from '@CoreServices';
import { CoreMappers } from '@CoreMapper';

@Module({
  imports: [ConfigServerModule, TypeOrmModule.forFeature(AdminEntities)],
  providers: [
    ...AdminRepositories,
    ...GuardsProvider,
    ...CoreServices,
    ...AdminServiceProvider,
    ...CoreMappers,
    ...AdminMappers,
  ],
  controllers: AdminControllers,
  exports: [...AdminRepositories, ...AdminServiceProvider],
})
export class AdminModule {}
