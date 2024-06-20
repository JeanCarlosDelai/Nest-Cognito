import { Test, TestingModule } from '@nestjs/testing';
import { ResetPasswordConfirmCodeController } from 'src/modules/reset/controllers/resetPasswordConfirmCode.controller';
import { ResetPasswordConfirmcodeDto } from 'src/modules/reset/domain/dtos/resetPasswordConfirmCode/resetPasswordConfirmCode.dto';
import { ResetPasswordConfirmCodeService } from 'src/modules/reset/services/resetPasswordConfirmCode.service';
import { CHANGE_PASSWORD_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { vi } from 'vitest';

describe('ResetPasswordConfirmCodeControllerUnit', () => {
  let resetPasswordConfirmCodeController: ResetPasswordConfirmCodeController;
  let resetPasswordConfirmCodeService: ResetPasswordConfirmCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResetPasswordConfirmCodeController],
      providers: [
        {
          provide: ResetPasswordConfirmCodeService,
          useValue: {
            resetPasswordConfirmCode: vi.fn(),
          },
        },
      ],
    }).compile();

    resetPasswordConfirmCodeController =
      module.get<ResetPasswordConfirmCodeController>(
        ResetPasswordConfirmCodeController
      );
    resetPasswordConfirmCodeService =
      module.get<ResetPasswordConfirmCodeService>(
        ResetPasswordConfirmCodeService
      );
  });

  test('Deve estar definido', () => {
    expect(resetPasswordConfirmCodeController).toBeDefined();
    expect(resetPasswordConfirmCodeService).toBeDefined();
  });

  describe('resetPasswordConfirmCode', () => {
    test('Deve ser possível retornar as informações sobre o usuário', async () => {
      //Arrange
      const resetPasswordSendCode: ResetPasswordConfirmcodeDto = {
        username: '123123',
        code: '123',
        password: '123',
      };
      const expectedResponse: OnlyMessageResponseDto = {
        message: CHANGE_PASSWORD_SUCCESS,
      };
      vi.spyOn(
        resetPasswordConfirmCodeService,
        'resetPasswordConfirmCode'
      ).mockResolvedValueOnce(expectedResponse);
      //Act
      const result =
        await resetPasswordConfirmCodeController.resetPasswordConfirmCode(
          resetPasswordSendCode
        );
      // //Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});
