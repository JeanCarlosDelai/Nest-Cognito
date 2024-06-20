import { Test, TestingModule } from '@nestjs/testing';
import { GetInfoUserController } from 'src/modules/user/controllers/getInfoUser.controller';
import { GetInfoResponseDto } from 'src/modules/user/domain/dtos/getInfo/getInfoResponse.dto';
import { GetInfoUserService } from 'src/modules/user/services/getInfoUser.service';
import { vi } from 'vitest';

describe('GetinfoUserControllerUnit', () => {
  let getInfoUserController: GetInfoUserController;
  let getInfoUserService: GetInfoUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetInfoUserController],
      providers: [
        {
          provide: GetInfoUserService,
          useValue: {
            getInfoUser: vi.fn(),
          },
        },
      ],
    }).compile();

    getInfoUserController = module.get<GetInfoUserController>(
      GetInfoUserController
    );
    getInfoUserService = module.get<GetInfoUserService>(GetInfoUserService);
  });

  test('Deve estar definido', () => {
    expect(getInfoUserController).toBeDefined();
    expect(getInfoUserService).toBeDefined();
  });

  describe('getInfo', () => {
    test('Deve ser possível retornar as informações sobre o usuário', async () => {
      //Arrange
      const accessToken = 'accessToken';
      const expectedResponse: GetInfoResponseDto = {
        username: '2222',
        userAttributes: [
          {
            Name: 'sub',
            Value: '123123',
          },
          {
            Name: 'birthdate',
            Value: '07/11/2010',
          },
          {
            Name: 'email_verified',
            Value: 'true',
          },
          {
            Name: 'firstName',
            Value: 'teste',
          },
          {
            Name: 'lastName',
            Value: 'teste',
          },
          {
            Name: 'phone_number_verified',
            Value: 'false',
          },
          {
            Name: 'phone_number',
            Value: '+5599999999999',
          },
          {
            Name: 'email',
            Value: 'teste.test@gmail.com',
          },
        ],
      };
      vi.spyOn(getInfoUserService, 'getInfoUser').mockResolvedValueOnce(
        expectedResponse
      );
      //Act
      const result = await getInfoUserController.getInfoUser(accessToken);
      // //Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});
