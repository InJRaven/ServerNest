import { Module, Global } from '@nestjs/common';
import { RedisConfig, Session } from '@/config';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.key', '.env'],
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
  ],
  providers: [Session, RedisConfig],
  exports: [Session, RedisConfig],
})
export class SessionModule {}
