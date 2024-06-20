import { Injectable } from '@nestjs/common';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';

import { ResetPasswordConfirmcodeDto } from '../domain/dtos/resetPasswordConfirmCode/resetPasswordConfirmCode.dto';
import OnlyMessageResponseMapper from 'src/shared/common/mappings/OnlyMessageResponseMapper';
import { CHANGE_PASSWORD_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { ExceptionCode } from 'src/shared/common/utils/exceptionCode';
@Injectable()
export class ResetPasswordConfirmCodeService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly cognitoProvider: CognitoContract) {}

  async resetPasswordConfirmCode(
    resetPasswordConfirmcode: ResetPasswordConfirmcodeDto
  ): Promise<OnlyMessageResponseDto> {
    try {
      await this.cognitoProvider.confirmForgotPasswordCommand(
        resetPasswordConfirmcode
      );
      return OnlyMessageResponseMapper.response(CHANGE_PASSWORD_SUCCESS);
    } catch (error) {
      throw await ExceptionCode(error.name, error.message);
    }
  }
}
