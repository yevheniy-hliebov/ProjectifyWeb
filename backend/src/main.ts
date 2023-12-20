import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    credentials: true,
    origin: 'http://localhost:3000',
    exposedHeaders: 'Authorization-Cookie',
  })

  const config = app.get(ConfigService)
  const port = config.get<number>('port');
  
  await app.listen(port);
  console.log('http://localhost:' + port);
}
bootstrap();
