import {
  AdminGetUserCommandOutput,
  GetUserAttributeVerificationCodeCommandOutput,
  GetUserCommandOutput,
  InitiateAuthCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { ChangePasswordDto } from 'src/modules/reset/domain/dtos/changePassword/changePassword.dto';
import { LoginDto } from 'src/modules/auth/domain/dtos/login/login.dto';
import { MfaConfirmCodeDto } from 'src/modules/auth/domain/dtos/mfaConfirmCode/mfaConfirmCode.dto';
import { ResetPasswordConfirmcodeDto } from 'src/modules/reset/domain/dtos/resetPasswordConfirmCode/resetPasswordConfirmCode.dto';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { SignUpConfirmDto } from 'src/modules/user/domain/dtos/signUpConfirm/signUpConfirm.dto';
import { UserAttributes } from 'src/modules/user/domain/interfaces/userAttributes.interface';

export abstract class CognitoContract {
  abstract initiateAuthCommand(
    login: LoginDto
  ): Promise<InitiateAuthCommandOutput>;

  abstract getUserAttributeVerificationCodeCommand(
    accessToken: string
  ): Promise<GetUserAttributeVerificationCodeCommandOutput>;

  abstract verifyUserAttributeCommand(
    mfaSendCode: MfaConfirmCodeDto
  ): Promise<void>;

  abstract changePasswordCommand(
    changePassword: ChangePasswordDto
  ): Promise<void>;

  abstract forgotPasswordCommand(username: string): Promise<void>;

  abstract confirmForgotPasswordCommand(
    resetPasswordConfirmcode: ResetPasswordConfirmcodeDto
  ): Promise<void>;

  abstract signUpCommand(
    signUp: SignUpDto,
    userAttributes: UserAttributes
  ): Promise<void>;

  abstract confirmSignUpCommand(signUpConfirm: SignUpConfirmDto): Promise<void>;

  abstract getUserCommand(accessToken: string): Promise<GetUserCommandOutput>;

  abstract deleteUserCommand(accessToken: string): Promise<void>;

  //Admin

  abstract adminGetUserCommand(
    username: string
  ): Promise<AdminGetUserCommandOutput>;
}
