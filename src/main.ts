import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { useSwagger } from './app.swagger';

async function bootstrap() {
  const env = process.env.NODE_ENV;
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(cookieParser());

  // pipes
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // base routing
  app.setGlobalPrefix('api/v1');

  // swagger config
  if (env !== 'production') {
    await useSwagger(app);
  }

  await app.listen(3000);
}

bootstrap();
