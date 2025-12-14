import session from 'express-session';
import connectRedis from 'connect-redis';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { RedisConfig } from './redis.config';

@Injectable()
class Session {
  private RedisStore: connectRedis.RedisStore;

  constructor(
    private readonly configService: ConfigService,
    private readonly redis: RedisConfig,
  ) {
    const RedisStore = connectRedis(session);
    this.RedisStore = new RedisStore({
      client: this.redis.getClient(),
      ttl: 60 * 60 * 24 * 7,
    });
  }

  getSessionMiddleware() {
    return session({
      store: this.RedisStore,
      secret: this.configService.get<string>('SESSION_SECRET_KEY') || '',
      resave: false,
      saveUninitialized: false,
      rolling: false,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        domain: 'localhost',
      },
    });
  }
}

export { Session };
