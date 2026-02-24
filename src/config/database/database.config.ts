import { ConfigService } from '@nestjs/config';

const DatabaseConfig = (configService?: ConfigService) => ({
  type: 'postgres' as const,
  host: configService?.get<string>('DB_HOST') ?? process.env.DB_HOST,
  port: Number(
    configService?.get<string>('DB_PORT') ?? process.env.DB_PORT ?? 5432,
  ),
  username: configService?.get<string>('DB_USER') ?? process.env.DB_USER,
  password:
    configService?.get<string>('DB_PASSWORD') ?? process.env.DB_PASSWORD,
  database:
    configService?.get<string>('DB_DATABASE') ?? process.env.DB_DATABASE,
  schema:
    configService?.get<string>('DB_SCHEMA') ??
    process.env.DB_SCHEMA ??
    'public',
});

export { DatabaseConfig };
