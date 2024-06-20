import {
  AdminGetUserCommandOutput,
  UserStatusType,
} from '@aws-sdk/client-cognito-identity-provider';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidateUserDto } from 'src/modules/user/domain/dtos/validateUser/validateUser.dto';
import { ValidateUserResponseDto } from 'src/modules/user/domain/dtos/validateUser/validateUserResponse.dto';
import { ValidateUserService } from 'src/modules/user/services/validateUser.service';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { vi } from 'vitest';

describe('ValidateUserServiceUnit', () => {
  let validateUserService: ValidateUserService;
  let cognito: CognitoContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateUserService,
        {
          provide: CognitoContract,
          useValue: {
            adminGetUserCommand: vi.fn(),
          },
        },
      ],
    }).compile();

    validateUserService = module.get<ValidateUserService>(ValidateUserService);
    cognito = module.get<CognitoContract>(CognitoContract);
  });

  test('Deve estar definido', () => {
    expect(validateUserService).toBeDefined();
    expect(cognito).toBeDefined();
  });

  describe('validate', () => {
    test('Deve ser possível retornar o status do usuário', async () => {
      //Arrange
      const validateUser: ValidateUserDto = {
        username: '123123',
      };
      const expectedResponse: AdminGetUserCommandOutput = {
        Username: '123123',
        UserStatus: UserStatusType.CONFIRMED,
        $metadata: {
          httpStatusCode: 200,
        },
      };
      vi.spyOn(cognito, 'adminGetUserCommand').mockResolvedValueOnce(
        expectedResponse
      );
      const mappedResponse = new ValidateUserResponseDto(
        expectedResponse.UserStatus
      );
      //Act
      const result = await validateUserService.validateUser(validateUser);
      //Assert
      expect(result).toEqual(mappedResponse);
    });

    test('Deve ser possível lançar uma exceção', async () => {
      // Arrange
      const errorMessage = 'error';
      const error = new Error(errorMessage);
      error.name = 'erroException';
      vi.spyOn(cognito, 'adminGetUserCommand').mockRejectedValue(error);
      // Act & Assert
      await expect(
        validateUserService.validateUser(null)
      ).rejects.toThrowError();
    });
  });
});
