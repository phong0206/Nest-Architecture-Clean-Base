import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { useSwagger } from './app.swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const env = process.env.NODE_ENV;
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'debug', 'verbose'],
  });
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

  await app.listen(3000).then(async () => {
    const url = await app.getUrl();
    logger.debug(`Your app is running on port ${3000}`);
    logger.debug(`Environment: ${env}`);
    logger.debug(`Documentation ${url}/api`);
  });
}

bootstrap();
