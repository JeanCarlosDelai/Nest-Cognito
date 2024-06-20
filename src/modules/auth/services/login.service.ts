import { Injectable } from '@nestjs/common';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';

import { LoginDto } from '../domain/dtos/login/login.dto';
import { LoginResponseDto } from '../domain/dtos/login/loginResponse.dto';
import AuthLoginMapper from '../domain/mappings/loginMapper';
import { ExceptionCode } from 'src/shared/common/utils/exceptionCode';

@Injectable()
export class LoginService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly cognitoProvider: CognitoContract) {}

  async login(login: LoginDto): Promise<LoginResponseDto> {
    try {
      const response = await this.cognitoProvider.initiateAuthCommand(login);
      return AuthLoginMapper.response(response);
    } catch (error) {
      throw await ExceptionCode(error.name, error.message);
    }
  }
}
