import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    credentials: true,
    origin: true,
    maxAge: 3600, // One hour
  });

  await app.listen(3030, '0.0.0.0');
}

void bootstrap();
