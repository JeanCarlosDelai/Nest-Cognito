import { Test, TestingModule } from '@nestjs/testing';
import { ResetPasswordConfirmCodeController } from 'src/modules/reset/controllers/resetPasswordConfirmCode.controller';
import { ResetPasswordConfirmcodeDto } from 'src/modules/reset/domain/dtos/resetPasswordConfirmCode/resetPasswordConfirmCode.dto';
import { ResetPasswordConfirmCodeService } from 'src/modules/reset/services/resetPasswordConfirmCode.service';
import { SignUpController } from 'src/modules/user/controllers/signUp.controller';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { SignUpService } from 'src/modules/user/services/signUp.service';
import { CHANGE_PASSWORD_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { CognitoProviderInMemory } from 'src/shared/providers/aws/cognito/in-memory/cognito.providerInMemory';

describe('ResetPasswordConfirmCodeControllerIntegration', () => {
  let signUpController: SignUpController;
  let signUpService: SignUpService;
  let resetPasswordConfirmCodeController: ResetPasswordConfirmCodeController;
  let resetPasswordConfirmCodeService: ResetPasswordConfirmCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignUpController, ResetPasswordConfirmCodeController],
      providers: [
        SignUpService,
        ResetPasswordConfirmCodeService,
        {
          provide: CognitoContract,
          useClass: CognitoProviderInMemory,
        },
      ],
    }).compile();

    signUpController = module.get<SignUpController>(SignUpController);
    signUpService = module.get<SignUpService>(SignUpService);
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
    expect(signUpController).toBeDefined();
    expect(signUpService).toBeDefined();
    expect(resetPasswordConfirmCodeController).toBeDefined();
    expect(resetPasswordConfirmCodeService).toBeDefined();
  });

  describe('resetPasswordConfirmCode', () => {
    test('Deve ser possível alterar a senha do usuário', async () => {
      //Arrange
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '+5554999999999',
        username: '01234567900',
        firstName: 'teste',
        lastName: 'teste',
        password: '123123',
        birthdate: '07/11/2000',
      };
      await signUpController.signUp(signUp);

      const resetPasswordConfirmCode: ResetPasswordConfirmcodeDto = {
        username: signUp.username,
        code: '123456',
        password: '2222',
      };
      const expectedResponse: OnlyMessageResponseDto = {
        message: CHANGE_PASSWORD_SUCCESS,
      };
      //Act
      const result =
        await resetPasswordConfirmCodeController.resetPasswordConfirmCode(
          resetPasswordConfirmCode
        );
      // //Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});
