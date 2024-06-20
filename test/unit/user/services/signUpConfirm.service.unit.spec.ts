import { Test, TestingModule } from '@nestjs/testing';
import { SignUpConfirmDto } from 'src/modules/user/domain/dtos/signUpConfirm/signUpConfirm.dto';
import { SignUpConfirmService } from 'src/modules/user/services/signUpConfirm.service';
import { SIGN_UP_CONFIRM_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { vi } from 'vitest';

describe('SignUpConfirmServiceUnit', () => {
  let signUpConfirmService: SignUpConfirmService;
  let cognito: CognitoContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpConfirmService,
        {
          provide: CognitoContract,
          useValue: {
            confirmSignUpCommand: vi.fn(),
          },
        },
      ],
    }).compile();

    signUpConfirmService =
      module.get<SignUpConfirmService>(SignUpConfirmService);
    cognito = module.get<CognitoContract>(CognitoContract);
  });

  test('Deve estar definido', () => {
    expect(signUpConfirmService).toBeDefined();
    expect(cognito).toBeDefined();
  });

  describe('singUpConfirm', () => {
    test('Deve ser possível confirmar o cadastro do usuário', async () => {
      //Arrange
      const signUpConfirm: SignUpConfirmDto = {
        username: '123123',
        code: '123',
      };
      const espectedResponse: OnlyMessageResponseDto = {
        message: SIGN_UP_CONFIRM_SUCCESS,
      };
      //Act
      const result = await signUpConfirmService.signUpConfirm(signUpConfirm);
      //Assert
      expect(result).toEqual(espectedResponse);
    });

    test('Deve ser possível lançar uma exceção', async () => {
      // Arrange
      const errorMessage = 'error';
      const error = new Error(errorMessage);
      error.name = 'erroException';
      vi.spyOn(cognito, 'confirmSignUpCommand').mockRejectedValue(error);
      // Act & Assert
      await expect(
        signUpConfirmService.signUpConfirm(null)
      ).rejects.toThrowError();
    });
  });
});
