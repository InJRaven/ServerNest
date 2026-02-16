import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { GuardsProvider } from '@guards';

@Module({
  imports: [AdminModule],
  providers: [...GuardsProvider],
  exports: [...GuardsProvider],
})
export class GuardModule {}
