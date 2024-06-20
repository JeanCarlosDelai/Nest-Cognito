import { Injectable } from '@nestjs/common';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';

import { ResetPasswordSendcodeDto } from '../domain/dtos/resetPasswordSendCode/resetPasswordSendCode.dto';
import OnlyMessageResponseMapper from 'src/shared/common/mappings/OnlyMessageResponseMapper';
import { RESET_PASSWORD_SEND_CODE_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { ExceptionCode } from 'src/shared/common/utils/exceptionCode';

@Injectable()
export class ResetPasswordSendCodeService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly cognitoProvider: CognitoContract) {}

  async resetPasswordSendCode(
    resetPasswordSendcode: ResetPasswordSendcodeDto
  ): Promise<OnlyMessageResponseDto> {
    try {
      await this.cognitoProvider.forgotPasswordCommand(
        resetPasswordSendcode.username
      );
      return OnlyMessageResponseMapper.response(
        RESET_PASSWORD_SEND_CODE_SUCCESS
      );
    } catch (error) {
      throw await ExceptionCode(error.name, error.message);
    }
  }
}
