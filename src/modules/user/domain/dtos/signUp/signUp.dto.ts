import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  Validate,
} from 'class-validator';
import { BirthdateValidator } from 'src/shared/common/pipes/birthdateValidator.pipe';
import { PhoneNumberValidator } from 'src/shared/common/pipes/phoneNumberValidator.pipe';
import { UsernameValidator } from 'src/shared/common/pipes/usernameValidator.pipe';

export class SignUpDto {
  @ApiProperty({ type: String, default: 'test@test.com.br' })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ type: String, default: '+5554999008899' })
  @IsString()
  @IsNotEmpty()
  @Validate(PhoneNumberValidator)
  readonly phoneNumber: string;

  @ApiProperty({ type: String, default: '01234567899' })
  @IsString()
  @IsNotEmpty()
  @Validate(UsernameValidator)
  readonly username: string;

  @ApiProperty({ type: String, default: 'test' })
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({ type: String, default: 'test' })
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({ type: String, default: '123@Test123' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#%*])[a-zA-Z\d@#%*]{6,}/, {
    message: 'Please provide a valid password',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ type: String, default: '12/12/2000' })
  @IsString()
  @IsNotEmpty()
  @Validate(BirthdateValidator)
  readonly birthdate: string;
}
