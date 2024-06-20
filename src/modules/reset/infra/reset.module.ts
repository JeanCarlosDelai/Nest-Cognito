import { Module } from '@nestjs/common';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { CognitoModule } from 'src/shared/providers/aws/cognito/cognito.module';
import { CognitoProvider } from 'src/shared/providers/aws/cognito/implementation/cognito.provider';

import { ResetPasswordConfirmCodeController } from '../controllers/resetPasswordConfirmCode.controller';
import { ResetPasswordSendCodeController } from '../controllers/resetPasswordSendCode.controller';
import { ResetPasswordConfirmCodeService } from '../services/resetPasswordConfirmCode.service';
import { ResetPasswordSendCodeService } from '../services/resetPasswordSendCode.service';
import { ChangePasswordController } from '../controllers/changePassword.controller';
import { ChangePasswordService } from '../services/changePassword.service';

@Module({
  imports: [CognitoModule],
  providers: [
    ResetPasswordConfirmCodeService,
    ResetPasswordSendCodeService,
    ChangePasswordService,
    {
      provide: CognitoContract,
      useClass: CognitoProvider,
    },
  ],
  controllers: [
    ResetPasswordConfirmCodeController,
    ResetPasswordSendCodeController,
    ChangePasswordController,
  ],
})
// eslint-disable-next-line prettier/prettier
export class ResetModule {}
