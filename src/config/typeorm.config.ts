import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CoreEntities } from '@CoreEntities';
import { AdminEntities } from '@AdminEntities';

const TypeORMConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: parseInt(configService.get('DB_PORT') ?? '5432', 10),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    entities: [...CoreEntities, ...AdminEntities],
    schema: configService.get('DB_SCHEMA'),
    synchronize: true,
  };
};
export { TypeORMConfig };
