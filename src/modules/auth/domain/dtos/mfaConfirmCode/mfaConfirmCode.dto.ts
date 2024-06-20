import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MfaConfirmCodeDto {
  @ApiProperty({ type: String, default: 'token' })
  @IsNotEmpty()
  @IsString()
  readonly accessToken: string;

  @ApiProperty({ type: String, default: '123456' })
  @IsNotEmpty()
  @IsString()
  readonly code: string;
}
