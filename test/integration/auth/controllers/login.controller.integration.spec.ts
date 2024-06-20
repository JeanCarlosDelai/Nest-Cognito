import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from 'src/modules/auth/controllers/login.controller';
import { LoginDto } from 'src/modules/auth/domain/dtos/login/login.dto';
import { LoginResponseDto } from 'src/modules/auth/domain/dtos/login/loginResponse.dto';
import { LoginService } from 'src/modules/auth/services/login.service';
import { SignUpController } from 'src/modules/user/controllers/signUp.controller';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { SignUpService } from 'src/modules/user/services/signUp.service';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { CognitoProviderInMemory } from 'src/shared/providers/aws/cognito/in-memory/cognito.providerInMemory';

describe('LoginControllerIntegration', () => {
  let signUpController: SignUpController;
  let signUpService: SignUpService;
  let loginController: LoginController;
  let loginService: LoginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignUpController, LoginController],
      providers: [
        SignUpService,
        LoginService,
        {
          provide: CognitoContract,
          useClass: CognitoProviderInMemory,
        },
      ],
    }).compile();

    signUpController = module.get<SignUpController>(SignUpController);
    signUpService = module.get<SignUpService>(SignUpService);
    loginController = module.get<LoginController>(LoginController);
    loginService = module.get<LoginService>(LoginService);
  });

  test('Deve estar definido', () => {
    expect(signUpController).toBeDefined();
    expect(signUpService).toBeDefined();
    expect(loginController).toBeDefined();
    expect(loginService).toBeDefined();
  });

  describe('login', () => {
    test('Deve ser possível efetuar o login', async () => {
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

      const login: LoginDto = {
        username: signUp.username,
        password: signUp.password,
      };
      const expectedResponse: LoginResponseDto = {
        AccessToken: 'token',
        IdToken: 'token',
        RefreshToken: 'token',
      };
      //Act
      const result = await loginController.login(login);
      // //Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});
