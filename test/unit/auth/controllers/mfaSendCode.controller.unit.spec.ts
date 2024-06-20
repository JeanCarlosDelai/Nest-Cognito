import { Test, TestingModule } from '@nestjs/testing';
import { MfaSendCodeController } from 'src/modules/auth/controllers/mfaSendCode.controller';
import { MfaSendCodeResponseDto } from 'src/modules/auth/domain/dtos/mfaSendCode/mfaSendCodeResponse.dto';
import { MfaSendCodeService } from 'src/modules/auth/services/mfaSendCode.service';
import { MFA_SEND_CODE_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { vi } from 'vitest';

describe('MFAsendCodeControllerUnit', () => {
  let mfaSendCodeController: MfaSendCodeController;
  let mfaSendCodeService: MfaSendCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MfaSendCodeController],
      providers: [
        {
          provide: MfaSendCodeService,
          useValue: {
            mfaSendCode: vi.fn(),
          },
        },
      ],
    }).compile();

    mfaSendCodeController = module.get<MfaSendCodeController>(
      MfaSendCodeController
    );
    mfaSendCodeService = module.get<MfaSendCodeService>(MfaSendCodeService);
  });

  test('Deve estar definido', () => {
    expect(mfaSendCodeController).toBeDefined();
    expect(mfaSendCodeService).toBeDefined();
  });

  describe('mfaSendCode', () => {
    test('Deve ser possível enviar o código MFA', async () => {
      //Arrange
      const accessToken = '123';
      const expectedResponse: MfaSendCodeResponseDto = {
        message: MFA_SEND_CODE_SUCCESS,
        Destination: '123',
      };
      vi.spyOn(mfaSendCodeService, 'mfaSendCode').mockResolvedValueOnce(
        expectedResponse
      );
      //Act
      const result = await mfaSendCodeController.mfaSendCode(accessToken);
      // //Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});
