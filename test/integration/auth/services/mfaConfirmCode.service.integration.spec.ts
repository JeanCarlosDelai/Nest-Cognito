import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MfaConfirmCodeDto } from 'src/modules/auth/domain/dtos/mfaConfirmCode/mfaConfirmCode.dto';
import { MfaConfirmCodeService } from 'src/modules/auth/services/mfaConfirmCode.service';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { SignUpService } from 'src/modules/user/services/signUp.service';
import { MFA_CONFIRM_CODE_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { Throws } from 'src/shared/providers/aws/cognito/enum/throws.enum';
import { ThrowsMessages } from 'src/shared/providers/aws/cognito/enum/throwsMessages.enum';
import { CognitoProviderInMemory } from 'src/shared/providers/aws/cognito/in-memory/cognito.providerInMemory';

describe('MfaConfirmCodeServiceUnit', () => {
  let signUpService: SignUpService;
  let mfaConfirmCodeService: MfaConfirmCodeService;
  let cognito: CognitoContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpService,
        MfaConfirmCodeService,
        {
          provide: CognitoContract,
          useClass: CognitoProviderInMemory,
        },
      ],
    }).compile();

    signUpService = module.get<SignUpService>(SignUpService);
    mfaConfirmCodeService = module.get<MfaConfirmCodeService>(
      MfaConfirmCodeService
    );
    cognito = module.get<CognitoContract>(CognitoContract);
  });

  test('Deve estar definido', () => {
    expect(signUpService).toBeDefined();
    expect(mfaConfirmCodeService).toBeDefined();
    expect(cognito).toBeDefined();
  });

  describe('mfaConfirmCode', () => {
    test('Deve ser possível confirmar o código MFA', async () => {
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

      const mfaConfirmCode: MfaConfirmCodeDto = {
        accessToken: signUp.username,
        code: '123456',
      };
      const expectedResponse: OnlyMessageResponseDto = {
        message: MFA_CONFIRM_CODE_SUCCESS,
      };
      //Act
      const result = await mfaConfirmCodeService.mfaConfirmCode(mfaConfirmCode);
      //Assert
      expect(result).toEqual(expectedResponse);
    });

    test('Não deve ser possível confirmar o código MFA pois o token é inválido', async () => {
      // Arrange
      const mfaConfirmCode: MfaConfirmCodeDto = {
        accessToken: '123',
        code: '123456',
      };
      // Act / Assert
      try {
        await mfaConfirmCodeService.mfaConfirmCode(mfaConfirmCode);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.response).toEqual({
          statusCode: 500,
          message: [ThrowsMessages.INVALID_ACCESS_TOKEN],
          error: Throws.NOT_AUTHORIZED_EXCEPTION,
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
      const mfaConfirmCode: MfaConfirmCodeDto = {
        accessToken: signUp.username,
        code: '123',
      };
      await signUpService.signUp(signUp);
      // Act / Assert
      try {
        await mfaConfirmCodeService.mfaConfirmCode(mfaConfirmCode);
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
