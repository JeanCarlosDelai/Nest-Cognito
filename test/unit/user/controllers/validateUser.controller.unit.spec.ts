import { UserStatusType } from '@aws-sdk/client-cognito-identity-provider';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidateUserController } from 'src/modules/user/controllers/validateUser.controller';
import { ValidateUserDto } from 'src/modules/user/domain/dtos/validateUser/validateUser.dto';
import { ValidateUserResponseDto } from 'src/modules/user/domain/dtos/validateUser/validateUserResponse.dto';
import { ValidateUserService } from 'src/modules/user/services/validateUser.service';
import { vi } from 'vitest';

describe('ValidateUserControllerUnit', () => {
  let validateUserController: ValidateUserController;
  let validateUserService: ValidateUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ValidateUserController],
      providers: [
        {
          provide: ValidateUserService,
          useValue: {
            validateUser: vi.fn(),
          },
        },
      ],
    }).compile();

    validateUserController = module.get<ValidateUserController>(
      ValidateUserController
    );
    validateUserService = module.get<ValidateUserService>(ValidateUserService);
  });

  test('Deve estar definido', () => {
    expect(validateUserController).toBeDefined();
    expect(validateUserService).toBeDefined();
  });

  describe('validate', () => {
    test('Deve ser possível retornar e validar o usuário (Sucesso)', async () => {
      //Arrange
      const usernameValidateDto: ValidateUserDto = {
        username: '123123',
      };
      const expectedResponse: ValidateUserResponseDto = {
        userStatus: UserStatusType.CONFIRMED,
      };
      vi.spyOn(validateUserService, 'validateUser').mockResolvedValueOnce(
        expectedResponse
      );
      //Act
      const result = await validateUserController.validateUser(
        usernameValidateDto
      );
      // //Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});
