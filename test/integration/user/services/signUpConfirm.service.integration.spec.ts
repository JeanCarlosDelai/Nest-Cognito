import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { SignUpConfirmDto } from 'src/modules/user/domain/dtos/signUpConfirm/signUpConfirm.dto';
import { SignUpService } from 'src/modules/user/services/signUp.service';
import { SignUpConfirmService } from 'src/modules/user/services/signUpConfirm.service';
import { SIGN_UP_CONFIRM_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { Throws } from 'src/shared/providers/aws/cognito/enum/throws.enum';
import { ThrowsMessages } from 'src/shared/providers/aws/cognito/enum/throwsMessages.enum';
import { CognitoProviderInMemory } from 'src/shared/providers/aws/cognito/in-memory/cognito.providerInMemory';
describe('SignUpConfirmServiceIntegration', () => {
  let signUpService: SignUpService;
  let signUpConfirmService: SignUpConfirmService;
  let cognito: CognitoContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpService,
        SignUpConfirmService,
        {
          provide: CognitoContract,
          useClass: CognitoProviderInMemory,
        },
      ],
    }).compile();
    signUpService = module.get<SignUpService>(SignUpService);
    signUpConfirmService =
      module.get<SignUpConfirmService>(SignUpConfirmService);
    cognito = module.get<CognitoContract>(CognitoContract);
  });

  test('Deve estar definido', () => {
    expect(signUpService).toBeDefined();
    expect(signUpConfirmService).toBeDefined();
    expect(cognito).toBeDefined();
  });

  describe('singUpConfirm', () => {
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
      await signUpService.signUp(signUp);

      const signUpConfirm: SignUpConfirmDto = {
        username: signUp.username,
        code: '123456',
      };
      const expectedResponse: OnlyMessageResponseDto = {
        message: SIGN_UP_CONFIRM_SUCCESS,
      };
      //Act
      const result = await signUpConfirmService.signUpConfirm(signUpConfirm);
      //Assert
      expect(result).toEqual(expectedResponse);
    });

    test('Não deve ser possível confirmar o cadastro do usuário se o usuário não existe', async () => {
      // Arrange
      const signUpConfirm: SignUpConfirmDto = {
        username: '456456',
        code: '123456',
      };
      // Act / Assert
      try {
        await signUpConfirmService.signUpConfirm(signUpConfirm);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.response).toEqual({
          statusCode: 500,
          message: [ThrowsMessages.USER_CLIENT_NOT_FOUND_EXCEPTION],
          error: Throws.USER_NOT_FOUND_EXCEPTION,
        });
      }
    });

    test('Não deve ser possível confirmar o cadastro do usuário se o código for inválido', async () => {
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
      const signUpConfirm: SignUpConfirmDto = {
        username: signUp.username,
        code: '123456789',
      };
      await signUpService.signUp(signUp);
      // Act / Assert
      try {
        await signUpConfirmService.signUpConfirm(signUpConfirm);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.response).toEqual({
          statusCode: 500,
          message: [ThrowsMessages.CODE_MISMATCH_EXCEPTION],
          error: Throws.CODE_MISMATCH_EXCEPTION,
        });
      }
    });
  });
});
