import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.use(compression());
  app.use(helmet());

  app.enableCors({
    origin: '*',
    methods: 'POST, DELETE, GET, PATCH',
    credentials: true,
    allowedHeaders:
      'Content-Type, Authorization, X-Requested-With, token, Accept, Api-Key',
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('MENTORSHIP API V3')
    .setDescription('API to connect to mentor who have the skills you needed')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        in: 'header',
        description: 'Enter Jwt token',
      },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;

  await app.listen(port, () => {
    Logger.warn(` 
      --------------------------------------
      Application Server Successful!
      API Docs: localhost:${port}/api
      --------------------------------------
    `);
  });
}
bootstrap();
