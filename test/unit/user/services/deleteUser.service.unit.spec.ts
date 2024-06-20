import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserService } from 'src/modules/user/services/deleteUser.service';
import { DELETED_USER_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { vi } from 'vitest';

describe('DeleteUserServiceUnit', () => {
  let deleteUserService: DeleteUserService;
  let cognito: CognitoContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserService,
        {
          provide: CognitoContract,
          useValue: {
            deleteUserCommand: vi.fn(),
          },
        },
      ],
    }).compile();

    deleteUserService = module.get<DeleteUserService>(DeleteUserService);
    cognito = module.get<CognitoContract>(CognitoContract);
  });

  test('Deve estar definido', () => {
    expect(deleteUserService).toBeDefined();
    expect(cognito).toBeDefined();
  });

  describe('deleteUser', () => {
    test('Deve ser possível efetuar a exclusão do usuário', async () => {
      //Arrange
      const accessToken = 'token';
      const expectedResponse: OnlyMessageResponseDto = {
        message: DELETED_USER_SUCCESS,
      };
      //Act
      const result = await deleteUserService.deleteUser(accessToken);
      //Assert
      expect(result).toEqual(expectedResponse);
    });

    test('Deve ser possível lançar uma exceção', async () => {
      // Arrange
      const errorMessage = 'error';
      const error = new Error(errorMessage);
      error.name = 'erroException';
      vi.spyOn(cognito, 'deleteUserCommand').mockRejectedValue(error);
      // Act & Assert
      await expect(deleteUserService.deleteUser(null)).rejects.toThrowError();
    });
  });
});
