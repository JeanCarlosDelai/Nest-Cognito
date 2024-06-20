import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { MfaSendCodeResponseDto } from '../domain/dtos/mfaSendCode/mfaSendCodeResponse.dto';
import { MfaSendCodeService } from '../services/mfaSendCode.service';
import { MfaSendCodeSwaggerDecorator } from '../domain/customDecorators/mfaSendCodeSwaggerDecorator';

@Controller('api/v1/auth')
export class MfaSendCodeController {
  // eslint-disable-next-line prettier/prettier
  constructor(private mfaSendCodeService: MfaSendCodeService) {}

  @UseGuards(AuthGuard('jwt'))
  @MfaSendCodeSwaggerDecorator()
  @Get('/mfa/sendcode')
  async mfaSendCode(
    @Headers('accessToken') accessToken: string
  ): Promise<MfaSendCodeResponseDto> {
    return await this.mfaSendCodeService.mfaSendCode(accessToken);
  }
}
