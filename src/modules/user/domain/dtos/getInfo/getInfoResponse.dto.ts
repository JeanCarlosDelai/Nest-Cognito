import { UserAttributes } from '../../interfaces/userAttributes.interface';

export class GetInfoResponseDto {
  readonly username: string;
  readonly userAttributes: UserAttributes;

  constructor(username: string, userAttributes: UserAttributes) {
    this.username = username;
    this.userAttributes = userAttributes;
  }
}
