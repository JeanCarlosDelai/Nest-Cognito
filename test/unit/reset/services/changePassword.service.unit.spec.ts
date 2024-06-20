import { Test, TestingModule } from '@nestjs/testing';
import { ChangePasswordDto } from 'src/modules/reset/domain/dtos/changePassword/changePassword.dto';
import { ChangePasswordService } from 'src/modules/reset/services/changePassword.service';
import { CHANGE_PASSWORD_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { vi } from 'vitest';

describe('ChangePasswordServiceUnit', () => {
  let changePasswordService: ChangePasswordService;
  let cognito: CognitoContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangePasswordService,
        {
          provide: CognitoContract,
          useValue: {
            changePasswordCommand: vi.fn(),
          },
        },
      ],
    }).compile();

    changePasswordService = module.get<ChangePasswordService>(
      ChangePasswordService
    );
    cognito = module.get<CognitoContract>(CognitoContract);
  });

  test('Deve estar definido', () => {
    expect(changePasswordService).toBeDefined();
    expect(cognito).toBeDefined();
  });

  describe('changePassword', () => {
    test('Deve ser possível alterar a senha do usuário se ele estiver logado', async () => {
      //Arrange
      const changePassword: ChangePasswordDto = {
        password: '123',
        newPassword: '123',
        accessToken: '123',
      };
      const expectedResponse: OnlyMessageResponseDto = {
        message: CHANGE_PASSWORD_SUCCESS,
      };
      //Act
      const result = await changePasswordService.changePassword(changePassword);
      //Assert
      expect(result).toEqual(expectedResponse);
    });

    test('Deve ser possível lançar uma exceção', async () => {
      // Arrange
      const errorMessage = 'error';
      const error = new Error(errorMessage);
      error.name = 'erroException';
      vi.spyOn(cognito, 'changePasswordCommand').mockRejectedValue(error);
      // Act & Assert
      await expect(
        changePasswordService.changePassword(null)
      ).rejects.toThrowError();
    });
  });
});
