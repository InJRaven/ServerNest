import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CoreEntities } from '@CoreEntities';
import { AdminEntities } from '@AdminEntities';
import { PublicEntities } from '@PublicEntities';
import { DatabaseConfig } from './database.config';

const TypeORMConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  return {
    ...DatabaseConfig(configService),
    entities: [...CoreEntities, ...AdminEntities, ...PublicEntities],
    schema: configService.get('DB_SCHEMA'),
    migrations: ['src/database/migrations/**/*.ts'],
    synchronize: false,
    migrationsRun: false,
  };
};
export { TypeORMConfig };
