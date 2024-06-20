import { Body, Controller, Post } from '@nestjs/common';

import { ResetPasswordSendcodeDto } from '../domain/dtos/resetPasswordSendCode/resetPasswordSendCode.dto';
import { ResetPasswordSendCodeService } from '../services/resetPasswordSendCode.service';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { ResetPasswordSendCodeSwaggerDecorator } from '../domain/customDecorators/resetPasswordSendCodeSwaggerDecorator';

@Controller('api/v1/reset')
export class ResetPasswordSendCodeController {
  constructor(
    private resetPasswordSendcodeService: ResetPasswordSendCodeService
  ) {}

  @ResetPasswordSendCodeSwaggerDecorator()
  @Post('/password/sendcode')
  async resetPasswordSendCode(
    @Body() resetPasswordSendcode: ResetPasswordSendcodeDto
  ): Promise<OnlyMessageResponseDto> {
    return await this.resetPasswordSendcodeService.resetPasswordSendCode(
      resetPasswordSendcode
    );
  }
}
