import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ type: String, default: '12345678910' })
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty({ type: String, default: '12345678910' })
  @IsNotEmpty()
  @IsString()
  readonly newPassword: string;

  @ApiProperty({ type: String, default: 'token' })
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly accessToken: string;
}
