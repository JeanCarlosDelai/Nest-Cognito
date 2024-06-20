import { Body, Controller, Post } from '@nestjs/common';

import { OnlyMessageResponseDto } from '../../../shared/common/dtos/onlyMessageResponse.dto';
import { SignUpDto } from '../domain/dtos/signUp/signUp.dto';
import { SignUpService } from '../services/signUp.service';
import { SignUpSwaggerDecorator } from '../domain/customDecorators/signUpSwaggerDecorator';

@Controller('api/v1/user')
export class SignUpController {
  // eslint-disable-next-line prettier/prettier
  constructor(private signUpService: SignUpService) {}

  @SignUpSwaggerDecorator()
  @Post('sign-up')
  async signUp(@Body() signUp: SignUpDto): Promise<OnlyMessageResponseDto> {
    return await this.signUpService.signUp(signUp);
  }
}
