import { Test, TestingModule } from '@nestjs/testing';
import { ResetPasswordSendcodeDto } from 'src/modules/reset/domain/dtos/resetPasswordSendCode/resetPasswordSendCode.dto';
import { ResetPasswordSendCodeService } from 'src/modules/reset/services/resetPasswordSendCode.service';
import { RESET_PASSWORD_SEND_CODE_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { vi } from 'vitest';

describe('ResetPasswordSendCodeServiceUnit', () => {
  let resetPasswordSendCodeService: ResetPasswordSendCodeService;
  let cognito: CognitoContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResetPasswordSendCodeService,
        {
          provide: CognitoContract,
          useValue: {
            forgotPasswordCommand: vi.fn(),
          },
        },
      ],
    }).compile();

    resetPasswordSendCodeService = module.get<ResetPasswordSendCodeService>(
      ResetPasswordSendCodeService
    );
    cognito = module.get<CognitoContract>(CognitoContract);
  });

  test('Deve estar definido', () => {
    expect(resetPasswordSendCodeService).toBeDefined();
    expect(cognito).toBeDefined();
  });

  describe('resetPasswordSendCode', () => {
    test('Deve ser possível enviar para o e-mail o código para reset de senha', async () => {
      //Arrange
      const resetPasswordSendCode: ResetPasswordSendcodeDto = {
        username: '123123',
      };
      const expectedResponse: OnlyMessageResponseDto = {
        message: RESET_PASSWORD_SEND_CODE_SUCCESS,
      };
      //Act
      const result = await resetPasswordSendCodeService.resetPasswordSendCode(
        resetPasswordSendCode
      );
      //Assert
      expect(result).toEqual(expectedResponse);
    });

    test('Deve ser possível lançar uma exceção', async () => {
      // Arrange
      const errorMessage = 'error';
      const error = new Error(errorMessage);
      error.name = 'erroException';
      vi.spyOn(cognito, 'forgotPasswordCommand').mockRejectedValue(error);
      // Act & Assert
      await expect(
        resetPasswordSendCodeService.resetPasswordSendCode(null)
      ).rejects.toThrowError();
    });
  });
});
