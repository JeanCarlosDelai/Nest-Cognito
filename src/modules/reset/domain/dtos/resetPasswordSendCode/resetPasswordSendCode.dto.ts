import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { UsernameValidator } from 'src/shared/common/pipes/usernameValidator.pipe';

export class ResetPasswordSendcodeDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @Validate(UsernameValidator)
  @IsString()
  readonly username: string;
}
