import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import * as express from 'express';
import { join } from 'path';
import { ENV } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  await app.listen(ENV.PORT);
}
bootstrap();
