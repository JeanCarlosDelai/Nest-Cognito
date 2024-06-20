import { Test, TestingModule } from '@nestjs/testing';
import { SignUpController } from 'src/modules/user/controllers/signUp.controller';
import { SignUpConfirmController } from 'src/modules/user/controllers/signUpConfirm.controller';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { SignUpConfirmDto } from 'src/modules/user/domain/dtos/signUpConfirm/signUpConfirm.dto';
import { SignUpService } from 'src/modules/user/services/signUp.service';
import { SignUpConfirmService } from 'src/modules/user/services/signUpConfirm.service';
import { SIGN_UP_CONFIRM_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { CognitoProviderInMemory } from 'src/shared/providers/aws/cognito/in-memory/cognito.providerInMemory';

describe('SignUpCofirmControllerIntegration', () => {
  let signUpController: SignUpController;
  let signUpService: SignUpService;
  let signUpConfirmController: SignUpConfirmController;
  let signUpConfirmService: SignUpConfirmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignUpController, SignUpConfirmController],
      providers: [
        SignUpService,
        SignUpConfirmService,
        {
          provide: CognitoContract,
          useClass: CognitoProviderInMemory,
        },
      ],
    }).compile();
    signUpController = module.get<SignUpController>(SignUpController);
    signUpService = module.get<SignUpService>(SignUpService);
    signUpConfirmController = module.get<SignUpConfirmController>(
      SignUpConfirmController
    );
    signUpConfirmService =
      module.get<SignUpConfirmService>(SignUpConfirmService);
  });

  test('Deve estar definido', () => {
    expect(signUpController).toBeDefined();
    expect(signUpService).toBeDefined();
    expect(signUpConfirmController).toBeDefined();
    expect(signUpConfirmService).toBeDefined();
  });

  describe('signUpConfirm', () => {
    test('Deve ser possível confirmar o cadastro do usuário', async () => {
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

      const userSingUpConfirmUsuarioDto: SignUpConfirmDto = {
        username: signUp.username,
        code: '123456',
      };
      const espectedResponse: OnlyMessageResponseDto = {
        message: SIGN_UP_CONFIRM_SUCCESS,
      };
      //Act
      const result = await signUpConfirmController.signUpConfirm(
        userSingUpConfirmUsuarioDto
      );
      // //Assert
      expect(result).toEqual(espectedResponse);
    });
  });
});
