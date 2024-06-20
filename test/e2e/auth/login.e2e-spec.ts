import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../../src/app.module';
import { AllExceptionsFilter } from 'src/shared/common/filters/AllException.filter';
import { ThrowsMessages } from 'src/shared/providers/aws/cognito/enum/throwsMessages.enum';
import { Throws } from 'src/shared/providers/aws/cognito/enum/throws.enum';
import { LoginDto } from 'src/modules/auth/domain/dtos/login/login.dto';

describe('LoginController (e2e)', () => {
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

  describe('/auth/login (Post) -> login', async () => {
    test('Não deve ser possível efetuar o login', async () => {
      //Arrange
      const login: LoginDto = {
        username: '05124012250',
        password: '123',
      };
      const expectedStatusCode = 500;
      const expectedResponse = {
        statusCode: expectedStatusCode,
        message: [ThrowsMessages.USER_NOT_FOUND_EXCEPTION],
        error: Throws.USER_NOT_FOUND_EXCEPTION,
      };
      // Act
      const response = await request(app.getHttpServer())
        .post(`/api/v1/auth/login`)
        .send(login);
      //Assert
      expect(response.status).toBe(expectedStatusCode);
      expect(response.body.error).toEqual(expectedResponse);
    });
  });
});
