import { Test, TestingModule } from '@nestjs/testing';
import { MfaConfirmCodeController } from 'src/modules/auth/controllers/mfaConfirmCode.controller';
import { MfaConfirmCodeDto } from 'src/modules/auth/domain/dtos/mfaConfirmCode/mfaConfirmCode.dto';
import { MfaConfirmCodeService } from 'src/modules/auth/services/mfaConfirmCode.service';
import { SignUpController } from 'src/modules/user/controllers/signUp.controller';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { SignUpService } from 'src/modules/user/services/signUp.service';
import { MFA_CONFIRM_CODE_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { CognitoProviderInMemory } from 'src/shared/providers/aws/cognito/in-memory/cognito.providerInMemory';

describe('LoginControllerUnit', () => {
  let signUpController: SignUpController;
  let signUpService: SignUpService;
  let mfaConfirmCodeController: MfaConfirmCodeController;
  let mfaConfirmCodeService: MfaConfirmCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignUpController, MfaConfirmCodeController],
      providers: [
        SignUpService,
        MfaConfirmCodeService,
        {
          provide: CognitoContract,
          useClass: CognitoProviderInMemory,
        },
      ],
    }).compile();

    signUpController = module.get<SignUpController>(SignUpController);
    signUpService = module.get<SignUpService>(SignUpService);
    mfaConfirmCodeController = module.get<MfaConfirmCodeController>(
      MfaConfirmCodeController
    );
    mfaConfirmCodeService = module.get<MfaConfirmCodeService>(
      MfaConfirmCodeService
    );
  });

  test('Deve estar definido', () => {
    expect(signUpController).toBeDefined();
    expect(signUpService).toBeDefined();
    expect(mfaConfirmCodeController).toBeDefined();
    expect(mfaConfirmCodeService).toBeDefined();
  });

  describe('mfaConfirmCode', () => {
    test('Deve ser possível confirmar o código MFA', async () => {
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

      const changePassword: MfaConfirmCodeDto = {
        accessToken: signUp.username,
        code: '123456',
      };
      const expectedResponse: OnlyMessageResponseDto = {
        message: MFA_CONFIRM_CODE_SUCCESS,
      };
      //Act
      const result = await mfaConfirmCodeController.mfaConfirmCode(
        changePassword
      );
      // //Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});
