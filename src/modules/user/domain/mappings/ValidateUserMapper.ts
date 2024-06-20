import { UserStatusType } from '@aws-sdk/client-cognito-identity-provider';
import { ValidateUserResponseDto } from '../dtos/validateUser/validateUserResponse.dto';

export default class ValidateUserMapper {
  static response = (userStatus: UserStatusType): ValidateUserResponseDto => {
    return new ValidateUserResponseDto(userStatus);
  };
}
