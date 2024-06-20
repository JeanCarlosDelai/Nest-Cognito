import { Query, Controller, Get } from '@nestjs/common';

import { ValidateUserService } from '../services/validateUser.service';
import { ValidateUserDto } from '../domain/dtos/validateUser/validateUser.dto';
import { ValidateUserResponseDto } from '../domain/dtos/validateUser/validateUserResponse.dto';
import { ValidateUserSwaggerDecorator } from '../domain/customDecorators/validateUserSwaggerDecorator';

@Controller('api/v1/user')
export class ValidateUserController {
  // eslint-disable-next-line prettier/prettier
  constructor(private validateUserService: ValidateUserService) {}

  @ValidateUserSwaggerDecorator()
  @Get('validate')
  async validateUser(
    @Query() validateUser: ValidateUserDto
  ): Promise<ValidateUserResponseDto> {
    return await this.validateUserService.validateUser(validateUser);
  }
}
