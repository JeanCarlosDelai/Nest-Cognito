import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerSetup = (app: INestApplication): void => {
  const configSwagger = new DocumentBuilder()
    .setTitle('NEST-COGNITO')
    .setDescription('API developed with nest and cognito')
    .setVersion('1.1')
    .addBearerAuth({
      description: `Add the token without the Bearer`,
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .build();
  const swaggerOpts = {
    swaggerOptions: {
      apisSorter: 'alpha',
      tagsSorter: 'alpha',
      operationsSoreter: 'alpha',
    },
  };
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, document, swaggerOpts);
};
