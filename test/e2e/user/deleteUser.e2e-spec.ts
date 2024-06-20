import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../../src/app.module';
import { AllExceptionsFilter } from 'src/shared/common/filters/AllException.filter';
import { ThrowsMessages } from 'src/shared/providers/aws/cognito/enum/throwsMessages.enum';

describe('DeleteUserController (e2e)', () => {
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

  describe('/user (Delete) -> deleteUser', async () => {
    test('Não deve ser possível autenticar sem enviar um Bearer Token Válido', async () => {
      //Arrange
      const expectedStatusCode = 401;
      const expectedResponse = {
        statusCode: expectedStatusCode,
        message: ThrowsMessages.UNAUTHORIZED,
      };
      // Act
      const response = await request(app.getHttpServer()).delete(
        `/api/v1/user`
      );
      //Assert
      expect(response.status).toBe(expectedStatusCode);
      expect(response.body.error).toEqual(expectedResponse);
    });
  });
});
