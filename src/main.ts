import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import * as express from 'express';
import { join } from 'path';
import { ENV } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.enableCors({
    origin: [
      'https://nivora.abduljabbartech.me',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3005',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
  });
  
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  await app.listen(ENV.PORT);
}
bootstrap();
