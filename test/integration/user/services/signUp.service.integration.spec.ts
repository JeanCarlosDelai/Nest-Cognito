import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { SignUpService } from 'src/modules/user/services/signUp.service';
import { SIGN_UP_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { Throws } from 'src/shared/providers/aws/cognito/enum/throws.enum';
import { ThrowsMessages } from 'src/shared/providers/aws/cognito/enum/throwsMessages.enum';
import { CognitoProviderInMemory } from 'src/shared/providers/aws/cognito/in-memory/cognito.providerInMemory';

describe('SignUpServiceIntegration', () => {
  let signUpService: SignUpService;
  let cognito: CognitoContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpService,
        {
          provide: CognitoContract,
          useClass: CognitoProviderInMemory,
        },
      ],
    }).compile();

    signUpService = module.get<SignUpService>(SignUpService);
    cognito = module.get<CognitoContract>(CognitoContract);
  });

  test('Deve estar definido', () => {
    expect(signUpService).toBeDefined();
    expect(cognito).toBeDefined();
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
      const result = await signUpService.signUp(signUp);
      //Assert
      expect(result).toEqual(expectedResponse);
    });

    test('Não deve ser possível realizar o cadastro do usuário novamente', async () => {
      // Arrange
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

      // Act / Assert
      try {
        await signUpService.signUp(signUp);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.response).toEqual({
          statusCode: 500,
          message: [ThrowsMessages.USER_NAME_EXISTS_EXCEPTION],
          error: Throws.USER_NAME_EXISTS_EXCEPTION,
        });
      }
    });
  });
});
