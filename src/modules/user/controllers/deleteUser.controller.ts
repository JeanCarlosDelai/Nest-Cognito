import { Controller, Delete, Headers, UseGuards } from '@nestjs/common';

import { OnlyMessageResponseDto } from '../../../shared/common/dtos/onlyMessageResponse.dto';
import { DeleteUserService } from '../services/deleteUser.service';
import { AuthGuard } from '@nestjs/passport';
import { DeleteUserSwaggerDecorator } from '../domain/customDecorators/deleteUserSwaggerDecorator';

@Controller('api/v1/user')
export class DeleteUserController {
  // eslint-disable-next-line prettier/prettier
  constructor(private deleteUserService: DeleteUserService) {}

  @UseGuards(AuthGuard('jwt'))
  @DeleteUserSwaggerDecorator()
  @Delete()
  async deleteUser(
    @Headers('accessToken') accessToken: string
  ): Promise<OnlyMessageResponseDto> {
    return await this.deleteUserService.deleteUser(accessToken);
  }
}
