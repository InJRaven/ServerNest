import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
// import express from 'express';
import { Session, Database } from '@config';
import { AdminModule } from './modules/admin/admin.module';

async function bootstrap() {
  const server = await NestFactory.create(AdminModule);

  // const httpsOptions = {
  //   key: fs.readFileSync('localhost-key.pem'),
  //   cert: fs.readFileSync('localhost.pem'),
  // };
  server.setGlobalPrefix('api');

  server.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = process.env.CORS_ORIGIN?.split(',') ?? [];

      // allow non-browser requests (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-token'],
    exposedHeaders: ['authorization', 'x-refresh-token'],
  });

  server.use(cookieParser());

  // Session Init
  server.use(server.get(Session).getSessionMiddleware());

  // server.use(express.json()); // body-parser
  // server.use(express.urlencoded({ extended: false }));

  // Check Database and Schema
  await server.get(Database).checkConnection();
  await server.get(Database).checkSchema();

  const port = Number(process.env.PORT) || 3000;
  await server.listen(port, '0.0.0.0');

  console.log('🚀 HTTP Backend: http://localhost:3000');
}
void bootstrap();
