import { Injectable } from '@nestjs/common';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';

import OnlyMessageResponseMapper from 'src/shared/common/mappings/OnlyMessageResponseMapper';
import { SIGN_UP_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { SignUpDto } from '../domain/dtos/signUp/signUp.dto';
import { UserAttributes } from '../domain/interfaces/userAttributes.interface';
import { ExceptionCode } from 'src/shared/common/utils/exceptionCode';

@Injectable()
export class SignUpService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly cognitoProvider: CognitoContract) {}

  async signUp(singUp: SignUpDto): Promise<OnlyMessageResponseDto> {
    try {
      const userAttributes = this.userAttributes(singUp);
      await this.cognitoProvider.signUpCommand(singUp, userAttributes);
      return OnlyMessageResponseMapper.response(SIGN_UP_SUCCESS);
    } catch (error) {
      throw await ExceptionCode(error.name, error.message);
    }
  }

  private userAttributes(singUp: SignUpDto): UserAttributes {
    return [
      {
        Name: 'email',
        Value: singUp.email,
      },
      {
        Name: 'phone_number',
        Value: singUp.phoneNumber,
      },
      {
        Name: 'birthdate',
        Value: singUp.birthdate,
      },
      {
        Name: 'name',
        Value: singUp.firstName,
      },
      {
        Name: 'custom:last_name',
        Value: singUp.lastName,
      },
      // {
      //   Name: 'custom:mfa_lastconfirmation',
      //   Value: '',
      // },
    ];
  }
}
