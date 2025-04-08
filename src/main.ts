import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as expressBasicAuth from 'express-basic-auth';
import { MikroORM } from '@mikro-orm/core';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from 'src/infrastructure/configuration/swagger.config';
import { config } from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { urlencoded, json } from 'express';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

config({ path: `.env.${process.env.NODE_ENV}` });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'debug', 'log'],
  });

  app.setGlobalPrefix('api');

  if (process.env.NODE_ENV != 'production') {
    app.use(
      ['/docs'],
      expressBasicAuth({
        challenge: true,
        users: {
          [`${process.env.SWAGGER_ID}`]: `${process.env.SWAGGER_PW}`,
        },
      }),
    );
  }

  await app.get(MikroORM).getSchemaGenerator().ensureDatabase();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    ignoreGlobalPrefix: false,
  });

  const originUrl =
    process.env.NODE_ENV != 'production'
      ? 'http://localhost:5173'
      : new RegExp(
          `\\.(${process.env.ACCESS_ORIGIN_DOMAIN?.replace('.', '\\.')})$`,
        );

  app.enableCors({
    origin: (origin, callback) => {
      if (
        !origin ||
        (typeof originUrl !== 'string' && originUrl.test(origin)) ||
        (typeof originUrl === 'string' && originUrl === 'http://localhost:5173')
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    optionsSuccessStatus: 200,
    exposedHeaders: ['Authorization'],
    allowedHeaders: ['Authorization', 'Content-Type', 'Idempotency-Key'],
    credentials: true,
  });

  app.use(cookieParser());

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.useGlobalPipes(new ValidationPipe());

  if (process.env.NODE_ENV != 'production') {
    SwaggerModule.setup('docs', app, document, {
      customCssUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
      ],
      swaggerOptions: {
        persistAuthorization: true,
        withCredentials: true,
      },
    });
  }

  app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

  await app.listen(Number(process.env.SERVER_PORT), () => {
    console.log(`      
    ┌────────────────────────────────────────────────────────────────────────────────┐
      🌸   Name: zzan
      🌸   AccessOrigin: ${process.env.ACCESS_ORIGIN_DOMAIN}
      🌸   Port: ${process.env.SERVER_PORT}
      🌸   Environment: ${process.env.NODE_ENV}
      🌸   ServerTime: ${new Date()}
    └────────────────────────────────────────────────────────────────────────────────┘
    `);
  });
}
bootstrap();
