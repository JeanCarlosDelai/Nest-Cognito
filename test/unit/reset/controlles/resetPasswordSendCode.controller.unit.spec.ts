import { Test, TestingModule } from '@nestjs/testing';
import { ResetPasswordSendCodeController } from 'src/modules/reset/controllers/resetPasswordSendCode.controller';
import { ResetPasswordSendcodeDto } from 'src/modules/reset/domain/dtos/resetPasswordSendCode/resetPasswordSendCode.dto';
import { ResetPasswordSendCodeService } from 'src/modules/reset/services/resetPasswordSendCode.service';
import { MFA_SEND_CODE_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { vi } from 'vitest';

describe('ResetPasswordSendCodeControllerUnit', () => {
  let resetPasswordSendCodeController: ResetPasswordSendCodeController;
  let resetPasswordSendCodeService: ResetPasswordSendCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResetPasswordSendCodeController],
      providers: [
        {
          provide: ResetPasswordSendCodeService,
          useValue: {
            resetPasswordSendCode: vi.fn(),
          },
        },
      ],
    }).compile();

    resetPasswordSendCodeController =
      module.get<ResetPasswordSendCodeController>(
        ResetPasswordSendCodeController
      );
    resetPasswordSendCodeService = module.get<ResetPasswordSendCodeService>(
      ResetPasswordSendCodeService
    );
  });

  test('Deve estar definido', () => {
    expect(resetPasswordSendCodeController).toBeDefined();
    expect(resetPasswordSendCodeService).toBeDefined();
  });

  describe('resetPasswordSendCode', () => {
    test('Deve ser possível retornar as informações sobre o usuário', async () => {
      //Arrange
      const resetPasswordSendCode: ResetPasswordSendcodeDto = {
        username: '123123',
      };
      const expectedResponse: OnlyMessageResponseDto = {
        message: MFA_SEND_CODE_SUCCESS,
      };
      vi.spyOn(
        resetPasswordSendCodeService,
        'resetPasswordSendCode'
      ).mockResolvedValueOnce(expectedResponse);
      //Act
      const result =
        await resetPasswordSendCodeController.resetPasswordSendCode(
          resetPasswordSendCode
        );
      // //Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});
