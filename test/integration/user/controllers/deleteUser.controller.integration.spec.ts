import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserController } from 'src/modules/user/controllers/deleteUser.controller';
import { SignUpController } from 'src/modules/user/controllers/signUp.controller';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { DeleteUserService } from 'src/modules/user/services/deleteUser.service';
import { SignUpService } from 'src/modules/user/services/signUp.service';
import { DELETED_USER_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { CognitoProviderInMemory } from 'src/shared/providers/aws/cognito/in-memory/cognito.providerInMemory';

describe('DeleteUserControllerIntegration', () => {
  let signUpController: SignUpController;
  let signUpService: SignUpService;
  let deleteUserController: DeleteUserController;
  let deleteUserService: DeleteUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignUpController, DeleteUserController],
      providers: [
        SignUpService,
        DeleteUserService,
        {
          provide: CognitoContract,
          useClass: CognitoProviderInMemory,
        },
      ],
    }).compile();

    signUpController = module.get<SignUpController>(SignUpController);
    signUpService = module.get<SignUpService>(SignUpService);
    deleteUserController =
      module.get<DeleteUserController>(DeleteUserController);
    deleteUserService = module.get<DeleteUserService>(DeleteUserService);
  });

  test('Deve estar definido', () => {
    expect(signUpController).toBeDefined();
    expect(signUpService).toBeDefined();
    expect(deleteUserController).toBeDefined();
    expect(deleteUserService).toBeDefined();
  });

  describe('deleteUser', () => {
    test('Deve ser possível excluir o cadastro do usuário', async () => {
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
      const expectedResponse: OnlyMessageResponseDto = {
        message: DELETED_USER_SUCCESS,
      };
      //Act
      const result = await deleteUserController.deleteUser(accessToken);
      // //Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});
