import { Test, TestingModule } from '@nestjs/testing';
import { ResetPasswordConfirmcodeDto } from 'src/modules/reset/domain/dtos/resetPasswordConfirmCode/resetPasswordConfirmCode.dto';
import { ResetPasswordConfirmCodeService } from 'src/modules/reset/services/resetPasswordConfirmCode.service';
import { CHANGE_PASSWORD_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { vi } from 'vitest';

describe('ResetPasswordConfirmCodeServiceUnit', () => {
  let resetPasswordConfirmCodeService: ResetPasswordConfirmCodeService;
  let cognito: CognitoContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResetPasswordConfirmCodeService,
        {
          provide: CognitoContract,
          useValue: {
            confirmForgotPasswordCommand: vi.fn(),
          },
        },
      ],
    }).compile();

    resetPasswordConfirmCodeService =
      module.get<ResetPasswordConfirmCodeService>(
        ResetPasswordConfirmCodeService
      );
    cognito = module.get<CognitoContract>(CognitoContract);
  });

  test('Deve estar definido', () => {
    expect(resetPasswordConfirmCodeService).toBeDefined();
    expect(cognito).toBeDefined();
  });

  describe('resetPassworrConfirmCode', () => {
    test('Deve ser possível alterar a senha do usuário', async () => {
      //Arrange
      const resetPasswordConfirmCode: ResetPasswordConfirmcodeDto = {
        username: '123123',
        code: '123',
        password: '123@13asd',
      };
      const expectedResponse: OnlyMessageResponseDto = {
        message: CHANGE_PASSWORD_SUCCESS,
      };
      //Act
      const result =
        await resetPasswordConfirmCodeService.resetPasswordConfirmCode(
          resetPasswordConfirmCode
        );
      //Assert
      expect(result).toEqual(expectedResponse);
    });

    test('Deve ser possível lançar uma exceção', async () => {
      // Arrange
      const errorMessage = 'error';
      const error = new Error(errorMessage);
      error.name = 'erroException';
      vi.spyOn(cognito, 'confirmForgotPasswordCommand').mockRejectedValue(
        error
      );
      // Act & Assert
      await expect(
        resetPasswordConfirmCodeService.resetPasswordConfirmCode(null)
      ).rejects.toThrowError();
    });
  });
});
