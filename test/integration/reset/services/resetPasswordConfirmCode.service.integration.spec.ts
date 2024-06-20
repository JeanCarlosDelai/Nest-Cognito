import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ResetPasswordConfirmcodeDto } from 'src/modules/reset/domain/dtos/resetPasswordConfirmCode/resetPasswordConfirmCode.dto';
import { ResetPasswordConfirmCodeService } from 'src/modules/reset/services/resetPasswordConfirmCode.service';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { SignUpService } from 'src/modules/user/services/signUp.service';
import { CHANGE_PASSWORD_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { Throws } from 'src/shared/providers/aws/cognito/enum/throws.enum';
import { ThrowsMessages } from 'src/shared/providers/aws/cognito/enum/throwsMessages.enum';
import { CognitoProviderInMemory } from 'src/shared/providers/aws/cognito/in-memory/cognito.providerInMemory';

describe('ResetPasswordConfirmCodeServiceIntegration', () => {
  let signUpService: SignUpService;
  let resetPasswordConfirmCodeService: ResetPasswordConfirmCodeService;
  let cognito: CognitoContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpService,
        ResetPasswordConfirmCodeService,
        {
          provide: CognitoContract,
          useClass: CognitoProviderInMemory,
        },
      ],
    }).compile();

    signUpService = module.get<SignUpService>(SignUpService);
    resetPasswordConfirmCodeService =
      module.get<ResetPasswordConfirmCodeService>(
        ResetPasswordConfirmCodeService
      );
    cognito = module.get<CognitoContract>(CognitoContract);
  });

  test('Deve estar definido', () => {
    expect(signUpService).toBeDefined();
    expect(resetPasswordConfirmCodeService).toBeDefined();
    expect(cognito).toBeDefined();
  });

  describe('resetPassworrConfirmCode', () => {
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
      await signUpService.signUp(signUp);

      const resetPasswordConfirmCode: ResetPasswordConfirmcodeDto = {
        username: signUp.username,
        code: '123456',
        password: '2222',
      };
      const expectedResponse: OnlyMessageResponseDto = {
        message: CHANGE_PASSWORD_SUCCESS,
      };
      //Act
      const result =
        await resetPasswordConfirmCodeService.resetPasswordConfirmCode(
          resetPasswordConfirmCode
        );
      //Assert
      expect(result).toEqual(expectedResponse);
    });

    test('Não deve ser possível confirmar o código MFA pois o token é inválido', async () => {
      // Arrange
      const resetPasswordConfirmCode: ResetPasswordConfirmcodeDto = {
        username: '11',
        code: '123456',
        password: '2222',
      };
      // Act / Assert
      try {
        await resetPasswordConfirmCodeService.resetPasswordConfirmCode(
          resetPasswordConfirmCode
        );
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.response).toEqual({
          statusCode: 500,
          message: [ThrowsMessages.USER_NOT_FOUND_EXCEPTION],
          error: Throws.USER_NOT_FOUND_EXCEPTION,
        });
      }
    });

    test('Não deve ser possível confirmar o cadastro do usuário se o código for inválido', async () => {
      // Arrange
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

      const resetPasswordConfirmCode: ResetPasswordConfirmcodeDto = {
        username: '01234567900',
        code: '222',
        password: '2222',
      };
      // Act / Assert
      try {
        await resetPasswordConfirmCodeService.resetPasswordConfirmCode(
          resetPasswordConfirmCode
        );
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
