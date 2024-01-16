import * as fs from 'fs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './http-exception.filter';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('NestApplication');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  const config = app.get(ConfigService)
  const port = config.get<number>('port');
  const front_url = config.get<string>('front_url');

  const existAPISwaggerJson = fs.existsSync('./api-swagger.json')
  if (existAPISwaggerJson) {
    const rawData = fs.readFileSync('./api-swagger.json', 'utf-8');
    const jsonDate = JSON.parse(rawData);
    console.log(jsonDate);
    SwaggerModule.setup('api', app, jsonDate);
  }
  
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
