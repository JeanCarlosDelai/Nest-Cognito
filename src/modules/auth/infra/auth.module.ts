import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { CognitoModule } from 'src/shared/providers/aws/cognito/cognito.module';
import { CognitoProvider } from 'src/shared/providers/aws/cognito/implementation/cognito.provider';

import { LoginController } from '../controllers/login.controller';
import { MfaConfirmCodeController } from '../controllers/mfaConfirmCode.controller';
import { MfaSendCodeController } from '../controllers/mfaSendCode.controller';
import { LoginService } from '../services/login.service';
import { MfaConfirmCodeService } from '../services/mfaConfirmCode.service';
import { MfaSendCodeService } from '../services/mfaSendCode.service';

import { JwtStrategy } from '../../../shared/common/strategys/jwt.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), CognitoModule],
  providers: [
    JwtStrategy,
    LoginService,
    MfaSendCodeService,
    MfaConfirmCodeService,
    {
      provide: CognitoContract,
      useClass: CognitoProvider,
    },
  ],
  controllers: [
    LoginController,
    MfaSendCodeController,
    MfaConfirmCodeController,
  ],
})
// eslint-disable-next-line prettier/prettier
export class AuthModule { }
