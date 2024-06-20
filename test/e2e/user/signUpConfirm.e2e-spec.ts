import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../../src/app.module';
import { AllExceptionsFilter } from 'src/shared/common/filters/AllException.filter';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { Throws } from 'src/shared/providers/aws/cognito/enum/throws.enum';
import { ThrowsMessages } from 'src/shared/providers/aws/cognito/enum/throwsMessages.enum';
import { SignUpConfirmDto } from 'src/modules/user/domain/dtos/signUpConfirm/signUpConfirm.dto';

describe('SignUpConfirmController (e2e)', () => {
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

  describe('/user/sign-up/confirm (Post) -> signUpConfirm', async () => {
    test('Não deve ser possível confirmar o cadastro para um usuário que não está cadastrado', async () => {
      //Arrange
      const signUpConfirm: SignUpConfirmDto = {
        username: '05112207230',
        code: 'validCode',
      };
      const expectedStatusCode = 500;
      const expectedResponse = {
        statusCode: expectedStatusCode,
        message: [ThrowsMessages.USER_CLIENT_NOT_FOUND_EXCEPTION],
        error: Throws.USER_NOT_FOUND_EXCEPTION,
      };
      // Act
      const response = await request(app.getHttpServer())
        .post(`/api/v1/user/sign-up/confirm`)
        .send(signUpConfirm);
      //Assert
      expect(response).not.toThrow;
      expect(response.status).toBe(expectedStatusCode);
      expect(response.body.error).toEqual(expectedResponse);
    });

    test('Não deve ser possível realizar o cadastro se o username for inválido', async () => {
      //Arrange
      const signUpConfirm: SignUpConfirmDto = {
        username: 'invalid',
        code: 'validCode',
      };
      const expectedStatusCode = 400;
      const expectedResponse = {
        statusCode: expectedStatusCode,
        message: [ThrowsMessages.IVALID_USERNAME_VALIDATION],
        error: Throws.BAD_REQUEST,
      };
      // Act
      const response = await request(app.getHttpServer())
        .post(`/api/v1/user/sign-up/confirm`)
        .send(signUpConfirm);
      //Assert
      expect(response).toThrow;
      expect(response.status).toBe(expectedStatusCode);
      expect(response.body.error).toEqual(expectedResponse);
    });
  });
});
