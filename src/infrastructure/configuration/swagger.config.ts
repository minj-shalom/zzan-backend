import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
};

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Zzan')
  .setDescription('This document is for Zzan API Swagger Document.')
  .setVersion('0.1')
  .addTag('Zzan')
  .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'Token' },
    'Bearer',
  )
  .build();
