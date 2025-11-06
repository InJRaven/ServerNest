import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisConfig, Session, TypeORMConfig, Database } from '@config';
import { GlobalEntities } from '@entities';
import { GlobalRepositoriesProvider } from '@repositories';
import { EntityVerifier } from '@shared';

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
    TypeOrmModule.forFeature(GlobalEntities),
  ],
  providers: [
    Session,
    RedisConfig,
    Database,
    EntityVerifier,
    ...GlobalRepositoriesProvider,
  ],
  exports: [Session, RedisConfig, Database, ...GlobalRepositoriesProvider],
})
export class ConfigServerModule {}
