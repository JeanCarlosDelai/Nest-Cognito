import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from 'src/modules/auth/controllers/login.controller';
import { LoginDto } from 'src/modules/auth/domain/dtos/login/login.dto';
import { LoginResponseDto } from 'src/modules/auth/domain/dtos/login/loginResponse.dto';
import { LoginService } from 'src/modules/auth/services/login.service';
import { vi } from 'vitest';

describe('LoginControllerUnit', () => {
  let loginController: LoginController;
  let loginService: LoginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        {
          provide: LoginService,
          useValue: {
            login: vi.fn(),
          },
        },
      ],
    }).compile();

    loginController = module.get<LoginController>(LoginController);
    loginService = module.get<LoginService>(LoginService);
  });

  test('Deve estar definido', () => {
    expect(loginController).toBeDefined();
    expect(loginService).toBeDefined();
  });

  describe('login', () => {
    test('Deve ser possível efetuar o login', async () => {
      //Arrange
      const changePassword: LoginDto = {
        username: '123',
        password: '123',
      };
      const expectedResponse: LoginResponseDto = {
        AccessToken: '123',
        IdToken: '123',
        RefreshToken: '123',
      };
      vi.spyOn(loginService, 'login').mockResolvedValueOnce(expectedResponse);
      //Act
      const result = await loginController.login(changePassword);
      // //Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});
