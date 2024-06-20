import { InitiateAuthCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginDto } from 'src/modules/auth/domain/dtos/login/login.dto';
import { LoginResponseDto } from 'src/modules/auth/domain/dtos/login/loginResponse.dto';
import { LoginService } from 'src/modules/auth/services/login.service';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { vi } from 'vitest';

describe('LoginServiceUnit', () => {
  let loginService: LoginService;
  let cognito: CognitoContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        {
          provide: CognitoContract,
          useValue: {
            initiateAuthCommand: vi.fn(),
          },
        },
      ],
    }).compile();

    loginService = module.get<LoginService>(LoginService);
    cognito = module.get<CognitoContract>(CognitoContract);
  });

  test('Deve estar definido', () => {
    expect(loginService).toBeDefined();
    expect(cognito).toBeDefined();
  });

  describe('login', () => {
    test('Deve ser possível efetuar o login', async () => {
      //Arrange
      const login: LoginDto = {
        username: '123',
        password: '123',
      };
      const expectedResponse: InitiateAuthCommandOutput = {
        $metadata: undefined,
        AuthenticationResult: {
          ExpiresIn: 3600,
          IdToken: 'token',
          NewDeviceMetadata: undefined,
          RefreshToken: 'token',
          TokenType: 'token',
        },
      };
      vi.spyOn(cognito, 'initiateAuthCommand').mockResolvedValueOnce(
        expectedResponse
      );
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

    test('Deve ser possível lançar uma exceção', async () => {
      // Arrange
      const errorMessage = 'error';
      const error = new Error(errorMessage);
      error.name = 'erroException';
      vi.spyOn(cognito, 'initiateAuthCommand').mockRejectedValue(error);
      // Act & Assert
      await expect(loginService.login(null)).rejects.toThrowError();
    });
  });
});
