import { Test, TestingModule } from '@nestjs/testing';
import { SignUpController } from 'src/modules/user/controllers/signUp.controller';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { SignUpService } from 'src/modules/user/services/signUp.service';
import { SIGN_UP_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
import { OnlyMessageResponseDto } from 'src/shared/common/dtos/onlyMessageResponse.dto';
import { vi } from 'vitest';

describe('SignUpControllerUnit', () => {
  let signUpController: SignUpController;
  let signUpService: SignUpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignUpController],
      providers: [
        {
          provide: SignUpService,
          useValue: {
            signUp: vi.fn(),
          },
        },
      ],
    }).compile();

    signUpController = module.get<SignUpController>(SignUpController);
    signUpService = module.get<SignUpService>(SignUpService);
  });

  test('Deve estar definido', () => {
    expect(signUpController).toBeDefined();
    expect(signUpService).toBeDefined();
  });

  describe('singUp', () => {
    test('Deve ser possível realizar o cadastro do usuário', async () => {
      //Arrange
      const userSingUpUsuarioDto: SignUpDto = {
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
      vi.spyOn(signUpService, 'signUp').mockResolvedValueOnce(expectedResponse);
      //Act
      const result = await signUpController.signUp(userSingUpUsuarioDto);
      // //Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});
