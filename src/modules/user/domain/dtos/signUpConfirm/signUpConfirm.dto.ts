import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { UsernameValidator } from 'src/shared/common/pipes/usernameValidator.pipe';

export class SignUpConfirmDto {
  @ApiProperty({ type: String, default: '01234567899' })
  @IsString()
  @IsNotEmpty()
  @Validate(UsernameValidator)
  readonly username: string;

  @ApiProperty({ type: String, default: '123456' })
  @IsString()
  @IsNotEmpty()
  readonly code: string;
}
