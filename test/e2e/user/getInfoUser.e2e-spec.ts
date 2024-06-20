import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../../src/app.module';
import { AllExceptionsFilter } from 'src/shared/common/filters/AllException.filter';
import { ThrowsMessages } from 'src/shared/providers/aws/cognito/enum/throwsMessages.enum';

describe('GetInfoUserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, disableErrorMessages: false })
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/user/info (Get) -> getInfoUser', async () => {
    test('Não deve ser possível listar as informações do usuário se não for enviado uma Bearer Token', async () => {
      //Arrange
      const expectedStatusCode = 401;
      const expectedResponse = {
        statusCode: expectedStatusCode,
        message: ThrowsMessages.UNAUTHORIZED,
      };
      // Act
      const response = await request(app.getHttpServer()).get(
        `/api/v1/user/info`
      );
      //Assert
      expect(response.status).toBe(expectedStatusCode);
      expect(response.body.error).toEqual(expectedResponse);
    });
  });
});
