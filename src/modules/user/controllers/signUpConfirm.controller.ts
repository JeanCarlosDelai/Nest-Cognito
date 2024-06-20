import { Body, Controller, Post } from '@nestjs/common';

import { OnlyMessageResponseDto } from '../../../shared/common/dtos/onlyMessageResponse.dto';
import { SignUpConfirmService } from '../services/signUpConfirm.service';
import { SignUpConfirmDto } from '../domain/dtos/signUpConfirm/signUpConfirm.dto';
import { SignUpConfirmSwaggerDecorator } from '../domain/customDecorators/signUpConfirmSwaggerDecorator';

@Controller('api/v1/user')
export class SignUpConfirmController {
  // eslint-disable-next-line prettier/prettier
  constructor(private signUpConfirmService: SignUpConfirmService) {}

  @SignUpConfirmSwaggerDecorator()
  @Post('sign-up/confirm')
  async signUpConfirm(
    @Body() signUpConfirm: SignUpConfirmDto
  ): Promise<OnlyMessageResponseDto> {
    return await this.signUpConfirmService.signUpConfirm(signUpConfirm);
  }
}
