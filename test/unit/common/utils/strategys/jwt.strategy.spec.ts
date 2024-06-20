import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from 'src/shared/common/strategys/jwt.strategy';
import { CognitoConfig } from 'src/shared/providers/aws/cognito/cognito.config';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: CognitoConfig,
          useValue: {
            clientId: 'your_client_id',
            authority: 'your_authority',
          },
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  test('Deve ser definido', () => {
    expect(jwtStrategy).toBeDefined();
  });

  test('Deve ser possível retornar um objeto contendo idUsuario e email após a validação', async () => {
    const payload = {
      sub: 'user_id',
      email: 'user@example.com',
    };
    const result = await jwtStrategy.validate(payload);
    expect(result).toEqual({ idUsuario: 'user_id', email: 'user@example.com' });
  });
});
