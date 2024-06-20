import { Injectable } from '@nestjs/common';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';

import { MfaConfirmCodeDto } from '../domain/dtos/mfaConfirmCode/mfaConfirmCode.dto';
import { OnlyMessageResponseDto } from '../../../shared/common/dtos/onlyMessageResponse.dto';
import OnlyMessageResponseMapper from '../../../shared/common/mappings/OnlyMessageResponseMapper';
import { MFA_CONFIRM_CODE_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { ExceptionCode } from 'src/shared/common/utils/exceptionCode';

@Injectable()
export class MfaConfirmCodeService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly cognitoProvider: CognitoContract) {}

  async mfaConfirmCode(
    mfaConfirmCode: MfaConfirmCodeDto
  ): Promise<OnlyMessageResponseDto> {
    try {
      await this.cognitoProvider.verifyUserAttributeCommand(mfaConfirmCode);
      return OnlyMessageResponseMapper.response(MFA_CONFIRM_CODE_SUCCESS);
    } catch (error) {
      throw await ExceptionCode(error.name, error.message);
    }
  }
}
