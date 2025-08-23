import session from 'express-session';
import connectRedis from 'connect-redis';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
class Session {
  private redisClient: Redis;
  private RedisStore: connectRedis.RedisStore;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('REDIS_HOST') || 'localhost';
    const port = this.configService.get<number>('REDIS_PORT') || 6379;
    const password =
      this.configService.get<string>('REDIS_PASSWORD') || undefined;
    const useTLS = this.configService.get<boolean>('REDIS_TLS') === true;

    console.log('🔧 Redis Config:', {
      host,
      port,
      password: password ? '[HIDDEN]' : '(none)',
      tls: useTLS,
    });

    this.redisClient = new Redis({
      host,
      port,
      password,
      tls: useTLS ? {} : undefined,
    });

    // Check connection status
    this.redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    this.redisClient.on('error', (err) => {
      console.error('❌ Redis connection error:', err);
    });

    const RedisStore = connectRedis(session);
    this.RedisStore = new RedisStore({ client: this.redisClient });
  }

  getSessionMiddleware() {
    return session({
      store: this.RedisStore,
      secret: this.configService.get<string>('SESSION_SECRET_KEY') || '',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      },
    });
  }
}

export { Session };
