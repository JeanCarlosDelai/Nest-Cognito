import { Test, TestingModule } from '@nestjs/testing';
import { ChangePasswordController } from 'src/modules/reset/controllers/changePassword.controller';
import { ChangePasswordDto } from 'src/modules/reset/domain/dtos/changePassword/changePassword.dto';
import { ChangePasswordService } from 'src/modules/reset/services/changePassword.service';
import { SignUpController } from 'src/modules/user/controllers/signUp.controller';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { SignUpService } from 'src/modules/user/services/signUp.service';
import { CHANGE_PASSWORD_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { CognitoProviderInMemory } from 'src/shared/providers/aws/cognito/in-memory/cognito.providerInMemory';

describe('ChangePasswordControllerIntegration', () => {
  let signUpController: SignUpController;
  let signUpService: SignUpService;
  let changePasswordController: ChangePasswordController;
  let changePasswordService: ChangePasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignUpController, ChangePasswordController],
      providers: [
        SignUpService,
        ChangePasswordService,
        {
          provide: CognitoContract,
          useClass: CognitoProviderInMemory,
        },
      ],
    }).compile();

    signUpController = module.get<SignUpController>(SignUpController);
    signUpService = module.get<SignUpService>(SignUpService);
    changePasswordController = module.get<ChangePasswordController>(
      ChangePasswordController
    );
    changePasswordService = module.get<ChangePasswordService>(
      ChangePasswordService
    );
  });

  test('Deve estar definido', () => {
    expect(signUpController).toBeDefined();
    expect(signUpService).toBeDefined();
    expect(changePasswordController).toBeDefined();
    expect(changePasswordService).toBeDefined();
  });

  describe('changePassword', () => {
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

      const changePassword: ChangePasswordDto = {
        password: signUp.password,
        newPassword: '123',
        accessToken: signUp.username,
      };
      const expectedResponse: OnlyMessageResponseDto = {
        message: CHANGE_PASSWORD_SUCCESS,
      };
      //Act
      const result = await changePasswordController.changePassword(
        changePassword
      );
      // //Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});
