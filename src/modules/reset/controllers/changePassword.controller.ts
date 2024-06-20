import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ChangePasswordDto } from '../domain/dtos/changePassword/changePassword.dto';
import { ChangePasswordService } from '../services/changePassword.service';
import { OnlyMessageResponseDto } from '../../../shared/common/dtos/onlyMessageResponse.dto';
import { ChangePasswordSwaggerDecorator } from '../domain/customDecorators/changePasswordSwaggerDecorator';

@Controller('api/v1/auth')
export class ChangePasswordController {
  // eslint-disable-next-line prettier/prettier
  constructor(private changePasswordService: ChangePasswordService) { }

  @UseGuards(AuthGuard('jwt'))
  @ChangePasswordSwaggerDecorator()
  @Put('/reset/password')
  async changePassword(
    @Body() changePassword: ChangePasswordDto
  ): Promise<OnlyMessageResponseDto> {
    return await this.changePasswordService.changePassword(changePassword);
  }
}
