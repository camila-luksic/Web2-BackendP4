import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,DELETE,PUT,PATCH',
    allowedHeaders: 'Content-Type, Authorization',
  });
  app.use('/public', express.static(join(__dirname, '..', 'public')));


  await app.listen(process.env.PORT ?? 3008);
}
bootstrap();