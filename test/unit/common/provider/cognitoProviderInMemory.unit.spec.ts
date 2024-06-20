import { LoginDto } from 'src/modules/auth/domain/dtos/login/login.dto';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { SignUpConfirmDto } from 'src/modules/user/domain/dtos/signUpConfirm/signUpConfirm.dto';
import { UserAttributes } from 'src/modules/user/domain/interfaces/userAttributes.interface';
import { UserStatusType } from '@aws-sdk/client-cognito-identity-provider';
import { CognitoProviderInMemory } from 'src/shared/providers/aws/cognito/in-memory/cognito.providerInMemory';
import { MfaConfirmCodeDto } from 'src/modules/auth/domain/dtos/mfaConfirmCode/mfaConfirmCode.dto';
import { ChangePasswordDto } from 'src/modules/reset/domain/dtos/changePassword/changePassword.dto';
import { ResetPasswordConfirmcodeDto } from 'src/modules/reset/domain/dtos/resetPasswordConfirmCode/resetPasswordConfirmCode.dto';
import { ThrowsMessages } from 'src/shared/providers/aws/cognito/enum/throwsMessages.enum';

describe('CognitoProviderInMemory', () => {
  let cognitoProvider: CognitoProviderInMemory;

  beforeEach(() => {
    cognitoProvider = new CognitoProviderInMemory();
  });

  describe('signUpCommand', () => {
    it('should sign up a new user', async () => {
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '54999999999',
        username: 'testuser',
        firstName: 'Teste',
        lastName: 'User',
        password: 'password123',
        birthdate: '07/11/2000',
      };
      const userAttributes: UserAttributes = [
        { Name: 'email', Value: 'teste@gmail.com' },
      ];

      await cognitoProvider.signUpCommand(signUp, userAttributes);

      expect(cognitoProvider['users']).toHaveLength(1);
      expect(cognitoProvider['users'][0]).toEqual({
        username: 'testuser',
        password: 'password123',
        userStatus: UserStatusType.UNCONFIRMED,
        userAttributes: userAttributes,
      });
    });

    it('should throw an error if the user already exists', async () => {
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '54999999999',
        username: 'testuser',
        firstName: 'Teste',
        lastName: 'User',
        password: 'password123',
        birthdate: '07/11/2000',
      };
      const userAttributes: UserAttributes = [
        { Name: 'email', Value: 'teste@gmail.com' },
      ];

      await cognitoProvider.signUpCommand(signUp, userAttributes);

      await expect(
        cognitoProvider.signUpCommand(signUp, userAttributes)
      ).rejects.toThrowError('User already exists');
    });
  });

  describe('initiateAuthCommand', () => {
    it('should authenticate a user with correct credentials', async () => {
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '54999999999',
        username: 'testuser',
        firstName: 'Teste',
        lastName: 'User',
        password: 'password123',
        birthdate: '07/11/2000',
      };
      const userAttributes: UserAttributes = [
        { Name: 'email', Value: 'teste@gmail.com' },
      ];

      await cognitoProvider.signUpCommand(signUp, userAttributes);

      const login: LoginDto = {
        username: 'testuser',
        password: 'password123',
      };

      const result = await cognitoProvider.initiateAuthCommand(login);

      expect(result.AuthenticationResult.AccessToken).toBe('token');
    });

    it('should throw an error if the user does not exist', async () => {
      const login: LoginDto = {
        username: 'nonexistentuser',
        password: 'password123',
      };

      await expect(
        cognitoProvider.initiateAuthCommand(login)
      ).rejects.toThrowError('User does not exist.');
    });

    it('should throw an error if the password is incorrect', async () => {
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '54999999999',
        username: 'testuser',
        firstName: 'Teste',
        lastName: 'User',
        password: 'password123',
        birthdate: '07/11/2000',
      };
      const userAttributes: UserAttributes = [
        { Name: 'email', Value: 'teste@gmail.com' },
      ];

      await cognitoProvider.signUpCommand(signUp, userAttributes);

      const login: LoginDto = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      await expect(
        cognitoProvider.initiateAuthCommand(login)
      ).rejects.toThrowError('Incorrect username or password.');
    });
  });

  describe('getUserAttributeVerificationCodeCommand', () => {
    it('should return code delivery details if the access token is valid', async () => {
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '54999999999',
        username: 'testuser',
        firstName: 'Teste',
        lastName: 'User',
        password: 'password123',
        birthdate: '07/11/2000',
      };
      const userAttributes: UserAttributes = [
        { Name: 'email', Value: 'teste@gmail.com' },
      ];

      await cognitoProvider.signUpCommand(signUp, userAttributes);

      const result =
        await cognitoProvider.getUserAttributeVerificationCodeCommand(
          'testuser'
        );

      expect(result.CodeDeliveryDetails.Destination).toBe('t***@t***');
    });

    it('should throw an error if the access token is invalid', async () => {
      await expect(
        cognitoProvider.getUserAttributeVerificationCodeCommand('invalidtoken')
      ).rejects.toThrowError('Could not verify signature for Access Token');
    });
  });

  describe('verifyUserAttributeCommand', () => {
    it('should verify user attribute if the code is correct', async () => {
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '54999999999',
        username: 'testuser',
        firstName: 'Teste',
        lastName: 'User',
        password: 'password123',
        birthdate: '07/11/2000',
      };
      const userAttributes: UserAttributes = [
        { Name: 'email', Value: 'teste@gmail.com' },
      ];

      await cognitoProvider.signUpCommand(signUp, userAttributes);

      const mfaConfirmCode: MfaConfirmCodeDto = {
        accessToken: 'testuser',
        code: '123456',
      };

      await expect(
        cognitoProvider.verifyUserAttributeCommand(mfaConfirmCode)
      ).resolves.toBeUndefined();
    });

    it('should throw an error if the access token is invalid', async () => {
      const mfaConfirmCode: MfaConfirmCodeDto = {
        accessToken: 'invalidtoken',
        code: '123456',
      };

      await expect(
        cognitoProvider.verifyUserAttributeCommand(mfaConfirmCode)
      ).rejects.toThrowError('Could not verify signature for Access Token');
    });

    it('should throw an error if the code is incorrect', async () => {
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '54999999999',
        username: 'testuser',
        firstName: 'Teste',
        lastName: 'User',
        password: 'password123',
        birthdate: '07/11/2000',
      };
      const userAttributes: UserAttributes = [
        { Name: 'email', Value: 'teste@gmail.com' },
      ];

      await cognitoProvider.signUpCommand(signUp, userAttributes);

      const mfaConfirmCode: MfaConfirmCodeDto = {
        accessToken: 'testuser',
        code: 'wrongcode',
      };

      await expect(
        cognitoProvider.verifyUserAttributeCommand(mfaConfirmCode)
      ).rejects.toThrowError(
        'Invalid verification code provided, please try again.'
      );
    });
  });

  describe('changePasswordCommand', () => {
    it('should change the user password if the access token and current password are correct', async () => {
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '54999999999',
        username: 'testuser',
        firstName: 'Teste',
        lastName: 'User',
        password: 'password123',
        birthdate: '07/11/2000',
      };
      const userAttributes: UserAttributes = [
        { Name: 'email', Value: 'teste@gmail.com' },
      ];

      await cognitoProvider.signUpCommand(signUp, userAttributes);

      const changePassword: ChangePasswordDto = {
        accessToken: 'testuser',
        password: 'password123',
        newPassword: 'newpassword123',
      };

      await cognitoProvider.changePasswordCommand(changePassword);

      const user = cognitoProvider['users'].find(
        user => user.username === 'testuser'
      );
      expect(user.password).toBe('newpassword123');
    });

    it('should throw an error if the access token is invalid', async () => {
      const changePassword: ChangePasswordDto = {
        accessToken: 'invalidtoken',
        password: 'password123',
        newPassword: 'newpassword123',
      };

      await expect(
        cognitoProvider.changePasswordCommand(changePassword)
      ).rejects.toThrowError('Could not verify signature for Access Token');
    });

    it('should throw an error if the current password is incorrect', async () => {
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '54999999999',
        username: 'testuser',
        firstName: 'Teste',
        lastName: 'User',
        password: 'password123',
        birthdate: '07/11/2000',
      };
      const userAttributes: UserAttributes = [
        { Name: 'email', Value: 'teste@gmail.com' },
      ];

      await cognitoProvider.signUpCommand(signUp, userAttributes);

      const changePassword: ChangePasswordDto = {
        accessToken: 'testuser',
        password: 'wrongpassword',
        newPassword: 'newpassword123',
      };

      await expect(
        cognitoProvider.changePasswordCommand(changePassword)
      ).rejects.toThrowError('Incorrect username or password.');
    });
  });

  describe('forgotPasswordCommand', () => {
    it('should not throw an error if the username exists', async () => {
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '54999999999',
        username: 'testuser',
        firstName: 'Teste',
        lastName: 'User',
        password: 'password123',
        birthdate: '07/11/2000',
      };
      const userAttributes: UserAttributes = [
        { Name: 'email', Value: 'teste@gmail.com' },
      ];

      await cognitoProvider.signUpCommand(signUp, userAttributes);

      await expect(
        cognitoProvider.forgotPasswordCommand('testuser')
      ).resolves.toBeUndefined();
    });

    it('should throw an error if the username does not exist', async () => {
      await expect(
        cognitoProvider.forgotPasswordCommand('nonexistentuser')
      ).rejects.toThrowError('User does not exist.');
    });
  });

  describe('confirmForgotPasswordCommand', () => {
    it('should reset the user password if the code is correct', async () => {
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '54999999999',
        username: 'testuser',
        firstName: 'Teste',
        lastName: 'User',
        password: 'password123',
        birthdate: '07/11/2000',
      };
      const userAttributes: UserAttributes = [
        { Name: 'email', Value: 'teste@gmail.com' },
      ];

      await cognitoProvider.signUpCommand(signUp, userAttributes);

      const resetPasswordConfirmcode: ResetPasswordConfirmcodeDto = {
        username: 'testuser',
        code: '123456',
        password: 'newpassword123',
      };

      await cognitoProvider.confirmForgotPasswordCommand(
        resetPasswordConfirmcode
      );

      const user = cognitoProvider['users'].find(
        user => user.username === 'testuser'
      );
      expect(user.password).toBe('newpassword123');
    });

    it('should throw an error if the username does not exist', async () => {
      const resetPasswordConfirmcode: ResetPasswordConfirmcodeDto = {
        username: 'nonexistentuser',
        code: '123456',
        password: 'newpassword123',
      };

      await expect(
        cognitoProvider.confirmForgotPasswordCommand(resetPasswordConfirmcode)
      ).rejects.toThrowError('User does not exist.');
    });

    it('should throw an error if the code is incorrect', async () => {
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '54999999999',
        username: 'testuser',
        firstName: 'Teste',
        lastName: 'User',
        password: 'password123',
        birthdate: '07/11/2000',
      };
      const userAttributes: UserAttributes = [
        { Name: 'email', Value: 'teste@gmail.com' },
      ];

      await cognitoProvider.signUpCommand(signUp, userAttributes);

      const resetPasswordConfirmcode: ResetPasswordConfirmcodeDto = {
        username: 'testuser',
        code: 'wrongcode',
        password: 'newpassword123',
      };

      await expect(
        cognitoProvider.confirmForgotPasswordCommand(resetPasswordConfirmcode)
      ).rejects.toThrowError(
        'Invalid verification code provided, please try again.'
      );
    });
  });

  describe('confirmSignUpCommand', () => {
    it('should confirm user sign up', async () => {
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '54999999999',
        username: 'testuser',
        firstName: 'Teste',
        lastName: 'User',
        password: 'password123',
        birthdate: '07/11/2000',
      };
      const userAttributes: UserAttributes = [
        { Name: 'email', Value: 'teste@gmail.com' },
      ];

      await cognitoProvider.signUpCommand(signUp, userAttributes);

      const confirmSignUp: SignUpConfirmDto = {
        username: 'testuser',
        code: '123456',
      };

      await cognitoProvider.confirmSignUpCommand(confirmSignUp);

      const user = cognitoProvider['users'].find(
        user => user.username === 'testuser'
      );
      expect(user.userStatus).toBe(UserStatusType.CONFIRMED);
    });

    it('should throw an error if the user does not exist', async () => {
      const confirmSignUp: SignUpConfirmDto = {
        username: 'nonexistentuser',
        code: '123456',
      };

      await expect(
        cognitoProvider.confirmSignUpCommand(confirmSignUp)
      ).rejects.toThrowError(ThrowsMessages.USER_CLIENT_NOT_FOUND_EXCEPTION);
    });

    it('should throw an error if the code is incorrect', async () => {
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '54999999999',
        username: 'testuser',
        firstName: 'Teste',
        lastName: 'User',
        password: 'password123',
        birthdate: '07/11/2000',
      };
      const userAttributes: UserAttributes = [
        { Name: 'email', Value: 'teste@gmail.com' },
      ];

      await cognitoProvider.signUpCommand(signUp, userAttributes);

      const confirmSignUp: SignUpConfirmDto = {
        username: 'testuser',
        code: 'wrongcode',
      };

      await expect(
        cognitoProvider.confirmSignUpCommand(confirmSignUp)
      ).rejects.toThrowError(
        'Invalid verification code provided, please try again.'
      );
    });
  });

  describe('getUserCommand', () => {
    it('should get a user by access token', async () => {
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '54999999999',
        username: 'testuser',
        firstName: 'Teste',
        lastName: 'User',
        password: 'password123',
        birthdate: '07/11/2000',
      };
      const userAttributes: UserAttributes = [
        { Name: 'email', Value: 'teste@gmail.com' },
      ];

      await cognitoProvider.signUpCommand(signUp, userAttributes);

      const result = await cognitoProvider.getUserCommand('testuser');

      expect(result.Username).toBe('testuser');
      expect(result.UserAttributes).toBe(userAttributes);
    });

    it('should throw an error if the access token is invalid', async () => {
      await expect(
        cognitoProvider.getUserCommand('invalidtoken')
      ).rejects.toThrowError('Could not verify signature for Access Token');
    });
  });

  describe('deleteUserCommand', () => {
    it('should throw an error if the access token is invalid', async () => {
      await expect(
        cognitoProvider.deleteUserCommand('invalidtoken')
      ).rejects.toThrowError('Could not verify signature for Access Token');
    });
  });

  describe('adminGetUserCommand', () => {
    it('should get a user by username', async () => {
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '54999999999',
        username: 'testuser',
        firstName: 'Teste',
        lastName: 'User',
        password: 'password123',
        birthdate: '07/11/2000',
      };
      const userAttributes: UserAttributes = [
        { Name: 'email', Value: 'teste@gmail.com' },
      ];

      await cognitoProvider.signUpCommand(signUp, userAttributes);

      const result = await cognitoProvider.adminGetUserCommand('testuser');

      expect(result.Username).toBe('testuser');
      expect(result.UserStatus).toBe(UserStatusType.UNCONFIRMED);
    });

    it('should throw an error if the user does not exist', async () => {
      await expect(
        cognitoProvider.adminGetUserCommand('nonexistentuser')
      ).rejects.toThrowError('User does not exist.');
    });
  });
});
