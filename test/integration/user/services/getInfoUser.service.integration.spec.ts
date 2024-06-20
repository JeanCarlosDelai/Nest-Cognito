import { GetUserCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GetInfoResponseDto } from 'src/modules/user/domain/dtos/getInfo/getInfoResponse.dto';
import { SignUpDto } from 'src/modules/user/domain/dtos/signUp/signUp.dto';
import { GetInfoUserService } from 'src/modules/user/services/getInfoUser.service';
import { SignUpService } from 'src/modules/user/services/signUp.service';
import { CognitoContract } from 'src/shared/common/contracts/providers/Cognito.contract';
import { Throws } from 'src/shared/providers/aws/cognito/enum/throws.enum';
import { ThrowsMessages } from 'src/shared/providers/aws/cognito/enum/throwsMessages.enum';
import { CognitoProviderInMemory } from 'src/shared/providers/aws/cognito/in-memory/cognito.providerInMemory';

describe('GetInfoUserServiceIntegration', () => {
  let signUpService: SignUpService;
  let getInfoUserService: GetInfoUserService;
  let cognito: CognitoContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpService,
        GetInfoUserService,
        {
          provide: CognitoContract,
          useClass: CognitoProviderInMemory,
        },
      ],
    }).compile();

    signUpService = module.get<SignUpService>(SignUpService);
    getInfoUserService = module.get<GetInfoUserService>(GetInfoUserService);
    cognito = module.get<CognitoContract>(CognitoContract);
  });

  test('Deve estar definido', () => {
    expect(signUpService).toBeDefined();
    expect(getInfoUserService).toBeDefined();
    expect(cognito).toBeDefined();
  });

  describe('getInfoUser', () => {
    test('Deve ser possível listar as informações do usuário', async () => {
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

      const accessToken = signUp.username;
      const expectedResponse: GetUserCommandOutput = {
        Username: signUp.username,
        UserAttributes: [
          {
            Name: 'email',
            Value: signUp.email,
          },
          {
            Name: 'phone_number',
            Value: signUp.phoneNumber,
          },
          {
            Name: 'birthdate',
            Value: signUp.birthdate,
          },
          {
            Name: 'name',
            Value: signUp.firstName,
          },
          {
            Name: 'custom:last_name',
            Value: signUp.lastName,
          },
        ],
        $metadata: null,
      };
      const mappedResponse = new GetInfoResponseDto(
        expectedResponse.Username,
        expectedResponse.UserAttributes
      );
      //Act
      const result = await getInfoUserService.getInfoUser(accessToken);
      // //Assert
      expect(result).toEqual(mappedResponse);
    });

    test('Não deve ser possível retornar as informações do usuário se ele não existe', async () => {
      // Arrange
      const accessToken = '123ff';
      // Act / Assert
      try {
        await getInfoUserService.getInfoUser(accessToken);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.response).toEqual({
          statusCode: 500,
          message: [ThrowsMessages.INVALID_ACCESS_TOKEN],
          error: Throws.NOT_AUTHORIZED_EXCEPTION,
        });
      }
    });
  });
});
