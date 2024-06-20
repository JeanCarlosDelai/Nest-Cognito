import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ResetPasswordSendcodeDto } from 'src/modules/reset/domain/dtos/resetPasswordSendCode/resetPasswordSendCode.dto';
import { ResetPasswordSendCodeService } from 'src/modules/reset/services/resetPasswordSendCode.service';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { SignUpService } from 'src/modules/user/services/signUp.service';
import { RESET_PASSWORD_SEND_CODE_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { Throws } from 'src/shared/providers/aws/cognito/enum/throws.enum';
import { ThrowsMessages } from 'src/shared/providers/aws/cognito/enum/throwsMessages.enum';
import { CognitoProviderInMemory } from 'src/shared/providers/aws/cognito/in-memory/cognito.providerInMemory';

describe('ResetPasswordSendCodeServiceUnit', () => {
  let signUpService: SignUpService;
  let resetPasswordSendCodeService: ResetPasswordSendCodeService;
  let cognito: CognitoContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpService,
        ResetPasswordSendCodeService,
        {
          provide: CognitoContract,
          useClass: CognitoProviderInMemory,
        },
      ],
    }).compile();

    signUpService = module.get<SignUpService>(SignUpService);
    resetPasswordSendCodeService = module.get<ResetPasswordSendCodeService>(
      ResetPasswordSendCodeService
    );
    cognito = module.get<CognitoContract>(CognitoContract);
  });

  test('Deve estar definido', () => {
    expect(signUpService).toBeDefined();
    expect(resetPasswordSendCodeService).toBeDefined();
    expect(cognito).toBeDefined();
  });

  describe('resetPasswordSendCode', () => {
    test('Deve ser possível enviar para o e-mail o código para reset de senha', async () => {
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

      const resetPasswordSendCode: ResetPasswordSendcodeDto = {
        username: signUp.username,
      };
      const expectedResponse: OnlyMessageResponseDto = {
        message: RESET_PASSWORD_SEND_CODE_SUCCESS,
      };
      //Act
      const result = await resetPasswordSendCodeService.resetPasswordSendCode(
        resetPasswordSendCode
      );
      //Assert
      expect(result).toEqual(expectedResponse);
    });

    test('Não deve ser possível enviar para o e-mail para um usuário que não existe', async () => {
      // Arrange
      const resetPasswordSendCode: ResetPasswordSendcodeDto = {
        username: '123',
      };
      // Act / Assert
      try {
        await resetPasswordSendCodeService.resetPasswordSendCode(
          resetPasswordSendCode
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
  });
});
