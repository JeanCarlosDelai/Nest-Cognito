import { Injectable } from '@nestjs/common';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';

import OnlyMessageResponseMapper from 'src/shared/common/mappings/OnlyMessageResponseMapper';
import { SIGN_UP_CONFIRM_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { SignUpConfirmDto } from '../domain/dtos/signUpConfirm/signUpConfirm.dto';
import { ExceptionCode } from 'src/shared/common/utils/exceptionCode';

@Injectable()
export class SignUpConfirmService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly cognitoProvider: CognitoContract) {}

  async signUpConfirm(
    signUpConfirm: SignUpConfirmDto
  ): Promise<OnlyMessageResponseDto> {
    try {
      await this.cognitoProvider.confirmSignUpCommand(signUpConfirm);
      return OnlyMessageResponseMapper.response(SIGN_UP_CONFIRM_SUCCESS);
    } catch (error) {
      throw await ExceptionCode(error.name, error.message);
    }
  }
}
