import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { Session, Database } from '@config';
import { ServerModule } from '@modules/server/server.module';

async function bootstrap() {
  const server = await NestFactory.create(ServerModule);

  server.use(cors({ origin: true, credentials: true }));
  server.use(express.json()); // body-parser
  server.use(express.urlencoded({ extended: false }));
  server.use(cookieParser());

  // Session Init
  server.use(server.get(Session).getSessionMiddleware());
  // Check Database
  await server.get(Database).checkConnection();

  await server.listen(process.env.PORT ?? 3000);
}
void bootstrap();
