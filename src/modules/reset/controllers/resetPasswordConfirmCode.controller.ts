import { Body, Controller, Post } from '@nestjs/common';

import { ResetPasswordConfirmcodeDto } from '../domain/dtos/resetPasswordConfirmCode/resetPasswordConfirmCode.dto';
import { ResetPasswordConfirmCodeService } from '../services/resetPasswordConfirmCode.service';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { ResetPasswordConfirmCodeSwaggerDecorator } from '../domain/customDecorators/resetPasswordConfirmCodeSwaggerDecorator';

@Controller('api/v1/reset')
export class ResetPasswordConfirmCodeController {
  constructor(
    private resetPasswordConfirmCodeService: ResetPasswordConfirmCodeService
  ) {}

  @ResetPasswordConfirmCodeSwaggerDecorator()
  @Post('/password')
  async resetPasswordConfirmCode(
    @Body() resetPasswordConfirmCode: ResetPasswordConfirmcodeDto
  ): Promise<OnlyMessageResponseDto> {
    return await this.resetPasswordConfirmCodeService.resetPasswordConfirmCode(
      resetPasswordConfirmCode
    );
  }
}
