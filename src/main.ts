import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/modules/app.module';
import { Session, Database } from '@/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Session Init
  app.use(app.get(Session).getSessionMiddleware());
  // Check Database
  await app.get(Database).checkConnection();

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
