import { Test, TestingModule } from '@nestjs/testing';
import { SignUpConfirmController } from 'src/modules/user/controllers/signUpConfirm.controller';
import { SingUpConfirmDto } from 'src/modules/user/domain/dtos/signUpConfirm/signUpConfirm.dto';
import { SignUpConfirmService } from 'src/modules/user/services/signUpConfirm.service';
import { SIGN_UP_CONFIRM_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { vi } from 'vitest';

describe('SignUpCofirmControllerUnit', () => {
  let signUpConfirmController: SignUpConfirmController;
  let signUpConfirmService: SignUpConfirmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignUpConfirmController],
      providers: [
        {
          provide: SignUpConfirmService,
          useValue: {
            signUpConfirm: vi.fn(),
          },
        },
      ],
    }).compile();

    signUpConfirmController = module.get<SignUpConfirmController>(
      SignUpConfirmController
    );
    signUpConfirmService =
      module.get<SignUpConfirmService>(SignUpConfirmService);
  });

  test('Deve estar definido', () => {
    expect(signUpConfirmController).toBeDefined();
    expect(signUpConfirmService).toBeDefined();
  });

  describe('signUpConfirm', () => {
    test('Deve ser possível confirmar o cadastro do usuário', async () => {
      //Arrange
      const userSingUpConfirmUsuarioDto: SingUpConfirmDto = {
        username: '123123',
        code: '1',
      };
      const espectedResponse: OnlyMessageResponseDto = {
        message: SIGN_UP_CONFIRM_SUCCESS,
      };
      vi.spyOn(signUpConfirmService, 'signUpConfirm').mockResolvedValueOnce(
        espectedResponse
      );
      //Act
      const result = await signUpConfirmController.signUpConfirm(
        userSingUpConfirmUsuarioDto
      );
      // //Assert
      expect(result).toEqual(espectedResponse);
    });
  });
});
