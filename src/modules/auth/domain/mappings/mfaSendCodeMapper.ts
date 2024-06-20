import { GetUserAttributeVerificationCodeCommandOutput } from '@aws-sdk/client-cognito-identity-provider';

import { MfaSendCodeResponseDto } from '../dtos/mfaSendCode/mfaSendCodeResponse.dto';

export default class MfaSendCodeMapper {
  static response = (
    message: string,
    data: GetUserAttributeVerificationCodeCommandOutput
  ): MfaSendCodeResponseDto => {
    return new MfaSendCodeResponseDto(
      message,
      data.CodeDeliveryDetails.Destination
    );
  };
}
