import { CoreControllersModule } from '@core/core.module';
import { AdminModule } from './admin/admin.module';
import { ConfigServerModule } from './setting/config.module';
import { Module } from '@nestjs/common';
import { GuardModule } from './setting/guard.module';
import { PublicModule } from './setting/public.module';
import { MulterConfigModule } from './setting/multer.module';

@Module({
  imports: [
    ConfigServerModule,
    MulterConfigModule,
    AdminModule,
    CoreControllersModule,
    GuardModule,
    PublicModule,
  ],
})
export class ServerModule {}
