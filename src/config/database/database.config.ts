import { ConfigService } from '@nestjs/config';

const DatabaseConfig = (configService?: ConfigService) => ({
  type: 'postgres' as const,
  host: configService?.get<string>('DB_HOST', 'localhost'),
  port: Number(configService?.get<string>('DB_PORT', '5432')),
  username: configService?.get<string>('DB_USER', ''),
  password: configService?.get<string>('DB_PASSWORD', ''),
  database: configService?.get<string>('DB_DATABASE', ''),
  schema: configService?.get<string>('DB_SCHEMA', 'public'),
});
export { DatabaseConfig };
