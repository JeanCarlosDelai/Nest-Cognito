import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/common/filters/AllException.filter';
import { swaggerSetup } from './shared/swagger/swaggerSetup';
import { config } from './shared/config/config';
const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, disableErrorMessages: false })
  );
  swaggerSetup(app);
  await app.listen(config.PORT);
  logger.log(`API Nest-Cognito it ruuning: ${config.PORT}`);
}
bootstrap();
