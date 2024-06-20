import {
  AdminGetUserCommandOutput,
  GetUserAttributeVerificationCodeCommandOutput,
  GetUserCommandOutput,
  InitiateAuthCommandOutput,
  UserStatusType,
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
import { Throws } from '../enum/throws.enum';
import { ThrowsMessages } from '../enum/throwsMessages.enum';

interface User {
  username: string;
  password: string;
  userStatus: UserStatusType;
  userAttributes: UserAttributes;
}

class UserAlreadyExistsError extends Error {
  constructor() {
    super(ThrowsMessages.USER_NAME_EXISTS_EXCEPTION);
    this.name = Throws.USER_NAME_EXISTS_EXCEPTION;
  }
}

class UserNotExistsError extends Error {
  constructor() {
    super(ThrowsMessages.USER_NOT_FOUND_EXCEPTION);
    this.name = Throws.USER_NOT_FOUND_EXCEPTION;
  }
}

class UserClientNotExistsError extends Error {
  constructor() {
    super(ThrowsMessages.USER_CLIENT_NOT_FOUND_EXCEPTION);
    this.name = Throws.USER_NOT_FOUND_EXCEPTION;
  }
}

class InvalidAccessTokenError extends Error {
  constructor() {
    super(ThrowsMessages.INVALID_ACCESS_TOKEN);
    this.name = Throws.NOT_AUTHORIZED_EXCEPTION;
  }
}

class InvalidCodeError extends Error {
  constructor() {
    super(ThrowsMessages.CODE_MISMATCH_EXCEPTION);
    this.name = Throws.CODE_MISMATCH_EXCEPTION;
  }
}

class IncorrectUsernamePasswordCombinationError extends Error {
  constructor() {
    super(ThrowsMessages.INCORRECT_PASSWORD);
    this.name = Throws.NOT_AUTHORIZED_EXCEPTION;
  }
}

@Injectable()
export class CognitoProviderInMemory implements CognitoContract {
  private users: User[] = [];

  async initiateAuthCommand(
    login: LoginDto
  ): Promise<InitiateAuthCommandOutput> {
    const userExists = this.users.find(
      user => user.username === login.username
    );
    if (!userExists) {
      throw new UserNotExistsError();
    }
    if (userExists.password != login.password) {
      throw new IncorrectUsernamePasswordCombinationError();
    }
    const response: InitiateAuthCommandOutput = {
      AuthenticationResult: {
        AccessToken: 'token',
        IdToken: 'token',
        RefreshToken: 'token',
      },
      $metadata: null,
    };

    return response;
  }

  async getUserAttributeVerificationCodeCommand(
    accessToken: string
  ): Promise<GetUserAttributeVerificationCodeCommandOutput> {
    const userExists = this.users.find(user => user.username === accessToken);
    if (!userExists) {
      throw new InvalidAccessTokenError();
    }
    const response: GetUserAttributeVerificationCodeCommandOutput = {
      $metadata: null,
      CodeDeliveryDetails: {
        Destination: 't***@t***',
      },
    };

    return response;
  }

  async verifyUserAttributeCommand(
    mfaConfirmCode: MfaConfirmCodeDto
  ): Promise<void> {
    const userExists = this.users.find(
      user => user.username === mfaConfirmCode.accessToken
    );
    if (!userExists) {
      throw new InvalidAccessTokenError();
    }
    if (mfaConfirmCode.code !== '123456') {
      throw new InvalidCodeError();
    }
  }

  async changePasswordCommand(
    changePassword: ChangePasswordDto
  ): Promise<void> {
    const userExists = this.users.find(
      user => user.username === changePassword.accessToken
    );
    if (!userExists) {
      throw new InvalidAccessTokenError();
    }
    if (userExists.password != changePassword.password) {
      throw new IncorrectUsernamePasswordCombinationError();
    }
    userExists.password = changePassword.newPassword;
  }

  async forgotPasswordCommand(username: string): Promise<void> {
    const userExists = this.users.find(user => user.username === username);
    if (!userExists) {
      throw new UserNotExistsError();
    }
  }

  async confirmForgotPasswordCommand(
    resetPasswordConfirmcode: ResetPasswordConfirmcodeDto
  ): Promise<void> {
    const userExists = this.users.find(
      user => user.username === resetPasswordConfirmcode.username
    );
    if (!userExists) {
      throw new UserNotExistsError();
    }
    if (resetPasswordConfirmcode.code !== '123456') {
      throw new InvalidCodeError();
    }
    userExists.password = resetPasswordConfirmcode.password;
  }

  async signUpCommand(
    signUp: SignUpDto,
    userAttributes: UserAttributes
  ): Promise<void> {
    const userExists = this.users.find(
      user => user.username === signUp.username
    );
    if (userExists) {
      throw new UserAlreadyExistsError();
    }
    this.users.push({
      username: signUp.username,
      password: signUp.password,
      userStatus: UserStatusType.UNCONFIRMED,
      userAttributes: userAttributes,
    });
  }

  async confirmSignUpCommand(singUpConfirm: SignUpConfirmDto): Promise<void> {
    const userExists = this.users.find(
      user => user.username === singUpConfirm.username
    );
    if (!userExists) {
      throw new UserClientNotExistsError();
    }
    if (singUpConfirm.code !== '123456') {
      throw new InvalidCodeError();
    }
    userExists.userStatus = UserStatusType.CONFIRMED;
  }

  async getUserCommand(accessToken: string): Promise<GetUserCommandOutput> {
    const userExists = this.users.find(user => user.username === accessToken);
    if (!userExists) {
      throw new InvalidAccessTokenError();
    }

    const response: GetUserCommandOutput = {
      Username: userExists.username,
      UserAttributes: userExists.userAttributes,
      $metadata: null,
    };

    return response;
  }

  async deleteUserCommand(accessToken: string): Promise<void> {
    const userExists = this.users.find(user => user.username === accessToken);
    if (!userExists) {
      throw new InvalidAccessTokenError();
    }
  }

  /// Admin

  async adminGetUserCommand(
    username: string
  ): Promise<AdminGetUserCommandOutput> {
    const userExists = this.users.find(user => user.username === username);
    if (!userExists) {
      throw new UserNotExistsError();
    }

    const response: AdminGetUserCommandOutput = {
      Username: userExists.username,
      UserStatus: userExists.userStatus,
      $metadata: null,
    };
    return response;
  }
}
