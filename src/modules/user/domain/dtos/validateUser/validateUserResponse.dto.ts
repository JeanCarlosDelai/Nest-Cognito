import { UserStatusType } from '@aws-sdk/client-cognito-identity-provider';

export class ValidateUserResponseDto {
  readonly userStatus: UserStatusType;

  constructor(userStatus: UserStatusType) {
    this.userStatus = userStatus;
  }
}
