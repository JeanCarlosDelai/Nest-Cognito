import { Test, TestingModule } from '@nestjs/testing';
import { MfaSendCodeController } from 'src/modules/auth/controllers/mfaSendCode.controller';
import { MfaSendCodeResponseDto } from 'src/modules/auth/domain/dtos/mfaSendCode/mfaSendCodeResponse.dto';
import { MfaSendCodeService } from 'src/modules/auth/services/mfaSendCode.service';
import { SignUpController } from 'src/modules/user/controllers/signUp.controller';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { SignUpService } from 'src/modules/user/services/signUp.service';
import { MFA_SEND_CODE_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { CognitoProviderInMemory } from 'src/shared/providers/aws/cognito/in-memory/cognito.providerInMemory';

describe('MFAsendCodeControllerIntegration', () => {
  let signUpController: SignUpController;
  let signUpService: SignUpService;
  let mfaSendCodeController: MfaSendCodeController;
  let mfaSendCodeService: MfaSendCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignUpController, MfaSendCodeController],
      providers: [
        SignUpService,
        MfaSendCodeService,
        {
          provide: CognitoContract,
          useClass: CognitoProviderInMemory,
        },
      ],
    }).compile();

    signUpController = module.get<SignUpController>(SignUpController);
    signUpService = module.get<SignUpService>(SignUpService);
    mfaSendCodeController = module.get<MfaSendCodeController>(
      MfaSendCodeController
    );
    mfaSendCodeService = module.get<MfaSendCodeService>(MfaSendCodeService);
  });

  test('Deve estar definido', () => {
    expect(signUpController).toBeDefined();
    expect(signUpService).toBeDefined();
    expect(mfaSendCodeController).toBeDefined();
    expect(mfaSendCodeService).toBeDefined();
  });

  describe('mfaSendCode', () => {
    test('Deve ser possível enviar o código MFA', async () => {
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

      const accessToken = signUp.username;
      const expectedResponse: MfaSendCodeResponseDto = {
        message: MFA_SEND_CODE_SUCCESS,
        Destination: 't***@t***',
      };
      //Act
      const result = await mfaSendCodeController.mfaSendCode(accessToken);
      // //Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});
