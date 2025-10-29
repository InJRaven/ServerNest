import session from 'express-session';
import connectRedis from 'connect-redis';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { RedisConfig } from '@/config/redis.config';

@Injectable()
class Session {
  private RedisStore: connectRedis.RedisStore;

  constructor(
    private readonly configService: ConfigService,
    private readonly redis: RedisConfig,
  ) {
    const RedisStore = connectRedis(session);
    this.RedisStore = new RedisStore({ client: this.redis.getClient() });
  }

  getSessionMiddleware() {
    return session({
      store: this.RedisStore,
      secret: this.configService.get<string>('SESSION_SECRET_KEY') || '',
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      },
    });
  }
}

export { Session };
