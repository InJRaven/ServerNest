import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfig, ConfigProvider } from '@config';
import { SharedProvider } from '@shared';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.key', '.env'],
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: TypeORMConfig,
    }),
  ],
  providers: [...ConfigProvider, ...SharedProvider],
  exports: [...ConfigProvider, ...SharedProvider],
})
export class ConfigServerModule {}
