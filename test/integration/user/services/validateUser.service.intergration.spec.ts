import {
  AdminGetUserCommandOutput,
  UserStatusType,
} from '@aws-sdk/client-cognito-identity-provider';
import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { ValidateUserDto } from 'src/modules/user/domain/dtos/validateUser/validateUser.dto';
import { ValidateUserResponseDto } from 'src/modules/user/domain/dtos/validateUser/validateUserResponse.dto';
import { SignUpService } from 'src/modules/user/services/signUp.service';
import { ValidateUserService } from 'src/modules/user/services/validateUser.service';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { Throws } from 'src/shared/providers/aws/cognito/enum/throws.enum';
import { ThrowsMessages } from 'src/shared/providers/aws/cognito/enum/throwsMessages.enum';
import { CognitoProviderInMemory } from 'src/shared/providers/aws/cognito/in-memory/cognito.providerInMemory';

describe('ValidateUserServiceIntegration', () => {
  let signUpService: SignUpService;
  let validateUserService: ValidateUserService;
  let cognito: CognitoContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpService,
        ValidateUserService,
        {
          provide: CognitoContract,
          useClass: CognitoProviderInMemory,
        },
      ],
    }).compile();

    signUpService = module.get<SignUpService>(SignUpService);
    validateUserService = module.get<ValidateUserService>(ValidateUserService);
    cognito = module.get<CognitoContract>(CognitoContract);
  });

  test('Deve estar definido', () => {
    expect(signUpService).toBeDefined();
    expect(validateUserService).toBeDefined();
    expect(cognito).toBeDefined();
  });

  describe('validate', () => {
    test('Deve ser possível retornar o status do usuário', async () => {
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
      await signUpService.signUp(signUp);

      const validateUser: ValidateUserDto = {
        username: signUp.username,
      };
      const expectedResponse: AdminGetUserCommandOutput = {
        Username: signUp.username,
        UserStatus: UserStatusType.UNCONFIRMED,
        $metadata: null,
      };
      const mappedResponse = new ValidateUserResponseDto(
        expectedResponse.UserStatus
      );
      //Act
      const result = await validateUserService.validateUser(validateUser);
      //Assert
      expect(result).toEqual(mappedResponse);
    });

    test('Não deve ser possível retornar o status do usuário se ele não existe', async () => {
      // Arrange
      const validateUser: ValidateUserDto = {
        username: '01234567900',
      };
      // Act / Assert
      try {
        await validateUserService.validateUser(validateUser);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.response).toEqual({
          statusCode: 500,
          message: [ThrowsMessages.USER_NOT_FOUND_EXCEPTION],
          error: Throws.USER_NOT_FOUND_EXCEPTION,
        });
      }
    });
  });
});
