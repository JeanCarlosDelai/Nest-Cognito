import { Test, TestingModule } from '@nestjs/testing';
import { SignUpController } from 'src/modules/user/controllers/signUp.controller';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { SignUpService } from 'src/modules/user/services/signUp.service';
import { SIGN_UP_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { CognitoProviderInMemory } from 'src/shared/providers/aws/cognito/in-memory/cognito.providerInMemory';

describe('SignUpControllerIntegration', () => {
  let signUpController: SignUpController;
  let signUpService: SignUpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignUpController],
      providers: [
        SignUpService,
        {
          provide: CognitoContract,
          useClass: CognitoProviderInMemory,
        },
      ],
    }).compile();

    signUpController = module.get<SignUpController>(SignUpController);
    signUpService = module.get<SignUpService>(SignUpService);
  });

  test('Deve estar definido', () => {
    expect(signUpController).toBeDefined();
    expect(signUpService).toBeDefined();
  });

  describe('signUp', () => {
    test('Deve ser possível realizar o cadastro do usuário', async () => {
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
      const expectedResponse: OnlyMessageResponseDto = {
        message: SIGN_UP_SUCCESS,
      };
      //Act
      const result = await signUpController.signUp(signUp);
      // //Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});
