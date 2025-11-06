import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardsProvider } from '@guards';
import { ServerController } from '@modules/server/controllers';
import { AdminServiceProvider } from '@modules/server/services';
import { AdminRepositoryProvider } from '@repositories';
import { AdminEntitires } from '@entities';
import { ConfigServerModule } from '@modules/config.module';

@Module({
  imports: [ConfigServerModule, TypeOrmModule.forFeature(AdminEntitires)],
  providers: [
    ...AdminRepositoryProvider,
    ...GuardsProvider,
    ...AdminServiceProvider,
  ],
  controllers: ServerController,
  exports: [...AdminRepositoryProvider, ...AdminServiceProvider],
})
export class ServerModule {}
