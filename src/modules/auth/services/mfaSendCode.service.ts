import { Injectable } from '@nestjs/common';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';

import { MfaSendCodeResponseDto } from '../domain/dtos/mfaSendCode/mfaSendCodeResponse.dto';
import MfaSendCodeMapper from '../domain/mappings/mfaSendCodeMapper';
import { MFA_SEND_CODE_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { ExceptionCode } from 'src/shared/common/utils/exceptionCode';

@Injectable()
export class MfaSendCodeService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly cognitoProvider: CognitoContract) {}

  async mfaSendCode(accessToken: string): Promise<MfaSendCodeResponseDto> {
    try {
      const response =
        await this.cognitoProvider.getUserAttributeVerificationCodeCommand(
          accessToken
        );
      return MfaSendCodeMapper.response(MFA_SEND_CODE_SUCCESS, response);
    } catch (error) {
      throw await ExceptionCode(error.name, error.message);
    }
  }
}
