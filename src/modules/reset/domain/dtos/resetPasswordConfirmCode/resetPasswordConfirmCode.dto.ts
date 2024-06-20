import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, Validate } from 'class-validator';
import { UsernameValidator } from 'src/shared/common/pipes/usernameValidator.pipe';

export class ResetPasswordConfirmcodeDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @Validate(UsernameValidator)
  @IsString()
  readonly username: string;

  @ApiProperty({ type: String })
  @IsString()
  readonly code?: string;

  @ApiProperty({ type: String })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#%*])[a-zA-Z\d@#%*]{6,}/, {
    message: 'A senha informada não cumpre os parâmetros.',
  })
  @IsString()
  readonly password?: string;
}
