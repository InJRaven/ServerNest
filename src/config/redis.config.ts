import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { Redis as RedisClient } from 'ioredis';

@Injectable()
class RedisConfig implements OnModuleDestroy {
  private readonly client: RedisClient;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('REDIS_HOST') ?? 'localhost';
    const port = this.config.get<number>('REDIS_PORT') ?? 6379;
    const password = this.config.get<string>('REDIS_PASSWORD') || undefined;
    const useTLS = this.config.get<boolean>('REDIS_TLS') === true;

    this.client = new Redis({
      host,
      port,
      password,
      tls: useTLS ? {} : undefined,
      // optional: lazyConnect: true,
      // retryStrategy: (times) => Math.min(times * 50, 2000),
    });

    this.client.on('connect', () => console.log('✅ Redis connected'));
    this.client.on('error', (err) => console.error('❌ Redis error:', err));
  }

  getClient(): RedisClient {
    return this.client;
  }

  async onModuleDestroy() {
    try {
      await this.client.quit();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (_) {}
  }
}
export { RedisConfig };
