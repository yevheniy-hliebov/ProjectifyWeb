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

  app.enableCors({
    credentials: true,
    origin: 'http://localhost:3000',
    exposedHeaders: 'Authorization-Cookie',
  })

  const config = app.get(ConfigService)
  const port = config.get<number>('port');
  
  await app.listen(port);
  logger.log('http://localhost:' + port);
}
bootstrap();
