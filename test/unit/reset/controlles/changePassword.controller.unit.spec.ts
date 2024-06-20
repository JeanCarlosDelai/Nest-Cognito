import { Test, TestingModule } from '@nestjs/testing';
import { ChangePasswordController } from 'src/modules/reset/controllers/changePassword.controller';
import { ChangePasswordDto } from 'src/modules/reset/domain/dtos/changePassword/changePassword.dto';
import { ChangePasswordService } from 'src/modules/reset/services/changePassword.service';
import { CHANGE_PASSWORD_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { vi } from 'vitest';

describe('ChangePasswordControllerUnit', () => {
  let changePasswordController: ChangePasswordController;
  let changePasswordService: ChangePasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChangePasswordController],
      providers: [
        {
          provide: ChangePasswordService,
          useValue: {
            changePassword: vi.fn(),
          },
        },
      ],
    }).compile();

    changePasswordController = module.get<ChangePasswordController>(
      ChangePasswordController
    );
    changePasswordService = module.get<ChangePasswordService>(
      ChangePasswordService
    );
  });

  test('Deve estar definido', () => {
    expect(changePasswordController).toBeDefined();
    expect(changePasswordService).toBeDefined();
  });

  describe('changePassword', () => {
    test('Deve ser possível retornar as informações sobre o usuário', async () => {
      //Arrange
      const changePassword: ChangePasswordDto = {
        password: '123',
        newPassword: '123',
        accessToken: '123',
      };
      const expectedResponse: OnlyMessageResponseDto = {
        message: CHANGE_PASSWORD_SUCCESS,
      };
      vi.spyOn(changePasswordService, 'changePassword').mockResolvedValueOnce(
        expectedResponse
      );
      //Act
      const result = await changePasswordController.changePassword(
        changePassword
      );
      // //Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});
