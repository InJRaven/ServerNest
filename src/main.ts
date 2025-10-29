import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { AppModule } from '@/modules/app.module';
import { Session, Database } from '@/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json()); // body-parser
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Session Init
  app.use(app.get(Session).getSessionMiddleware());
  // Check Database
  await app.get(Database).checkConnection();

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
