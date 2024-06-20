import { Injectable } from '@nestjs/common';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';

import OnlyMessageResponseMapper from 'src/shared/common/mappings/OnlyMessageResponseMapper';
import { DELETED_USER_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { ExceptionCode } from 'src/shared/common/utils/exceptionCode';

@Injectable()
export class DeleteUserService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly cognitoProvider: CognitoContract) {}

  async deleteUser(accessToken: string): Promise<OnlyMessageResponseDto> {
    try {
      await this.cognitoProvider.deleteUserCommand(accessToken);
      return OnlyMessageResponseMapper.response(DELETED_USER_SUCCESS);
    } catch (error) {
      throw await ExceptionCode(error.name, error.message);
    }
  }
}
