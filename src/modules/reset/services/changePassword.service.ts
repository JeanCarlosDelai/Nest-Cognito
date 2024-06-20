import { Injectable } from '@nestjs/common';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';

import OnlyMessageResponseMapper from '../../../shared/common/mappings/OnlyMessageResponseMapper';
import { CHANGE_PASSWORD_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { OnlyMessageResponseDto } from '../../../shared/common/dtos/onlyMessageResponse.dto';
import { ExceptionCode } from 'src/shared/common/utils/exceptionCode';
import { ChangePasswordDto } from '../domain/dtos/changePassword/changePassword.dto';

@Injectable()
export class ChangePasswordService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly cognitoProvider: CognitoContract) {}

  async changePassword(
    ChangePassword: ChangePasswordDto
  ): Promise<OnlyMessageResponseDto> {
    try {
      await this.cognitoProvider.changePasswordCommand(ChangePassword);
      return OnlyMessageResponseMapper.response(CHANGE_PASSWORD_SUCCESS);
    } catch (error) {
      throw await ExceptionCode(error.name, error.message);
    }
  }
}
