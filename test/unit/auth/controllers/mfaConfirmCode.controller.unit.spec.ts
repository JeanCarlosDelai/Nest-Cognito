import { Test, TestingModule } from '@nestjs/testing';
import { MfaConfirmCodeController } from 'src/modules/auth/controllers/mfaConfirmCode.controller';
import { MfaConfirmCodeDto } from 'src/modules/auth/domain/dtos/mfaConfirmCode/mfaConfirmCode.dto';
import { MfaConfirmCodeService } from 'src/modules/auth/services/mfaConfirmCode.service';
import { MFA_CONFIRM_CODE_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { vi } from 'vitest';

describe('LoginControllerUnit', () => {
  let mfaConfirmCodeController: MfaConfirmCodeController;
  let mfaConfirmCodeService: MfaConfirmCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MfaConfirmCodeController],
      providers: [
        {
          provide: MfaConfirmCodeService,
          useValue: {
            mfaConfirmCode: vi.fn(),
          },
        },
      ],
    }).compile();

    mfaConfirmCodeController = module.get<MfaConfirmCodeController>(
      MfaConfirmCodeController
    );
    mfaConfirmCodeService = module.get<MfaConfirmCodeService>(
      MfaConfirmCodeService
    );
  });

  test('Deve estar definido', () => {
    expect(mfaConfirmCodeController).toBeDefined();
    expect(mfaConfirmCodeService).toBeDefined();
  });

  describe('mfaConfirmCode', () => {
    test('Deve ser possível confirmar o código MFA', async () => {
      //Arrange
      const changePassword: MfaConfirmCodeDto = {
        accessToken: '123',
        code: '123',
      };
      const expectedResponse: OnlyMessageResponseDto = {
        message: MFA_CONFIRM_CODE_SUCCESS,
      };
      vi.spyOn(mfaConfirmCodeService, 'mfaConfirmCode').mockResolvedValueOnce(
        expectedResponse
      );
      //Act
      const result = await mfaConfirmCodeController.mfaConfirmCode(
        changePassword
      );
      // //Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});
