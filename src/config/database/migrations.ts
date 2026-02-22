import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { CoreEntities } from '@CoreEntities';
import { AdminEntities } from '@AdminEntities';
import { PublicEntities } from '@PublicEntities';
import { DatabaseConfig } from './database.config';

config();
const Migrations = new DataSource({
  ...DatabaseConfig(),
  entities: [...CoreEntities, ...AdminEntities, ...PublicEntities],
  migrations: ['src/database/migrations/**/*.ts'],
  synchronize: false,
});
export { Migrations };
