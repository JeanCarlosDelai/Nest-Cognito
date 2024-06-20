export class MfaSendCodeResponseDto {
  readonly message: string;
  readonly Destination: string;

  constructor(message: string, Destination: string) {
    this.message = message;
    this.Destination = Destination;
  }
}
