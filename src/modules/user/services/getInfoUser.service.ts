import { Injectable } from '@nestjs/common';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';

import { GetInfoResponseDto } from '../domain/dtos/getInfo/getInfoResponse.dto';
import GetInfoUserMapper from '../domain/mappings/getInfoUserMapper';
import { ExceptionCode } from 'src/shared/common/utils/exceptionCode';

@Injectable()
export class GetInfoUserService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly cognitoProvider: CognitoContract) {}

  async getInfoUser(accessToken: string): Promise<GetInfoResponseDto> {
    try {
      const userInfo = await this.cognitoProvider.getUserCommand(accessToken);
      return GetInfoUserMapper.response(userInfo);
    } catch (error) {
      throw await ExceptionCode(error.name, error.message);
    }
  }
}
