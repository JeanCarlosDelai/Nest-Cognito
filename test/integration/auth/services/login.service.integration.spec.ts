import { InitiateAuthCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginDto } from 'src/modules/auth/domain/dtos/login/login.dto';
import { LoginResponseDto } from 'src/modules/auth/domain/dtos/login/loginResponse.dto';
import { LoginService } from 'src/modules/auth/services/login.service';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { SignUpService } from 'src/modules/user/services/signUp.service';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { Throws } from 'src/shared/providers/aws/cognito/enum/throws.enum';
import { ThrowsMessages } from 'src/shared/providers/aws/cognito/enum/throwsMessages.enum';
import { CognitoProviderInMemory } from 'src/shared/providers/aws/cognito/in-memory/cognito.providerInMemory';

describe('LoginServiceUnit', () => {
  let signUpService: SignUpService;
  let loginService: LoginService;
  let cognito: CognitoContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpService,
        LoginService,
        {
          provide: CognitoContract,
          useClass: CognitoProviderInMemory,
        },
      ],
    }).compile();

    signUpService = module.get<SignUpService>(SignUpService);
    loginService = module.get<LoginService>(LoginService);
    cognito = module.get<CognitoContract>(CognitoContract);
  });

  test('Deve estar definido', () => {
    expect(signUpService).toBeDefined();
    expect(loginService).toBeDefined();
    expect(cognito).toBeDefined();
  });

  describe('login', () => {
    test('Deve ser possível efetuar o login', async () => {
      //Arrange
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '+5554999999999',
        username: '01234567900',
        firstName: 'teste',
        lastName: 'teste',
        password: '123123',
        birthdate: '07/11/2000',
      };
      await signUpService.signUp(signUp);

      const login: LoginDto = {
        username: signUp.username,
        password: signUp.password,
      };
      const expectedResponse: InitiateAuthCommandOutput = {
        $metadata: null,
        AuthenticationResult: {
          IdToken: 'token',
          RefreshToken: 'token',
          AccessToken: 'token',
        },
      };
      const mappedResponse = new LoginResponseDto(
        expectedResponse.AuthenticationResult.AccessToken,
        expectedResponse.AuthenticationResult.IdToken,
        expectedResponse.AuthenticationResult.RefreshToken
      );
      //Act
      const result = await loginService.login(login);
      //Assert
      expect(result).toEqual(mappedResponse);
    });

    test('Não deve ser possível efetuar o login pois o usuário não existe', async () => {
      // Arrange
      const login: LoginDto = {
        username: '123',
        password: '123',
      };
      // Act / Assert
      try {
        await loginService.login(login);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.response).toEqual({
          statusCode: 500,
          message: [ThrowsMessages.USER_NOT_FOUND_EXCEPTION],
          error: Throws.USER_NOT_FOUND_EXCEPTION,
        });
      }
    });

    test('Não deve ser possível efetuar o login pois a senha está incorreta', async () => {
      // Arrange
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '+5554999999999',
        username: '01234567900',
        firstName: 'teste',
        lastName: 'teste',
        password: '123123',
        birthdate: '07/11/2000',
      };
      await signUpService.signUp(signUp);

      const login: LoginDto = {
        username: signUp.username,
        password: '123',
      };
      // Act / Assert
      try {
        await loginService.login(login);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.response).toEqual({
          statusCode: 500,
          message: [ThrowsMessages.INCORRECT_PASSWORD],
          error: Throws.NOT_AUTHORIZED_EXCEPTION,
        });
      }
    });
  });
});
