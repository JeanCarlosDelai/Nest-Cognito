import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../../src/app.module';
import { AllExceptionsFilter } from 'src/shared/common/filters/AllException.filter';
import { ThrowsMessages } from 'src/shared/providers/aws/cognito/enum/throwsMessages.enum';
import { Throws } from 'src/shared/providers/aws/cognito/enum/throws.enum';

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

  describe('/validate (Get) -> valdateUser', async () => {
    test('Deve ser possível retornar o status do Usuário', async () => {
      //Arrange
      const validateUser = {
        username: '08740164012',
      };
      const expectedStatusCode = 500;
      const expectedResponse = {
        statusCode: expectedStatusCode,
        message: [ThrowsMessages.USER_NOT_FOUND_EXCEPTION],
        error: Throws.USER_NOT_FOUND_EXCEPTION,
      };
      // Act
      const response = await request(app.getHttpServer())
        .get(`/api/v1/user/validate`)
        .query(validateUser);
      //Assert
      expect(response.status).toBe(expectedStatusCode);
      expect(response.body.error).toEqual(expectedResponse);
    });
  });
});
