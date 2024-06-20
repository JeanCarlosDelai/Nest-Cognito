import { Test, TestingModule } from '@nestjs/testing';
import { MfaConfirmCodeDto } from 'src/modules/auth/domain/dtos/mfaConfirmCode/mfaConfirmCode.dto';
import { MfaConfirmCodeService } from 'src/modules/auth/services/mfaConfirmCode.service';
import { MFA_CONFIRM_CODE_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { vi } from 'vitest';

describe('MfaConfirmCodeServiceUnit', () => {
  let mfaConfirmCodeService: MfaConfirmCodeService;
  let cognito: CognitoContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MfaConfirmCodeService,
        {
          provide: CognitoContract,
          useValue: {
            verifyUserAttributeCommand: vi.fn(),
          },
        },
      ],
    }).compile();

    mfaConfirmCodeService = module.get<MfaConfirmCodeService>(
      MfaConfirmCodeService
    );
    cognito = module.get<CognitoContract>(CognitoContract);
  });

  test('Deve estar definido', () => {
    expect(mfaConfirmCodeService).toBeDefined();
    expect(cognito).toBeDefined();
  });

  describe('mfaConfirmCode', () => {
    test('Deve ser possível confirmar o código MFA', async () => {
      //Arrange
      const mfaConfirmCode: MfaConfirmCodeDto = {
        accessToken: '123',
        code: '123',
      };
      const expectedResponse: OnlyMessageResponseDto = {
        message: MFA_CONFIRM_CODE_SUCCESS,
      };
      //Act
      const result = await mfaConfirmCodeService.mfaConfirmCode(mfaConfirmCode);
      //Assert
      expect(result).toEqual(expectedResponse);
    });

    test('Deve ser possível lançar uma exceção', async () => {
      // Arrange
      const errorMessage = 'error';
      const error = new Error(errorMessage);
      error.name = 'erroException';
      vi.spyOn(cognito, 'verifyUserAttributeCommand').mockRejectedValue(error);
      // Act & Assert
      await expect(
        mfaConfirmCodeService.mfaConfirmCode(null)
      ).rejects.toThrowError();
    });
  });
});
