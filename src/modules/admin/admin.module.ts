import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardsProvider } from '@guards';
import { AdminRepositoryProvider } from '@repositories';
import { AdminEntitires } from '@entities';
import { ConfigServerModule } from '../config.module';
import { CoreServiceProvier } from '@core/services';
import { AdminServiceProvider } from '@admin/services';
import { AdminMappers } from '@admin/mapper';
import { AdminControllers } from '@admin/controllers';
import { CoreMapper } from '@core/mapper';

@Module({
  imports: [ConfigServerModule, TypeOrmModule.forFeature(AdminEntitires)],
  providers: [
    ...AdminRepositoryProvider,
    ...GuardsProvider,
    ...CoreServiceProvier,
    ...AdminServiceProvider,
    ...CoreMapper,
    ...AdminMappers,
  ],
  controllers: AdminControllers,
  exports: [...AdminRepositoryProvider, ...AdminServiceProvider],
})
export class AdminModule {}
