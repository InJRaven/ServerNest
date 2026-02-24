import { Database } from './database/database';
import { TypeORMConfig } from './database/typeorm.config';
import { RedisConfig } from './redis.config';
import { Session } from './session.config';
import { MigrationVerifier } from './migration-verifier';

export const ConfigProvider = [
  RedisConfig,
  Session,
  MigrationVerifier,
  Database,
];
export { RedisConfig, Session, MigrationVerifier, Database, TypeORMConfig };
