import { Test, TestingModule } from '@nestjs/testing';
import { ResetPasswordSendCodeController } from 'src/modules/reset/controllers/resetPasswordSendCode.controller';
import { ResetPasswordSendcodeDto } from 'src/modules/reset/domain/dtos/resetPasswordSendCode/resetPasswordSendCode.dto';
import { ResetPasswordSendCodeService } from 'src/modules/reset/services/resetPasswordSendCode.service';
import { SignUpController } from 'src/modules/user/controllers/signUp.controller';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { SignUpService } from 'src/modules/user/services/signUp.service';
import { RESET_PASSWORD_SEND_CODE_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { CognitoProviderInMemory } from 'src/shared/providers/aws/cognito/in-memory/cognito.providerInMemory';

describe('ResetPasswordSendCodeControllerIntegration', () => {
  let signUpController: SignUpController;
  let signUpService: SignUpService;
  let resetPasswordSendCodeController: ResetPasswordSendCodeController;
  let resetPasswordSendCodeService: ResetPasswordSendCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignUpController, ResetPasswordSendCodeController],
      providers: [
        SignUpService,
        ResetPasswordSendCodeService,
        {
          provide: CognitoContract,
          useClass: CognitoProviderInMemory,
        },
      ],
    }).compile();

    signUpController = module.get<SignUpController>(SignUpController);
    signUpService = module.get<SignUpService>(SignUpService);
    resetPasswordSendCodeController =
      module.get<ResetPasswordSendCodeController>(
        ResetPasswordSendCodeController
      );
    resetPasswordSendCodeService = module.get<ResetPasswordSendCodeService>(
      ResetPasswordSendCodeService
    );
  });

  test('Deve estar definido', () => {
    expect(signUpController).toBeDefined();
    expect(signUpService).toBeDefined();
    expect(resetPasswordSendCodeController).toBeDefined();
    expect(resetPasswordSendCodeService).toBeDefined();
  });

  describe('resetPasswordSendCode', () => {
    test('Deve ser possível retornar as informações sobre o usuário', async () => {
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

      const resetPasswordSendCode: ResetPasswordSendcodeDto = {
        username: signUp.username,
      };
      const expectedResponse: OnlyMessageResponseDto = {
        message: RESET_PASSWORD_SEND_CODE_SUCCESS,
      };
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
