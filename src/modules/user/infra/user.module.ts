import { Module } from '@nestjs/common';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { CognitoModule } from 'src/shared/providers/aws/cognito/cognito.module';
import { CognitoProvider } from 'src/shared/providers/aws/cognito/implementation/cognito.provider';
import { SignUpService } from '../services/signUp.service';
import { SignUpController } from '../controllers/signUp.controller';
import { DeleteUserController } from '../controllers/deleteUser.controller';
import { DeleteUserService } from '../services/deleteUser.service';
import { GetInfoUserService } from '../services/getInfoUser.service';
import { GetInfoUserController } from '../controllers/getInfoUser.controller';
import { SignUpConfirmService } from '../services/signUpConfirm.service';
import { ValidateUserService } from '../services/validateUser.service';
import { ValidateUserController } from '../controllers/validateUser.controller';
import { SignUpConfirmController } from '../controllers/signUpConfirm.controller';

@Module({
  imports: [CognitoModule],
  providers: [
    SignUpService,
    DeleteUserService,
    GetInfoUserService,
    SignUpConfirmService,
    ValidateUserService,
    {
      provide: CognitoContract,
      useClass: CognitoProvider,
    },
  ],
  controllers: [
    SignUpController,
    SignUpConfirmController,
    DeleteUserController,
    GetInfoUserController,
    ValidateUserController,
  ],
})
// eslint-disable-next-line prettier/prettier
export class UserModule {}
