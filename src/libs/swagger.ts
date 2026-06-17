import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const configureSwagger = (app) => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('MENTORSHIP API V3')
    .setDescription('Comprehensive documentation for the MENTORSHIP API')
    .setVersion('3.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )

    .addTag('MENTORSHIP Docs', 'Documentation for the MENTORSHIP API endpoints')
    .setExternalDoc('Postman Collection', '/documentation-json')
    .build();

  // const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/documentation', app, documentFactory);
};
