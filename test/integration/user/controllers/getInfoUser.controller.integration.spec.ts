import { Test, TestingModule } from '@nestjs/testing';
import { GetInfoUserController } from 'src/modules/user/controllers/getInfoUser.controller';
import { SignUpController } from 'src/modules/user/controllers/signUp.controller';
import { GetInfoResponseDto } from 'src/modules/user/domain/dtos/getInfo/getInfoResponse.dto';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { GetInfoUserService } from 'src/modules/user/services/getInfoUser.service';
import { SignUpService } from 'src/modules/user/services/signUp.service';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { CognitoProviderInMemory } from 'src/shared/providers/aws/cognito/in-memory/cognito.providerInMemory';

describe('GetinfoUserControllerIntegration', () => {
  let signUpController: SignUpController;
  let signUpService: SignUpService;
  let getInfoUserController: GetInfoUserController;
  let getInfoUserService: GetInfoUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignUpController, GetInfoUserController],
      providers: [
        SignUpService,
        GetInfoUserService,
        {
          provide: CognitoContract,
          useClass: CognitoProviderInMemory,
        },
      ],
    }).compile();

    signUpController = module.get<SignUpController>(SignUpController);
    signUpService = module.get<SignUpService>(SignUpService);
    getInfoUserController = module.get<GetInfoUserController>(
      GetInfoUserController
    );
    getInfoUserService = module.get<GetInfoUserService>(GetInfoUserService);
  });

  test('Deve estar definido', () => {
    expect(signUpController).toBeDefined();
    expect(signUpService).toBeDefined();
    expect(getInfoUserController).toBeDefined();
    expect(getInfoUserService).toBeDefined();
  });

  describe('getInfo', () => {
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

      const accessToken = signUp.username;
      const expectedResponse: GetInfoResponseDto = {
        username: signUp.username,
        userAttributes: [
          {
            Name: 'email',
            Value: signUp.email,
          },
          {
            Name: 'phone_number',
            Value: signUp.phoneNumber,
          },
          {
            Name: 'birthdate',
            Value: signUp.birthdate,
          },
          {
            Name: 'name',
            Value: signUp.firstName,
          },
          {
            Name: 'custom:last_name',
            Value: signUp.lastName,
          },
        ],
      };
      //Act
      const result = await getInfoUserController.getInfoUser(accessToken);
      // //Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});
