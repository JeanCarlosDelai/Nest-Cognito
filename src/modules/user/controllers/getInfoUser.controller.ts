import { Controller, Get, Headers, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { GetInfoUserService } from '../services/getInfoUser.service';
import { GetInfoResponseDto } from '../domain/dtos/getInfo/getInfoResponse.dto';
import { GetInfoUserSwaggerDecorator } from '../domain/customDecorators/getInfoUserSwaggerDecorator';

@Controller('api/v1/user')
export class GetInfoUserController {
  // eslint-disable-next-line prettier/prettier
  constructor(private getInfoUserService: GetInfoUserService) {}

  @UseGuards(AuthGuard('jwt'))
  @GetInfoUserSwaggerDecorator()
  @Get('info')
  async getInfoUser(
    @Headers('accessToken') accessToken: string
  ): Promise<GetInfoResponseDto> {
    return await this.getInfoUserService.getInfoUser(accessToken);
  }
}
