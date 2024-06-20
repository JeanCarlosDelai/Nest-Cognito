import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { UsernameValidator } from 'src/shared/common/pipes/usernameValidator.pipe';

export class LoginDto {
  @ApiProperty({ type: String, default: '12345678910' })
  @Validate(UsernameValidator)
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @ApiProperty({ type: String, default: '12345678910' })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
