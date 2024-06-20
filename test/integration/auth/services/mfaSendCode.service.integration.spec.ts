import { GetUserAttributeVerificationCodeCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MfaSendCodeResponseDto } from 'src/modules/auth/domain/dtos/mfaSendCode/mfaSendCodeResponse.dto';
import { MfaSendCodeService } from 'src/modules/auth/services/mfaSendCode.service';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { SignUpService } from 'src/modules/user/services/signUp.service';
import { MFA_SEND_CODE_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { Throws } from 'src/shared/providers/aws/cognito/enum/throws.enum';
import { ThrowsMessages } from 'src/shared/providers/aws/cognito/enum/throwsMessages.enum';
import { CognitoProviderInMemory } from 'src/shared/providers/aws/cognito/in-memory/cognito.providerInMemory';

describe('MfaSendCodeServiceIntegration', () => {
  let signUpService: SignUpService;
  let mfaSendCodeService: MfaSendCodeService;
  let cognito: CognitoContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpService,
        MfaSendCodeService,
        {
          provide: CognitoContract,
          useClass: CognitoProviderInMemory,
        },
      ],
    }).compile();

    signUpService = module.get<SignUpService>(SignUpService);
    mfaSendCodeService = module.get<MfaSendCodeService>(MfaSendCodeService);
    cognito = module.get<CognitoContract>(CognitoContract);
  });

  test('Deve estar definido', () => {
    expect(signUpService).toBeDefined();
    expect(mfaSendCodeService).toBeDefined();
    expect(cognito).toBeDefined();
  });

  describe('mfaSendCode', () => {
    test('Deve ser possível enviar para o e-mail o código MFA', async () => {
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

      const accessToken = signUp.username;
      const expectedResponse: GetUserAttributeVerificationCodeCommandOutput = {
        $metadata: undefined,
        CodeDeliveryDetails: {
          Destination: 't***@t***',
        },
      };

      const mappedResponse = new MfaSendCodeResponseDto(
        MFA_SEND_CODE_SUCCESS,
        expectedResponse.CodeDeliveryDetails.Destination
      );
      //Act
      const result = await mfaSendCodeService.mfaSendCode(accessToken);
      //Assert
      expect(result).toEqual(mappedResponse);
    });

    test('Não deve ser possível enviar o código MFA pois o accessToken é inválido', async () => {
      // Arrange
      const accessToken = '123ff';
      // Act / Assert
      try {
        await mfaSendCodeService.mfaSendCode(accessToken);
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
