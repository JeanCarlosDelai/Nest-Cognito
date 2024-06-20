import { GetUserCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { Test, TestingModule } from '@nestjs/testing';
import { GetInfoResponseDto } from 'src/modules/user/domain/dtos/getInfo/getInfoResponse.dto';
import { GetInfoUserService } from 'src/modules/user/services/getInfoUser.service';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { vi } from 'vitest';

describe('GetInfoUserServiceUnit', () => {
  let getInfoUserService: GetInfoUserService;
  let cognito: CognitoContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetInfoUserService,
        {
          provide: CognitoContract,
          useValue: {
            getUserCommand: vi.fn(),
          },
        },
      ],
    }).compile();

    getInfoUserService = module.get<GetInfoUserService>(GetInfoUserService);
    cognito = module.get<CognitoContract>(CognitoContract);
  });

  test('Deve estar definido', () => {
    expect(getInfoUserService).toBeDefined();
    expect(cognito).toBeDefined();
  });

  describe('getInfoUser', () => {
    test('Deve ser possível listar as informações do usuário', async () => {
      //Arrange
      const accessToken = 'token';
      const expectedResponse: GetUserCommandOutput = {
        Username: 'teste',
        UserAttributes: [
          {
            Name: 'name',
            Value: 'teste',
          },
        ],
        $metadata: {
          httpStatusCode: 200,
        },
      };
      vi.spyOn(cognito, 'getUserCommand').mockResolvedValueOnce(
        expectedResponse
      );
      const mappedResponse = new GetInfoResponseDto(
        expectedResponse.Username,
        expectedResponse.UserAttributes
      );
      //Act
      const result = await getInfoUserService.getInfoUser(accessToken);
      // //Assert
      expect(result).toEqual(mappedResponse);
    });

    test('Deve ser possível lançar uma exceção', async () => {
      // Arrange
      const errorMessage = 'error';
      const error = new Error(errorMessage);
      error.name = 'erroException';
      vi.spyOn(cognito, 'getUserCommand').mockRejectedValue(error);
      // Act & Assert
      await expect(getInfoUserService.getInfoUser(null)).rejects.toThrowError();
    });
  });
});
