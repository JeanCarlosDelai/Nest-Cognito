import { InitiateAuthCommandOutput } from '@aws-sdk/client-cognito-identity-provider';

import { LoginResponseDto } from '../dtos/login/loginResponse.dto';

export default class LoginMapper {
  static response = (data: InitiateAuthCommandOutput): LoginResponseDto => {
    return new LoginResponseDto(
      data.AuthenticationResult.AccessToken,
      data.AuthenticationResult.IdToken,
      data.AuthenticationResult.RefreshToken
    );
  };
}
