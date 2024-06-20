import { Injectable } from '@nestjs/common';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';

import { ValidateUserDto } from '../domain/dtos/validateUser/validateUser.dto';
import ValidateUserMapper from '../domain/mappings/ValidateUserMapper';
import { ValidateUserResponseDto } from '../domain/dtos/validateUser/validateUserResponse.dto';
import { ExceptionCode } from 'src/shared/common/utils/exceptionCode';

@Injectable()
export class ValidateUserService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly cognitoProvider: CognitoContract) {}

  async validateUser(
    validateUser: ValidateUserDto
  ): Promise<ValidateUserResponseDto> {
    try {
      const userValidate = await this.cognitoProvider.adminGetUserCommand(
        validateUser.username
      );
      return ValidateUserMapper.response(userValidate.UserStatus);
    } catch (error) {
      throw await ExceptionCode(error.name, error.message);
    }
  }
}
