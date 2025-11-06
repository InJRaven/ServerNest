import { AdminController } from '@/controllers/admin';
import { AdminServiceProvider } from '@/services/admin';
import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: AdminController,
  providers: [...AdminServiceProvider],
  exports: [...AdminServiceProvider],
})
export class AdminModule {}
