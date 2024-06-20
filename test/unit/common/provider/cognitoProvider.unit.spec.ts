import { CognitoProvider } from 'src/shared/providers/aws/cognito/implementation/cognito.provider';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  GetUserAttributeVerificationCodeCommand,
  VerifyUserAttributeCommand,
  ChangePasswordCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  GetUserCommand,
  DeleteUserCommand,
  AdminGetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { vi } from 'vitest';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { UserAttributes } from 'src/modules/user/domain/interfaces/userAttributes.interface';
import { ResetPasswordConfirmcodeDto } from 'src/modules/reset/domain/dtos/resetPasswordConfirmCode/resetPasswordConfirmCode.dto';
import { SignUpConfirmDto } from 'src/modules/user/domain/dtos/signUpConfirm/signUpConfirm.dto';
import { MfaConfirmCodeDto } from 'src/modules/auth/domain/dtos/mfaConfirmCode/mfaConfirmCode.dto';

vi.mock('@aws-sdk/client-cognito-identity-provider');

describe('CognitoProvider', () => {
  let provider: CognitoProvider;

  beforeEach(() => {
    provider = new CognitoProvider();
  });

  test('Deve ser possível chamar a função InitiateAuthCommand corretamente', async () => {
    const loginDto = { username: 'testuser', password: 'testpassword' };
    const commandOutput = { AuthenticationResult: { AccessToken: 'token' } };

    (
      CognitoIdentityProviderClient.prototype.send as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(commandOutput);

    const result = await provider.initiateAuthCommand(loginDto);

    expect(CognitoIdentityProviderClient.prototype.send).toHaveBeenCalledWith(
      expect.any(InitiateAuthCommand)
    );
    expect(result).toEqual(commandOutput);
  });

  test('Deve ser possível chamar a função GetUserAttributeVerificationCodeCommand corretamente', async () => {
    const accessToken = 'testAccessToken';
    const commandOutput = { CodeDeliveryDetails: { AttributeName: 'email' } };

    (
      CognitoIdentityProviderClient.prototype.send as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(commandOutput);

    const result = await provider.getUserAttributeVerificationCodeCommand(
      accessToken
    );

    expect(CognitoIdentityProviderClient.prototype.send).toHaveBeenCalledWith(
      expect.any(GetUserAttributeVerificationCodeCommand)
    );
    expect(result).toEqual(commandOutput);
  });

  test('Deve ser possível chamar a função VerifyUserAttributeCommand corretamente', async () => {
    const mfaConfirmCodeDto: MfaConfirmCodeDto = {
      accessToken: 'testAccessToken',
      code: '123456',
    };
    const commandOutput = undefined;

    (
      CognitoIdentityProviderClient.prototype.send as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(commandOutput);

    const result = await provider.verifyUserAttributeCommand(mfaConfirmCodeDto);

    expect(CognitoIdentityProviderClient.prototype.send).toHaveBeenCalledWith(
      expect.any(VerifyUserAttributeCommand)
    );
    expect(result).toEqual(commandOutput);
  });

  test('Deve ser possível chamar a função ChangePasswordCommand corretamente', async () => {
    const changePasswordDto = {
      password: 'oldPassword',
      newPassword: 'newPassword',
      accessToken: 'testAccessToken',
    };
    const commandOutput = undefined;

    (
      CognitoIdentityProviderClient.prototype.send as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(commandOutput);

    const result = await provider.changePasswordCommand(changePasswordDto);

    expect(CognitoIdentityProviderClient.prototype.send).toHaveBeenCalledWith(
      expect.any(ChangePasswordCommand)
    );
    expect(result).toEqual(commandOutput);
  });

  test('Deve ser possível chamar a função ForgotPasswordCommand corretamente', async () => {
    const username = 'testuser';
    const commandOutput = undefined;

    (
      CognitoIdentityProviderClient.prototype.send as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(commandOutput);

    const result = await provider.forgotPasswordCommand(username);

    expect(CognitoIdentityProviderClient.prototype.send).toHaveBeenCalledWith(
      expect.any(ForgotPasswordCommand)
    );
    expect(result).toEqual(commandOutput);
  });

  test('Deve ser possível chamar a função ConfirmForgotPasswordCommand corretamente', async () => {
    const resetPasswordConfirmcodeDto: ResetPasswordConfirmcodeDto = {
      username: 'testuser',
      code: '123456',
      password: 'newPassword',
    };
    const commandOutput = undefined;

    (
      CognitoIdentityProviderClient.prototype.send as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(commandOutput);

    const result = await provider.confirmForgotPasswordCommand(
      resetPasswordConfirmcodeDto
    );

    expect(CognitoIdentityProviderClient.prototype.send).toHaveBeenCalledWith(
      expect.any(ConfirmForgotPasswordCommand)
    );
    expect(result).toEqual(commandOutput);
  });

  test('Deve ser possível chamar a função SignUpCommand corretamente', async () => {
    const signUpDto: SignUpDto = {
      email: 'teste@gmail.com',
      phoneNumber: '54999999999',
      username: '123123123',
      firstName: 'teste',
      lastName: 'teste',
      password: '123123',
      birthdate: '07/11/2000',
    };
    const userAttributes: UserAttributes = [
      { Name: 'email', Value: 'testuser@example.com' },
    ];
    const commandOutput = {};

    (
      CognitoIdentityProviderClient.prototype.send as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(commandOutput);

    await provider.signUpCommand(signUpDto, userAttributes);

    expect(CognitoIdentityProviderClient.prototype.send).toHaveBeenCalledWith(
      expect.any(SignUpCommand)
    );
  });

  test('Deve ser possível chamar a função ConfirmSignUpCommand corretamente', async () => {
    const singUpConfirmDto: SignUpConfirmDto = {
      username: 'testuser',
      code: '123456',
    };
    const commandOutput = {};

    (
      CognitoIdentityProviderClient.prototype.send as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(commandOutput);

    await provider.confirmSignUpCommand(singUpConfirmDto);

    expect(CognitoIdentityProviderClient.prototype.send).toHaveBeenCalledWith(
      expect.any(ConfirmSignUpCommand)
    );
  });

  test('Deve ser possível chamar a função GetUserCommand corretamente', async () => {
    const accessToken = 'testAccessToken';
    const commandOutput = { Username: 'testuser' };

    (
      CognitoIdentityProviderClient.prototype.send as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(commandOutput);

    const result = await provider.getUserCommand(accessToken);

    expect(CognitoIdentityProviderClient.prototype.send).toHaveBeenCalledWith(
      expect.any(GetUserCommand)
    );
    expect(result).toEqual(commandOutput);
  });

  test('Deve ser possível chamar a função DeleteUserCommand corretamente', async () => {
    const accessToken = 'testAccessToken';
    const commandOutput = {};

    (
      CognitoIdentityProviderClient.prototype.send as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(commandOutput);

    await provider.deleteUserCommand(accessToken);

    expect(CognitoIdentityProviderClient.prototype.send).toHaveBeenCalledWith(
      expect.any(DeleteUserCommand)
    );
  });

  test('Deve ser possível chamar a função AdminGetUserCommand corretamente', async () => {
    const username = 'testuser';
    const commandOutput = { Username: 'testuser' };

    (
      CognitoIdentityProviderClient.prototype.send as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(commandOutput);

    const result = await provider.adminGetUserCommand(username);

    expect(CognitoIdentityProviderClient.prototype.send).toHaveBeenCalledWith(
      expect.any(AdminGetUserCommand)
    );
    expect(result).toEqual(commandOutput);
  });
});
