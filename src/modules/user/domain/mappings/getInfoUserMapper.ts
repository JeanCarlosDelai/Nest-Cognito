import { GetUserCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { GetInfoResponseDto } from '../dtos/getInfo/getInfoResponse.dto';

export default class GetInfoUserMapper {
  static response = (data: GetUserCommandOutput): GetInfoResponseDto => {
    return new GetInfoResponseDto(data.Username, data.UserAttributes);
  };
}
