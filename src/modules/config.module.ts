import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisConfig, Session, TypeORMConfig, Database } from '@config';
import { EntityVerifier } from '@shared';

import { CoreEntities } from '@CoreEntities';
import { CoreRepositories } from '@CoreRepositories';

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
    TypeOrmModule.forFeature(CoreEntities),
  ],
  providers: [
    Session,
    RedisConfig,
    Database,
    EntityVerifier,
    ...CoreRepositories,
  ],
  exports: [Session, RedisConfig, Database, ...CoreRepositories],
  // exports: [Session, RedisConfig, Database, ...CoreRepositories],
})
export class ConfigServerModule {}
