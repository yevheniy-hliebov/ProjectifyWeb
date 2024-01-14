import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './http-exception.filter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('NestApplication');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  const config = app.get(ConfigService)
  const port = config.get<number>('port');
  const front_url = config.get<string>('front_url');

  app.enableCors({
    credentials: true,
    origin: front_url,
    exposedHeaders: 'Authorization-Cookie',
  })

  await app.listen(port);
  logger.log('PORT: ' + port);
  logger.log('Front-end URL: ' + front_url);
}
bootstrap();
