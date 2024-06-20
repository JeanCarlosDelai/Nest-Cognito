import { Body, Controller, Post } from '@nestjs/common';

import { LoginDto } from '../domain/dtos/login/login.dto';
import { LoginResponseDto } from '../domain/dtos/login/loginResponse.dto';
import { LoginService } from '../services/login.service';
import { LoginSwaggerDecorator } from '../domain/customDecorators/loginSwaggerDecorator';

@Controller('api/v1/auth')
export class LoginController {
  // eslint-disable-next-line prettier/prettier
  constructor(private loginService: LoginService) { }

  @LoginSwaggerDecorator()
  @Post('/login')
  async login(@Body() login: LoginDto): Promise<LoginResponseDto> {
    return await this.loginService.login(login);
  }
}
