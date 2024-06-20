import {
  AdminGetUserCommand,
  AdminGetUserCommandInput,
  AdminGetUserCommandOutput,
  AuthFlowType,
  ChangePasswordCommand,
  ChangePasswordCommandInput,
  CognitoIdentityProviderClient,
  CognitoIdentityProviderClientConfig,
  ConfirmForgotPasswordCommand,
  ConfirmForgotPasswordCommandInput,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandInput,
  DeleteUserCommand,
  DeleteUserCommandInput,
  ForgotPasswordCommand,
  ForgotPasswordCommandInput,
  GetUserAttributeVerificationCodeCommand,
  GetUserAttributeVerificationCodeCommandInput,
  GetUserAttributeVerificationCodeCommandOutput,
  GetUserCommand,
  GetUserCommandInput,
  GetUserCommandOutput,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  InitiateAuthCommandOutput,
  SignUpCommand,
  SignUpCommandInput,
  VerifyUserAttributeCommand,
  VerifyUserAttributeCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable } from '@nestjs/common';
import { ChangePasswordDto } from 'src/modules/reset/domain/dtos/changePassword/changePassword.dto';
import { LoginDto } from 'src/modules/auth/domain/dtos/login/login.dto';
import { MfaConfirmCodeDto } from 'src/modules/auth/domain/dtos/mfaConfirmCode/mfaConfirmCode.dto';
import { ResetPasswordConfirmcodeDto } from 'src/modules/reset/domain/dtos/resetPasswordConfirmCode/resetPasswordConfirmCode.dto';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { SignUpConfirmDto } from 'src/modules/user/domain/dtos/signUpConfirm/signUpConfirm.dto';
import { UserAttributes } from 'src/modules/user/domain/interfaces/userAttributes.interface';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { AttributeName } from '../enum/attributeName.enum';

@Injectable()
export class CognitoProvider implements CognitoContract {
  private userPoolId = process.env.COGNITO_USER_POOL_ID;
  private clientId = process.env.COGNITO_CLIENT_ID;
  private region = process.env.AWS_REGION;
  private accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  private secretAccessKey = process.env.AWS_SECRET_KEY;

  private config: CognitoIdentityProviderClientConfig = {
    region: this.region,
  };
  private client = new CognitoIdentityProviderClient(this.config);

  private configAdmin: CognitoIdentityProviderClientConfig = {
    region: this.region,
    credentials: {
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
    },
  };
  private clientAdmin = new CognitoIdentityProviderClient(this.configAdmin);

  async initiateAuthCommand(
    login: LoginDto
  ): Promise<InitiateAuthCommandOutput> {
    const input: InitiateAuthCommandInput = {
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: login.username,
        PASSWORD: login.password,
      },
    };
    const command = new InitiateAuthCommand(input);
    return await this.client.send(command);
  }

  async getUserAttributeVerificationCodeCommand(
    accessToken: string
  ): Promise<GetUserAttributeVerificationCodeCommandOutput> {
    const input: GetUserAttributeVerificationCodeCommandInput = {
      AccessToken: accessToken,
      AttributeName: AttributeName.EMAIL,
    };
    const command = new GetUserAttributeVerificationCodeCommand(input);
    return await this.client.send(command);
  }

  async verifyUserAttributeCommand(
    mfaConfirmCode: MfaConfirmCodeDto
  ): Promise<void> {
    const input: VerifyUserAttributeCommandInput = {
      AccessToken: mfaConfirmCode.accessToken,
      AttributeName: AttributeName.EMAIL,
      Code: mfaConfirmCode.code,
    };
    const command = new VerifyUserAttributeCommand(input);
    await this.client.send(command);
  }

  async changePasswordCommand(
    changePassword: ChangePasswordDto
  ): Promise<void> {
    const input: ChangePasswordCommandInput = {
      PreviousPassword: changePassword.password,
      ProposedPassword: changePassword.newPassword,
      AccessToken: changePassword.accessToken,
    };
    const command = new ChangePasswordCommand(input);
    await this.client.send(command);
  }

  async forgotPasswordCommand(username: string): Promise<void> {
    const input: ForgotPasswordCommandInput = {
      ClientId: this.clientId,
      Username: username,
    };
    const command = new ForgotPasswordCommand(input);
    await this.client.send(command);
  }

  async confirmForgotPasswordCommand(
    resetPasswordConfirmcode: ResetPasswordConfirmcodeDto
  ): Promise<void> {
    const input: ConfirmForgotPasswordCommandInput = {
      ClientId: this.clientId,
      Username: resetPasswordConfirmcode.username,
      ConfirmationCode: resetPasswordConfirmcode.code,
      Password: resetPasswordConfirmcode.password,
    };
    const command = new ConfirmForgotPasswordCommand(input);
    await this.client.send(command);
  }

  async signUpCommand(
    signUp: SignUpDto,
    userAttributes: UserAttributes
  ): Promise<void> {
    const input: SignUpCommandInput = {
      ClientId: this.clientId,
      Username: signUp.username,
      Password: signUp.password,
      UserAttributes: userAttributes,
    };
    const command = new SignUpCommand(input);
    await this.client.send(command);
  }

  async confirmSignUpCommand(singUpConfirm: SignUpConfirmDto): Promise<void> {
    const input: ConfirmSignUpCommandInput = {
      ClientId: this.clientId,
      Username: singUpConfirm.username,
      ConfirmationCode: singUpConfirm.code,
    };
    const command = new ConfirmSignUpCommand(input);
    await this.client.send(command);
  }

  async getUserCommand(accessToken: string): Promise<GetUserCommandOutput> {
    const input: GetUserCommandInput = {
      AccessToken: accessToken,
    };
    const command = new GetUserCommand(input);
    return await this.client.send(command);
  }

  async deleteUserCommand(accessToken: string): Promise<void> {
    const input: DeleteUserCommandInput = {
      AccessToken: accessToken,
    };
    const command = new DeleteUserCommand(input);
    await this.client.send(command);
  }

  /// Admin

  async adminGetUserCommand(
    username: string
  ): Promise<AdminGetUserCommandOutput> {
    const input: AdminGetUserCommandInput = {
      UserPoolId: this.userPoolId,
      Username: username,
    };
    const command = new AdminGetUserCommand(input);
    return await this.clientAdmin.send(command);
  }
}
