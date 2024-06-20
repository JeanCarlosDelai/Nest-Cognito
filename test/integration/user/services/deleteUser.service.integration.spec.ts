import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { DeleteUserService } from 'src/modules/user/services/deleteUser.service';
import { SignUpService } from 'src/modules/user/services/signUp.service';
import { DELETED_USER_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { Throws } from 'src/shared/providers/aws/cognito/enum/throws.enum';
import { ThrowsMessages } from 'src/shared/providers/aws/cognito/enum/throwsMessages.enum';
import { CognitoProviderInMemory } from 'src/shared/providers/aws/cognito/in-memory/cognito.providerInMemory';

describe('DeleteUserServiceIntegration', () => {
  let signUpService: SignUpService;
  let deleteUserService: DeleteUserService;
  let cognito: CognitoContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpService,
        DeleteUserService,
        {
          provide: CognitoContract,
          useClass: CognitoProviderInMemory,
        },
      ],
    }).compile();

    signUpService = module.get<SignUpService>(SignUpService);
    deleteUserService = module.get<DeleteUserService>(DeleteUserService);
    cognito = module.get<CognitoContract>(CognitoContract);
  });

  test('Deve estar definido', () => {
    expect(signUpService).toBeDefined();
    expect(deleteUserService).toBeDefined();
    expect(cognito).toBeDefined();
  });

  describe('deleteUser', () => {
    test('Deve ser possível efetuar a exclusão do usuário', async () => {
      //Arrange
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '54999999999',
        username: '123123123',
        firstName: 'teste',
        lastName: 'teste',
        password: '123123',
        birthdate: '07/11/2000',
      };
      await signUpService.signUp(signUp);

      const accessToken = signUp.username;
      const expectedResponse: OnlyMessageResponseDto = {
        message: DELETED_USER_SUCCESS,
      };
      //Act
      const result = await deleteUserService.deleteUser(accessToken);
      //Assert
      expect(result).toEqual(expectedResponse);
    });

    test('Não deve ser possível excluír o usuário se o código for inválido', async () => {
      // Arrange
      const accessToken = '123ff';
      // Act / Assert
      try {
        await deleteUserService.deleteUser(accessToken);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.response).toEqual({
          statusCode: 500,
          message: [ThrowsMessages.INVALID_ACCESS_TOKEN],
          error: Throws.NOT_AUTHORIZED_EXCEPTION,
        });
      }
    });
  });
});
