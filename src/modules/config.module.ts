import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisConfig, Session, TypeORMConfig, Database } from '@config';
import { CoreEntities } from '@entities';
import { CoreRepositoriesProvider } from '@repositories';
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
    TypeOrmModule.forFeature(CoreEntities),
  ],
  providers: [
    Session,
    RedisConfig,
    Database,
    EntityVerifier,
    ...CoreRepositoriesProvider,
  ],
  exports: [Session, RedisConfig, Database, ...CoreRepositoriesProvider],
})
export class ConfigServerModule {}
