import { UserStatusType } from '@aws-sdk/client-cognito-identity-provider';
import { Test, TestingModule } from '@nestjs/testing';
import { SignUpController } from 'src/modules/user/controllers/signUp.controller';
import { ValidateUserController } from 'src/modules/user/controllers/validateUser.controller';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { ValidateUserDto } from 'src/modules/user/domain/dtos/validateUser/validateUser.dto';
import { ValidateUserResponseDto } from 'src/modules/user/domain/dtos/validateUser/validateUserResponse.dto';
import { SignUpService } from 'src/modules/user/services/signUp.service';
import { ValidateUserService } from 'src/modules/user/services/validateUser.service';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { CognitoProviderInMemory } from 'src/shared/providers/aws/cognito/in-memory/cognito.providerInMemory';

describe('ValidateUserControllerIntegration', () => {
  let signUpController: SignUpController;
  let signUpService: SignUpService;
  let validateUserController: ValidateUserController;
  let validateUserService: ValidateUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignUpController, ValidateUserController],
      providers: [
        SignUpService,
        ValidateUserService,
        {
          provide: CognitoContract,
          useClass: CognitoProviderInMemory,
        },
      ],
    }).compile();

    signUpController = module.get<SignUpController>(SignUpController);
    signUpService = module.get<SignUpService>(SignUpService);
    validateUserController = module.get<ValidateUserController>(
      ValidateUserController
    );
    validateUserService = module.get<ValidateUserService>(ValidateUserService);
  });

  test('Deve estar definido', () => {
    expect(signUpController).toBeDefined();
    expect(signUpService).toBeDefined();
    expect(validateUserController).toBeDefined();
    expect(validateUserService).toBeDefined();
  });

  describe('validate', () => {
    test('Deve ser possível retornar e validar o usuário (Sucesso)', async () => {
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

      const usernameValidateDto: ValidateUserDto = {
        username: signUp.username,
      };
      const expectedResponse: ValidateUserResponseDto = {
        userStatus: UserStatusType.UNCONFIRMED,
      };
      //Act
      const result = await validateUserController.validateUser(
        usernameValidateDto
      );
      // //Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});
