import { GetUserAttributeVerificationCodeCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { Test, TestingModule } from '@nestjs/testing';
import { MfaSendCodeResponseDto } from 'src/modules/auth/domain/dtos/mfaSendCode/mfaSendCodeResponse.dto';
import { MfaSendCodeService } from 'src/modules/auth/services/mfaSendCode.service';
import { MFA_SEND_CODE_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { vi } from 'vitest';

describe('MfaSendCodeServiceUnit', () => {
  let mfaSendCodeService: MfaSendCodeService;
  let cognito: CognitoContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MfaSendCodeService,
        {
          provide: CognitoContract,
          useValue: {
            getUserAttributeVerificationCodeCommand: vi.fn(),
          },
        },
      ],
    }).compile();

    mfaSendCodeService = module.get<MfaSendCodeService>(MfaSendCodeService);
    cognito = module.get<CognitoContract>(CognitoContract);
  });

  test('Deve estar definido', () => {
    expect(mfaSendCodeService).toBeDefined();
    expect(cognito).toBeDefined();
  });

  describe('mfaSendCode', () => {
    test('Deve ser possível enviar para o e-mail o código para reset de senha', async () => {
      //Arrange
      const accessToken = '123';
      const expectedResponse: GetUserAttributeVerificationCodeCommandOutput = {
        $metadata: undefined,
        CodeDeliveryDetails: {
          Destination: '123',
        },
      };
      vi.spyOn(
        cognito,
        'getUserAttributeVerificationCodeCommand'
      ).mockResolvedValueOnce(expectedResponse);

      const mappedResponse = new MfaSendCodeResponseDto(
        MFA_SEND_CODE_SUCCESS,
        expectedResponse.CodeDeliveryDetails.Destination
      );
      //Act
      const result = await mfaSendCodeService.mfaSendCode(accessToken);
      //Assert
      expect(result).toEqual(mappedResponse);
    });

    test('Deve ser possível lançar uma exceção', async () => {
      // Arrange
      const errorMessage = 'error';
      const error = new Error(errorMessage);
      error.name = 'erroException';
      vi.spyOn(
        cognito,
        'getUserAttributeVerificationCodeCommand'
      ).mockRejectedValue(error);
      // Act & Assert
      await expect(mfaSendCodeService.mfaSendCode(null)).rejects.toThrowError();
    });
  });
});
