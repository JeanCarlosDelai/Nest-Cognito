import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserController } from 'src/modules/user/controllers/deleteUser.controller';
import { DeleteUserService } from 'src/modules/user/services/deleteUser.service';
import { DELETED_USER_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { vi } from 'vitest';

describe('DeleteUserControllerUnit', () => {
  let deleteUserController: DeleteUserController;
  let deleteUserService: DeleteUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteUserController],
      providers: [
        {
          provide: DeleteUserService,
          useValue: {
            deleteUser: vi.fn(),
          },
        },
      ],
    }).compile();

    deleteUserController =
      module.get<DeleteUserController>(DeleteUserController);
    deleteUserService = module.get<DeleteUserService>(DeleteUserService);
  });

  test('Deve estar definido', () => {
    expect(deleteUserController).toBeDefined();
    expect(deleteUserService).toBeDefined();
  });

  describe('deleteUser', () => {
    test('Deve ser possível excluir o cadastro do usuário no cognito', async () => {
      //Arrange
      const accessToken = 'accessToken';
      const expectedResponse: OnlyMessageResponseDto = {
        message: DELETED_USER_SUCCESS,
      };
      vi.spyOn(deleteUserService, 'deleteUser').mockResolvedValueOnce(
        expectedResponse
      );
      //Act
      const result = await deleteUserController.deleteUser(accessToken);
      // //Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});
