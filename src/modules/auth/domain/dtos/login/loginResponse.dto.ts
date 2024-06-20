export class LoginResponseDto {
  readonly AccessToken: string;
  readonly IdToken: string;
  readonly RefreshToken: string;

  constructor(AccessToken: string, IdToken: string, RefreshToken: string) {
    this.AccessToken = AccessToken;
    this.IdToken = IdToken;
    this.RefreshToken = RefreshToken;
  }
}
