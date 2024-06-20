import { Test, TestingModule } from '@nestjs/testing';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { SignUpService } from 'src/modules/user/services/signUp.service';
import { SIGN_UP_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { vi } from 'vitest';

describe('SignUpServiceUnit', () => {
  let signUpService: SignUpService;
  let cognito: CognitoContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpService,
        {
          provide: CognitoContract,
          useValue: {
            signUpCommand: vi.fn(),
          },
        },
      ],
    }).compile();

    signUpService = module.get<SignUpService>(SignUpService);
    cognito = module.get<CognitoContract>(CognitoContract);
  });

  test('Deve estar definido', () => {
    expect(signUpService).toBeDefined();
    expect(cognito).toBeDefined();
  });

  describe('singUp', () => {
    test('Deve ser possível realizar o cadastro do usuário', async () => {
      //Arrange
      const signUp: SignUpDto = {
        email: 'teste@gmail.com',
        phoneNumber: '54999999999',
        username: '123123123',
        firstName: 'teste',
        lastName: 'teste',
        password: '123123',
        birthdate: '07/11/2000',
      };
      const expectedResponse: OnlyMessageResponseDto = {
        message: SIGN_UP_SUCCESS,
      };
      //Act
      const result = await signUpService.signUp(signUp);
      //Assert
      expect(result).toEqual(expectedResponse);
      expect(cognito.signUpCommand).toHaveBeenCalledWith(signUp, [
        { Name: 'email', Value: signUp.email },
        { Name: 'phone_number', Value: signUp.phoneNumber },
        { Name: 'birthdate', Value: signUp.birthdate },
        { Name: 'name', Value: signUp.firstName },
        { Name: 'custom:last_name', Value: signUp.lastName },
      ]);
    });

    test('Deve ser possível lançar uma exceção', async () => {
      // Arrange
      const errorMessage = 'error';
      const error = new Error(errorMessage);
      error.name = 'erroException';
      vi.spyOn(cognito, 'signUpCommand').mockRejectedValue(error);
      // Act & Assert
      await expect(signUpService.signUp(null)).rejects.toThrowError();
    });
  });
});
