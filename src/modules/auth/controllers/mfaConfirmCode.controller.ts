import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { MfaConfirmCodeDto } from '../domain/dtos/mfaConfirmCode/mfaConfirmCode.dto';
import { MfaConfirmCodeService } from '../services/mfaConfirmCode.service';
import { OnlyMessageResponseDto } from '../../../shared/common/dtos/onlyMessageResponse.dto';
import { MfaConfirmCodeSwaggerDecorator } from '../domain/customDecorators/mfaConfirmCodeSwaggerDecorator';

@Controller('api/v1/auth')
export class MfaConfirmCodeController {
  // eslint-disable-next-line prettier/prettier
  constructor(private mfaConfirmCodeService: MfaConfirmCodeService) {}

  @UseGuards(AuthGuard('jwt'))
  @MfaConfirmCodeSwaggerDecorator()
  @Post('/mfa/confirmCode')
  async mfaConfirmCode(
    @Body() mfaConfirmCode: MfaConfirmCodeDto
  ): Promise<OnlyMessageResponseDto> {
    return await this.mfaConfirmCodeService.mfaConfirmCode(mfaConfirmCode);
  }
}
