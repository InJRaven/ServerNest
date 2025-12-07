import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardsProvider } from '@guards';
import { ServerController } from '@modules/server/controllers';
import { AdminServiceProvider } from '@modules/server/services';
import { CoreMapper } from '@modules/core/mapper';
import { AdminRepositoryProvider } from '@repositories';
import { AdminEntitires } from '@entities';
import { ConfigServerModule } from '@modules/config.module';
import { CoreServiceProvier } from '@modules/core/services';
import { AdminMappers } from '@modules/server/mapper';

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
  controllers: ServerController,
  exports: [...AdminRepositoryProvider, ...AdminServiceProvider],
})
export class ServerModule {}
