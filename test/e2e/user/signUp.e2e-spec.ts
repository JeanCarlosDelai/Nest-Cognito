import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../../src/app.module';
import { AllExceptionsFilter } from 'src/shared/common/filters/AllException.filter';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { Throws } from 'src/shared/providers/aws/cognito/enum/throws.enum';
import { ThrowsMessages } from 'src/shared/providers/aws/cognito/enum/throwsMessages.enum';

describe('SignUpController (e2e)', () => {
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

  describe('user/sign-up (Post) -> signUp', async () => {
    test('Não deve ser possível realizar o cadastro se o username for inválido', async () => {
      //Arrange
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '+5554999999999',
        username: '111',
        firstName: 'teste',
        lastName: 'teste',
        password: '123@Test123',
        birthdate: '07/11/2000',
      };
      const expectedStatusCode = 400;
      const expectedResponse = {
        statusCode: expectedStatusCode,
        message: [ThrowsMessages.IVALID_USERNAME_VALIDATION],
        error: Throws.BAD_REQUEST,
      };
      // Act
      const response = await request(app.getHttpServer())
        .post(`/api/v1/user/sign-up`)
        .send(signUp);
      //Assert
      expect(response).toThrow;
      expect(response.status).toBe(expectedStatusCode);
      expect(response.body.error).toEqual(expectedResponse);
    });

    test('Não deve ser possível realizar o cadastro se o birthdate for inválido', async () => {
      //Arrange
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '+5554999999999',
        // CPF gerado no site https://www.4devs.com.br/gerador_de_cpf
        username: '08740164012',
        firstName: 'teste',
        lastName: 'teste',
        password: '123@Test123',
        birthdate: '07/11/1',
      };
      const expectedStatusCode = 400;
      const expectedResponse = {
        statusCode: expectedStatusCode,
        message: [ThrowsMessages.IVALID_BIRTHDATE_VALIDATION],
        error: Throws.BAD_REQUEST,
      };
      // Act
      const response = await request(app.getHttpServer())
        .post(`/api/v1/user/sign-up`)
        .send(signUp);
      //Assert
      expect(response).toThrow;
      expect(response.status).toBe(expectedStatusCode);
      expect(response.body.error).toEqual(expectedResponse);
    });

    test('Não deve ser possível realizar o cadastro se o phoneNumber for inválido', async () => {
      //Arrange
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '3399999999',
        // CPF gerado no site https://www.4devs.com.br/gerador_de_cpf
        username: '08740164012',
        firstName: 'teste',
        lastName: 'teste',
        password: '123@Test123',
        birthdate: '07/11/2000',
      };
      const expectedStatusCode = 400;
      const expectedResponse = {
        statusCode: expectedStatusCode,
        message: [ThrowsMessages.IVALID_PHONE_NUMBER_VALIDATION],
        error: Throws.BAD_REQUEST,
      };
      // Act
      const response = await request(app.getHttpServer())
        .post(`/api/v1/user/sign-up`)
        .send(signUp);
      //Assert
      expect(response).toThrow;
      expect(response.status).toBe(expectedStatusCode);
      expect(response.body.error).toEqual(expectedResponse);
    });
  });
});
