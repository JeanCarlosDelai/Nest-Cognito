import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ChangePasswordDto } from 'src/modules/reset/domain/dtos/changePassword/changePassword.dto';
import { ChangePasswordService } from 'src/modules/reset/services/changePassword.service';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { SignUpService } from 'src/modules/user/services/signUp.service';
import { CHANGE_PASSWORD_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { Throws } from 'src/shared/providers/aws/cognito/enum/throws.enum';
import { ThrowsMessages } from 'src/shared/providers/aws/cognito/enum/throwsMessages.enum';
import { CognitoProviderInMemory } from 'src/shared/providers/aws/cognito/in-memory/cognito.providerInMemory';

describe('ChangePasswordServiceUnit', () => {
  let signUpService: SignUpService;
  let changePasswordService: ChangePasswordService;
  let cognito: CognitoContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpService,
        ChangePasswordService,
        {
          provide: CognitoContract,
          useClass: CognitoProviderInMemory,
        },
      ],
    }).compile();

    signUpService = module.get<SignUpService>(SignUpService);
    changePasswordService = module.get<ChangePasswordService>(
      ChangePasswordService
    );
    cognito = module.get<CognitoContract>(CognitoContract);
  });

  test('Deve estar definido', () => {
    expect(signUpService).toBeDefined();
    expect(changePasswordService).toBeDefined();
    expect(cognito).toBeDefined();
  });

  describe('changePassword', () => {
    test('Deve ser possível alterar a senha do usuário se ele estiver logado', async () => {
      //Arrange
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '+5554999999999',
        username: '01234567900',
        firstName: 'teste',
        lastName: 'teste',
        password: '123123',
        birthdate: '07/11/2000',
      };
      await signUpService.signUp(signUp);

      const changePassword: ChangePasswordDto = {
        password: signUp.password,
        newPassword: '123',
        accessToken: signUp.username,
      };
      const expectedResponse: OnlyMessageResponseDto = {
        message: CHANGE_PASSWORD_SUCCESS,
      };
      //Act
      const result = await changePasswordService.changePassword(changePassword);
      //Assert
      expect(result).toEqual(expectedResponse);
    });

    test('Não deve ser possível alterar a senha se for um accessToken inválido', async () => {
      // Arrange
      const changePassword: ChangePasswordDto = {
        password: '123',
        newPassword: '123',
        accessToken: 'InvalidToken',
      };
      // Act / Assert
      try {
        await changePasswordService.changePassword(changePassword);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.response).toEqual({
          statusCode: 500,
          message: [ThrowsMessages.INVALID_ACCESS_TOKEN],
          error: Throws.NOT_AUTHORIZED_EXCEPTION,
        });
      }
    });

    test('Não deve ser possível alterar a senha se a senha estiver incorreta', async () => {
      // Arrange
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '+5554999999999',
        username: '01234567900',
        firstName: 'teste',
        lastName: 'teste',
        password: '123123',
        birthdate: '07/11/2000',
      };
      await signUpService.signUp(signUp);

      const changePassword: ChangePasswordDto = {
        password: '22222',
        newPassword: '123',
        accessToken: signUp.username,
      };
      // Act / Assert
      try {
        await changePasswordService.changePassword(changePassword);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.response).toEqual({
          statusCode: 500,
          message: [ThrowsMessages.INCORRECT_PASSWORD],
          error: Throws.NOT_AUTHORIZED_EXCEPTION,
        });
      }
    });
  });
});
