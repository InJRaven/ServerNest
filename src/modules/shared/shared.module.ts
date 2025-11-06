import { Module } from '@nestjs/common';
import { TokenService, EntityVerifier } from '@/shared';

@Module({
  providers: [TokenService, EntityVerifier],
  exports: [TokenService, EntityVerifier],
})
export class SharedModule {}
