import { Module, Global } from '@nestjs/common';
import { Session } from '@/config';

@Global()
@Module({
  providers: [Session],
  exports: [Session],
})
export class SessionModule {}
